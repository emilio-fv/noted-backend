// Imports
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

// User schema
const userSchema = Schema({
    firstName: {
        type: String,
        required: [true, 'First name required.'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name required.'],
    },
    username: {
        type: String,
        required: [true, 'Username required.'],
        // unique: [true, 'Username already registered'],
    },
    email: {
        type: String,
        required: [true, 'Email required.'],
        validate: {
            validator: function(val) {
                return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(val)
            },
            message: 'Invalid email.'
        }
    },
    password: {
        type: String,
        required: [true, 'Password required.'],
        minLength: [8, 'Password must be at least 8 characters.']
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, 
{ 
    timestamps: true, 
    collection: 'users',
});

// Handle confirm password field
userSchema.virtual('confirmPassword')
    .get(() => this._confirmPassword)
    .set(value => this._confirmPassword = value);

// Validate confirm password field
userSchema.pre('validate', function(next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Passwords must match.')
    }
    next();
});

// Hash password
userSchema.pre('save', async function save(next) {
    // if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        return next();
    } catch (error) {
        return next(error)
    }
});

// Generate user model
const User = mongoose.model('User', userSchema);

// Exports
module.exports = { 
    User
};