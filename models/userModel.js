const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userIdGen = require('../middleware/userIdGen');

const userSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    role: {type: String, enum: ['admin', 'superAdmin'], default: 'admin'},
    
    password: {type: String, required: true},

    profilePhoto: {type: String, default: ""},

    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    createdAt: {type: Date, default: Date.now}
}, {timestamps: true}   
);

userSchema.pre("save", async function () {
    try {
        if (!this.isModified("password")) return;

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;