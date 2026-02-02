const mongoose = require('mongoose');

// Clinical Form Template Schema (forms doctors create for patients to fill)
const formFieldSchema = new mongoose.Schema({
    label: { type: String, required: true },
    type: { type: String, enum: ['text', 'textarea', 'select', 'checkbox', 'number', 'date'], default: 'text' },
    options: [String], // For select fields
    required: { type: Boolean, default: false }
}, { _id: false });

const clinicalFormTemplateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    fields: [formFieldSchema],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Slot Schema
const slotSchema = new mongoose.Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, default: 30 },
    status: {
        type: String,
        enum: ['available', 'booked', 'in-progress', 'completed', 'off'],
        default: 'available'
    },
    sessionType: {
        type: String,
        enum: ['Video', 'Voice', 'Chat'],
        default: 'Video'
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lockExpires: { type: Date },
    // Clinical form data filled by patient
    clinicalFormData: {
        formId: mongoose.Schema.Types.ObjectId,
        title: String,
        responses: mongoose.Schema.Types.Mixed,
        filledAt: Date
    }
});

// Daily Schedule Schema
const dailyScheduleSchema = new mongoose.Schema({
    date: { type: String, required: true },
    slots: [slotSchema]
});

// Main Doctor Profile Schema
const doctorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    fullName: { type: String, required: true },
    specialization: { type: String, required: true },
    licenseId: { type: String, required: true },
    experienceYears: { type: Number, default: 0 },
    education: { type: String, default: 'Medical Degree' },
    bio: { type: String, default: '' },
    profileImage: { type: String, default: '' },

    // Schedule
    dailySchedules: [dailyScheduleSchema],

    // Clinical Forms (templates created by doctor)
    clinicalForms: [clinicalFormTemplateSchema],

    // Active form ID that patients must fill before booking
    activeFormId: { type: mongoose.Schema.Types.ObjectId },

    // Stats
    stats: {
        amountEarned: { type: Number, default: 0 },
        meetingsTaken: { type: Number, default: 0 },
        hoursCommitted: { type: Number, default: 0 },
        avgRating: { type: Number, default: 5.0 }
    },

    // Reviews
    reviews: [{
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        patientName: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
    }],

    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
doctorProfileSchema.pre('save', async function () {
    this.updatedAt = new Date();
});

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
