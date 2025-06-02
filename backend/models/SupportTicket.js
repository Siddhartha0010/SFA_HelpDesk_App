const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/
    },
    // CHANGED: Renamed 'phone' to 'employeeId' to match frontend
    employeeId: {
        type: String, // Keeping it as string as per HTML input type
        trim: true // It's optional in HTML, so no 'required: true' here
    },
    category: {
        type: String,
        required: true,
        enum: ['login', 'sync', 'order', 'route', 'rewards', 'other'] // IMPORTANT: Match values from contact.html dropdown
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: 'Open',
        enum: ['Open', 'In Progress', 'Resolved', 'Closed']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

module.exports = SupportTicket;