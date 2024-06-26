// Imports
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

// Spotify image schema
const spotifyImageSchema = new Schema({
    url: {
      type: String,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
});

// Favorites schema
const favoriteSchema = Schema({
    artist: {
        type: String,
        required: true,
      },
      artistId: {
        type: String,
        required: true
      },
      album: {
        type: String, 
        required: true
      },
      albumId: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
      },
      albumImages: {
        type: [spotifyImageSchema],
      },
      reviewId: {
        type: Schema.Types.ObjectId,
      }
});

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
        minLength: [8, 'Password must be at least 8 characters.'],
        maxLength: [64, 'Password must not be more than 64 characters.'],
        validate: {
            validator: function(v) {
                const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
                return regex.test(v);
            },
            message: `Password must contain at least one number, one uppercase letter, one lowercase letter, and one symbol.`
        }
    },
    favorites: {
        type: [favoriteSchema]
    },
    followers: {
        type: [Schema.Types.ObjectId],
    },
    following: {
        type: [Schema.Types.ObjectId],
    },
    reviewStats: {
        lifetime: {
            type: Number,
            default: 0,
        },
        byYear: {
            type: Map,
            of: Number,
            default: new Map()
        }
    }
}, 
{ 
    timestamps: true, 
});

// Handle confirm password field
userSchema.virtual('confirmPassword')
    .get(() => this._confirmPassword)
    .set(value => this._confirmPassword = value);

// Validate confirmPassword field
userSchema.pre('validate', function(next) {
    if (this.isNew) {
        if (this.password !== this.confirmPassword) {
            this.invalidate('confirmPassword', 'Passwords must match.')
        }
    }
    next();
});

// Hash password
userSchema.pre('save', async function save(next) {
    if (this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(this.password, salt);
            this.password = hash;
            return next();
        } catch (error) {
            return next(error)
        }
    } else {
        next();
    }
});

// Generate user model
const User = mongoose.model('User', userSchema);

// Exports
module.exports = { 
    User
};