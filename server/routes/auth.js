const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('../config/firebase');
const DoctorProfile = require('../models/DoctorProfile');
const router = express.Router();

// Helper function to generate JWT
const generateToken = (user) => {
    return jwt.sign(
        {
            user: {
                id: user._id,
                role: user.role,
                email: user.email
            }
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password, displayName, role, licenseId, specialization } = req.body;

        console.log('📝 Signup request:', { email, displayName, role });

        const validRoles = ['user', 'patient', 'doctor', 'anonymous'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Normalize role: 'patient' -> 'patient', anything else defaults to 'user'
        const normalizedRole = role || 'user';

        user = new User({
            email,
            password,
            displayName,
            role: normalizedRole
        });
        await user.save();

        console.log('✅ User created:', { id: user._id, email: user.email, role: user.role });

        // Create doctor profile if role is doctor
        if (normalizedRole === 'doctor') {
            const profile = new DoctorProfile({
                userId: user._id,
                fullName: displayName,
                specialization: specialization || 'General Mental Health',
                licenseId: licenseId || `LIC-${Date.now()}`,
                experienceYears: 0,
                bio: 'Awaiting professional bio update...',
                isVerified: false
            });
            await profile.save();
            console.log('✅ Doctor profile created');
        }

        const token = generateToken(user);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Signup error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Login attempt:', { email });

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('✅ Login successful:', { id: user._id, role: user.role });

        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Google OAuth
router.post('/google', async (req, res) => {
    try {
        const { idToken, role } = req.body;

        console.log('🔐 Google auth attempt with role:', role);

        const validRoles = ['user', 'patient', 'doctor', 'anonymous'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        // Verify Firebase token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name, uid } = decodedToken;

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            const normalizedRole = role || 'user';
            user = new User({
                email,
                displayName: name,
                googleId: uid,
                role: normalizedRole
            });
            await user.save();

            console.log('✅ New Google user created:', { id: user._id, role: user.role });

            // Create doctor profile if needed
            if (normalizedRole === 'doctor') {
                const profile = new DoctorProfile({
                    userId: user._id,
                    fullName: name,
                    specialization: 'General Mental Health',
                    licenseId: `LIC-${Date.now()}`,
                    experienceYears: 0,
                    bio: 'Awaiting professional bio update...',
                    isVerified: false
                });
                await profile.save();
                console.log('✅ Doctor profile created for Google user');
            }
        } else {
            // Update existing user
            if (!user.googleId) {
                user.googleId = uid;
            }
            // Update role if provided and different
            if (role && user.role !== role) {
                console.log(`📝 Updating role from ${user.role} to ${role}`);
                user.role = role;

                // Create doctor profile if upgrading to doctor
                if (role === 'doctor') {
                    const existingProfile = await DoctorProfile.findOne({ userId: user._id });
                    if (!existingProfile) {
                        const profile = new DoctorProfile({
                            userId: user._id,
                            fullName: user.displayName,
                            specialization: 'General Mental Health',
                            licenseId: `LIC-${Date.now()}`,
                            experienceYears: 0,
                            bio: 'Awaiting professional bio update...',
                            isVerified: false
                        });
                        await profile.save();
                        console.log('✅ Doctor profile created');
                    }
                }
            }
            await user.save();
            console.log('✅ Existing Google user logged in:', { id: user._id, role: user.role });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Google auth error:', error);
        res.status(401).json({ message: 'Invalid Google token', error: error.message });
    }
});

module.exports = router;
