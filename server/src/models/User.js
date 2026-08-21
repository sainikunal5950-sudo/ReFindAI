'use strict';

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

/**
 * User Schema
 *
 * Fields:
 *  - name        : full name of the user
 *  - email       : unique, lowercased email address
 *  - password    : bcrypt-hashed password (min 6 chars at validation layer)
 *  - role        : "user" (default) or "admin"
 *  - phone       : optional phone number
 *  - avatar      : optional image URL/path
 *  - address     : optional physical address / city
 *  - isVerified  : boolean, default false
 *  - isBlocked   : boolean, default false
 *  - createdAt   : auto-set by timestamps
 *  - updatedAt   : auto-set by timestamps
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },

    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false, // never return password in queries by default
    },

    role: {
      type:    String,
      enum:    { values: ['user', 'admin'], message: 'Role must be user or admin' },
      default: 'user',
    },

    phone: {
      type:    String,
      trim:    true,
      default: '',
    },

    avatar: {
      type:    String,
      default: '',
    },

    address: {
      type:    String,
      trim:    true,
      default: '',
    },

    isVerified: {
      type:    Boolean,
      default: false,
    },

    isBlocked: {
      type:    Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ─── Pre-save hook: hash password before persisting ────────────────────────────
UserSchema.pre('save', async function () {
  // Only hash when the password field is new or has been modified
  if (!this.isModified('password')) return;

  const SALT_ROUNDS = 12;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

// ─── Instance method: compare a plain password with the stored hash ─────────────
/**
 * @param {string} candidatePassword - Plain-text password from the login request
 * @returns {Promise<boolean>}        - true if passwords match
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Virtual: clean JSON output ────────────────────────────────────────────────
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    delete ret.password; // extra safety — should already be excluded via select:false
    return ret;
  },
});

module.exports = mongoose.model('User', UserSchema);
