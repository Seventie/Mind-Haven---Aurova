const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const DoctorProfile = require('../models/DoctorProfile');
const Consultation = require('../models/Consultation');
const User = require('../models/User');
const Journal = require('../models/Journal');

// ============================================================
// PUBLIC ROUTES (Authentication required, any role allowed)
// ============================================================

// @route   GET /api/doctor/discovery
// @desc    Get all verified doctors for patient booking (PUBLIC for logged-in users)
router.get('/discovery', auth, async (req, res) => {
    try {
        const doctors = await DoctorProfile.find({})
            .select('-licenseId -stats.amountEarned -stats.hoursCommitted -clinicalForms.fields')
            .populate('userId', 'displayName email');

        // Cleanup expired locks
        const now = new Date();
        for (let doc of doctors) {
            let changed = false;
            doc.dailySchedules.forEach(day => {
                day.slots.forEach(slot => {
                    if (slot.status === 'in-progress' && slot.lockExpires && slot.lockExpires < now) {
                        slot.status = 'available';
                        slot.lockExpires = null;
                        changed = true;
                    }
                });
            });
            if (changed) await doc.save();
        }

        res.json(doctors);
    } catch (err) {
        console.error('Discovery Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ============================================================
// SLOT BOOKING ROUTES (For patients)
// ============================================================

// @route   POST /api/doctor/slots/lock
// @desc    Lock a slot temporarily for booking
router.post('/slots/lock', auth, async (req, res) => {
    const { doctorId, date, slotId } = req.body;
    try {
        const profile = await DoctorProfile.findOne({ userId: doctorId });
        if (!profile) return res.status(404).json({ message: 'Doctor not found' });

        const day = profile.dailySchedules.find(d => d.date === date);
        if (!day) return res.status(404).json({ message: 'Date not available' });

        const slot = day.slots.id(slotId);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });

        if (slot.status !== 'available') {
            return res.status(400).json({ message: 'Slot is no longer available' });
        }

        // Lock the slot for 10 minutes
        slot.status = 'in-progress';
        slot.lockExpires = new Date(Date.now() + 10 * 60 * 1000);
        await profile.save();

        // Return active form if doctor has one
        const activeForm = profile.clinicalForms.id(profile.activeFormId);

        res.json({
            message: 'Slot locked successfully',
            lockExpires: slot.lockExpires,
            clinicalForm: activeForm || null
        });
    } catch (err) {
        console.error('Lock Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/doctor/slots/unlock
// @desc    Release a locked slot
router.post('/slots/unlock', auth, async (req, res) => {
    const { doctorId, date, slotId } = req.body;
    try {
        const profile = await DoctorProfile.findOne({ userId: doctorId });
        if (!profile) return res.status(404).json({ message: 'Doctor not found' });

        const day = profile.dailySchedules.find(d => d.date === date);
        if (!day) return res.status(404).json({ message: 'Date not found' });

        const slot = day.slots.id(slotId);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });

        if (slot.status === 'in-progress') {
            slot.status = 'available';
            slot.lockExpires = null;
            await profile.save();
        }

        res.json({ message: 'Slot released' });
    } catch (err) {
        console.error('Unlock Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/doctor/slots/book
// @desc    Confirm booking with clinical form submission
router.post('/slots/book', auth, async (req, res) => {
    const { doctorId, date, slotId, sessionType, clinicalFormData } = req.body;
    try {
        const profile = await DoctorProfile.findOne({ userId: doctorId });
        if (!profile) return res.status(404).json({ message: 'Doctor not found' });

        const day = profile.dailySchedules.find(d => d.date === date);
        if (!day) return res.status(404).json({ message: 'Date not found' });

        const slot = day.slots.id(slotId);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });

        if (slot.status !== 'in-progress') {
            return res.status(400).json({ message: 'Slot booking window expired. Please try again.' });
        }

        // Confirm booking
        slot.status = 'booked';
        slot.patientId = req.user.id;
        slot.lockExpires = null;
        if (sessionType) slot.sessionType = sessionType;

        // Store clinical form data if provided
        if (clinicalFormData) {
            slot.clinicalFormData = {
                ...clinicalFormData,
                filledAt: new Date()
            };
        }

        await profile.save();

        // Create consultation record
        const consultation = new Consultation({
            doctorId: doctorId,
            patientId: req.user.id,
            doctorProfileId: profile._id,
            scheduledTime: new Date(`${date}T${slot.startTime}:00`),
            duration: slot.duration || 30,
            sessionType: slot.sessionType,
            clinicalFormData: clinicalFormData ? {
                ...clinicalFormData,
                filledAt: new Date()
            } : undefined,
            status: 'upcoming'
        });
        await consultation.save();

        res.json({
            message: 'Booking confirmed!',
            consultation: {
                id: consultation._id,
                scheduledTime: consultation.scheduledTime,
                sessionType: consultation.sessionType,
                doctorName: profile.fullName
            }
        });
    } catch (err) {
        console.error('Booking Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/doctor/patient/bookings
// @desc    Get patient's own bookings
router.get('/patient/bookings', auth, async (req, res) => {
    try {
        const consultations = await Consultation.find({ patientId: req.user.id })
            .populate('doctorId', 'displayName email')
            .sort({ scheduledTime: -1 });

        // Get doctor profiles for additional info
        const enrichedConsultations = await Promise.all(consultations.map(async (c) => {
            const profile = await DoctorProfile.findOne({ userId: c.doctorId._id })
                .select('fullName specialization profileImage');
            return {
                id: c._id,
                scheduledTime: c.scheduledTime,
                duration: c.duration,
                sessionType: c.sessionType,
                status: c.status,
                doctor: {
                    id: c.doctorId._id,
                    name: profile?.fullName || c.doctorId.displayName,
                    specialization: profile?.specialization,
                    image: profile?.profileImage
                },
                clinicalFormData: c.clinicalFormData,
                notes: c.notes,
                rating: c.rating
            };
        }));

        res.json(enrichedConsultations);
    } catch (err) {
        console.error('Patient Bookings Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ============================================================
// DOCTOR-ONLY ROUTES
// ============================================================

// Middleware to check doctor role for routes below
// Middleware to check doctor role for routes below
// We allow 'user' and 'patient' to access these for auto-provisioning/upgrading
const doctorOnly = role(['doctor', 'user', 'patient']);

// Helper to ensure user role is upgraded in DB
const ensureDoctorRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (user && user.role !== 'doctor') {
            user.role = 'doctor';
            await user.save();
            console.log(`✅ Upgraded user ${userId} to doctor role in DB`);
        }
    } catch (err) {
        console.error('Failed to upgrade user role:', err.message);
    }
};

// @route   GET /api/doctor/profile
// @desc    Get doctor's own profile
router.get('/profile', auth, doctorOnly, async (req, res) => {
    try {
        console.log(`🔍 GET /profile - User ID: ${req.user.id}, Role: ${req.user.role}`);
        // Upgrade role in DB if needed (backwards compatibility/testing)
        await ensureDoctorRole(req.user.id);

        let profile = await DoctorProfile.findOne({ userId: req.user.id });

        if (!profile) {
            // Create default profile for new doctors
            const user = await User.findById(req.user.id);
            profile = new DoctorProfile({
                userId: req.user.id,
                fullName: user?.displayName || 'Doctor',
                specialization: 'General',
                licenseId: `LICENSE-${req.user.id}`,
                experienceYears: 0,
                bio: 'Please update your bio.'
            });
            await profile.save();
        }

        // Cleanup expired locks
        const now = new Date();
        let changed = false;
        profile.dailySchedules.forEach(day => {
            day.slots.forEach(slot => {
                if (slot.status === 'in-progress' && slot.lockExpires && slot.lockExpires < now) {
                    slot.status = 'available';
                    slot.lockExpires = null;
                    changed = true;
                }
            });
        });
        if (changed) await profile.save();

        res.json(profile);
    } catch (err) {
        console.error('Get Profile Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/doctor/profile
// @desc    Update doctor's profile and schedule
router.put('/profile', auth, doctorOnly, async (req, res) => {
    const {
        fullName,
        specialization,
        licenseId,
        experienceYears,
        education,
        bio,
        profileImage,
        dailySchedules
    } = req.body;

    try {
        console.log(`💾 PUT /profile - User ID: ${req.user.id}, Role: ${req.user.role}`);
        // Upgrade role in DB if needed
        await ensureDoctorRole(req.user.id);

        let profile = await DoctorProfile.findOne({ userId: req.user.id });
        if (!profile) {
            console.log('🐣 Creating missing doctor profile during update...');
            const user = await User.findById(req.user.id);
            profile = new DoctorProfile({
                userId: req.user.id,
                fullName: user?.displayName || 'Doctor',
                specialization: specialization || 'General',
                licenseId: licenseId || `LICENSE-${req.user.id}`,
                experienceYears: experienceYears || 0,
                bio: bio || 'Please update your bio.'
            });
            // Don't save yet, let the updates below fill in more data
        }

        // Update basic fields
        if (fullName) profile.fullName = fullName;
        if (specialization) profile.specialization = specialization;
        if (licenseId) profile.licenseId = licenseId;
        if (experienceYears !== undefined) profile.experienceYears = experienceYears;
        if (education) profile.education = education;
        if (bio) profile.bio = bio;
        if (profileImage) profile.profileImage = profileImage;

        // Handle schedule updates
        if (dailySchedules) {
            console.log('📅 Updating schedules...');

            const now = new Date();
            now.setHours(0, 0, 0, 0);

            // Filter to future dates only
            const filteredSchedules = dailySchedules.filter(day => {
                const dayDate = new Date(day.date);
                return dayDate >= now;
            });

            // Validate booked slots are preserved
            for (const newDay of filteredSchedules) {
                const existingDay = profile.dailySchedules.find(d => d.date === newDay.date);

                if (existingDay) {
                    for (const existingSlot of existingDay.slots) {
                        if (existingSlot.status === 'booked' || existingSlot.status === 'in-progress') {
                            const foundInUpdate = newDay.slots.find(s =>
                                s.startTime === existingSlot.startTime &&
                                (s.status === 'booked' || s.status === 'in-progress')
                            );

                            if (!foundInUpdate) {
                                return res.status(400).json({
                                    message: `Cannot remove booked slot at ${existingSlot.startTime} on ${newDay.date}`
                                });
                            }
                        }
                    }
                }
            }

            profile.dailySchedules = filteredSchedules;
            console.log('✅ Schedule validation passed');
        }

        await profile.save();
        console.log('✅ Profile saved successfully');

        res.json(profile);
    } catch (err) {
        console.error('❌ Profile update error:', err.message);
        res.status(400).json({ message: err.message || 'Failed to update profile' });
    }
});

// @route   POST /api/doctor/forms
// @desc    Create a new clinical form template
router.post('/forms', auth, doctorOnly, async (req, res) => {
    const { title, description, fields } = req.body;
    try {
        const profile = await DoctorProfile.findOne({ userId: req.user.id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        const newForm = {
            title,
            description,
            fields: fields || [],
            isActive: true
        };

        profile.clinicalForms.push(newForm);
        await profile.save();

        const createdForm = profile.clinicalForms[profile.clinicalForms.length - 1];
        res.status(201).json(createdForm);
    } catch (err) {
        console.error('Create Form Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/doctor/forms/:formId/activate
// @desc    Set a form as the active intake form for bookings
router.put('/forms/:formId/activate', auth, doctorOnly, async (req, res) => {
    try {
        const profile = await DoctorProfile.findOne({ userId: req.user.id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        const form = profile.clinicalForms.id(req.params.formId);
        if (!form) return res.status(404).json({ message: 'Form not found' });

        profile.activeFormId = form._id;
        await profile.save();

        res.json({ message: 'Form activated', formId: form._id });
    } catch (err) {
        console.error('Activate Form Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/doctor/consultations
// @desc    Get doctor's consultations (upcoming and past)
router.get('/consultations', auth, doctorOnly, async (req, res) => {
    try {
        const consultations = await Consultation.find({ doctorId: req.user.id })
            .populate('patientId', 'displayName email')
            .sort({ scheduledTime: -1 });

        res.json(consultations);
    } catch (err) {
        console.error('Consultations Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/doctor/consultations/upcoming
// @desc    Get doctor's upcoming consultations only
router.get('/consultations/upcoming', auth, doctorOnly, async (req, res) => {
    try {
        const now = new Date();
        const consultations = await Consultation.find({
            doctorId: req.user.id,
            scheduledTime: { $gte: now },
            status: { $in: ['upcoming', 'in-session'] }
        })
            .populate('patientId', 'displayName email')
            .sort({ scheduledTime: 1 });

        res.json(consultations);
    } catch (err) {
        console.error('Upcoming Consultations Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/doctor/stats
// @desc    Get doctor's practice statistics
router.get('/stats', auth, doctorOnly, async (req, res) => {
    try {
        const profile = await DoctorProfile.findOne({ userId: req.user.id });
        const consultations = await Consultation.find({ doctorId: req.user.id });

        const now = new Date();
        const stats = {
            totalConsultations: consultations.length,
            completedConsultations: consultations.filter(c => c.status === 'completed').length,
            upcomingConsultations: consultations.filter(c => c.scheduledTime > now && c.status === 'upcoming').length,
            cancelledConsultations: consultations.filter(c => c.status === 'cancelled').length,
            avgRating: profile?.stats?.avgRating || 0,
            totalReviews: profile?.reviews?.length || 0,
            hoursCommitted: profile?.stats?.hoursCommitted || 0
        };

        res.json(stats);
    } catch (err) {
        console.error('Stats Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/doctor/consultations/:id/notes
// @desc    Add/update notes for a consultation
router.put('/consultations/:id/notes', auth, doctorOnly, async (req, res) => {
    try {
        const { notes } = req.body;
        const consultation = await Consultation.findOneAndUpdate(
            { _id: req.params.id, doctorId: req.user.id },
            { $set: { notes } },
            { new: true }
        );
        if (!consultation) return res.status(404).json({ message: 'Consultation not found' });
        res.json(consultation);
    } catch (err) {
        console.error('Update Notes Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/doctor/vault
// @desc    Get patient vault (all patients doctor has consulted with)
router.get('/vault', auth, doctorOnly, async (req, res) => {
    try {
        const consultations = await Consultation.find({ doctorId: req.user.id })
            .populate('patientId', 'displayName email')
            .sort({ scheduledTime: -1 });

        // Group by patient
        const patientMap = new Map();
        consultations.forEach(c => {
            if (!c.patientId) return;
            const patientId = c.patientId._id.toString();
            if (!patientMap.has(patientId)) {
                patientMap.set(patientId, {
                    patient: {
                        id: c.patientId._id,
                        displayName: c.patientId.displayName,
                        email: c.patientId.email
                    },
                    consultationCount: 0,
                    lastConsultation: null,
                    consultations: []
                });
            }
            const entry = patientMap.get(patientId);
            entry.consultationCount++;
            if (!entry.lastConsultation || new Date(c.scheduledTime) > new Date(entry.lastConsultation)) {
                entry.lastConsultation = c.scheduledTime;
            }
            entry.consultations.push({
                id: c._id,
                scheduledTime: c.scheduledTime,
                sessionType: c.sessionType,
                status: c.status,
                hasNotes: !!c.notes,
                hasFormData: !!c.clinicalFormData
            });
        });

        res.json(Array.from(patientMap.values()));
    } catch (err) {
        console.error('Vault Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/doctor/patients/:patientId/summary
// @desc    Get detailed patient summary
router.get('/patients/:patientId/summary', auth, doctorOnly, async (req, res) => {
    try {
        // Verify doctor has consulted with this patient
        const hasConsultation = await Consultation.exists({
            doctorId: req.user.id,
            patientId: req.params.patientId
        });

        if (!hasConsultation) {
            return res.status(403).json({ message: 'Access denied: No prior consultation with this patient.' });
        }

        const patient = await User.findById(req.params.patientId).select('displayName email');
        const consultations = await Consultation.find({
            doctorId: req.user.id,
            patientId: req.params.patientId
        }).sort({ scheduledTime: -1 });

        // Get patient journals if available (with patient consent)
        const journals = await Journal.find({ userId: req.params.patientId })
            .sort({ createdAt: -1 })
            .limit(10);

        const insights = journals.map(j => ({
            date: j.createdAt,
            mood: j.aiAnalysis?.mood,
            score: j.aiAnalysis?.score,
            summary: j.aiAnalysis?.summary
        })).filter(i => i.mood);

        res.json({
            patient,
            consultations: consultations.map(c => ({
                id: c._id,
                scheduledTime: c.scheduledTime,
                sessionType: c.sessionType,
                status: c.status,
                notes: c.notes,
                clinicalFormData: c.clinicalFormData,
                rating: c.rating
            })),
            journals: journals.map(j => ({
                id: j._id,
                date: j.createdAt,
                content: j.content,
                aiAnalysis: j.aiAnalysis
            })),
            insights
        });
    } catch (err) {
        console.error('Patient Summary Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/doctor/slots/cancel
// @desc    Cancel an available slot (doctor only)
router.post('/slots/cancel', auth, doctorOnly, async (req, res) => {
    const { date, slotId } = req.body;
    try {
        const profile = await DoctorProfile.findOne({ userId: req.user.id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        const day = profile.dailySchedules.find(d => d.date === date);
        if (!day) return res.status(404).json({ message: 'Date not found' });

        const slot = day.slots.id(slotId);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });

        if (slot.status === 'booked' || slot.status === 'in-progress') {
            return res.status(400).json({
                message: 'Cannot cancel slot with active booking'
            });
        }

        slot.status = 'off';
        await profile.save();

        res.json({ message: 'Slot cancelled' });
    } catch (err) {
        console.error('Cancel Slot Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
