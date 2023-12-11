const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        const emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
      },
      message: 'Please provide a valid email address',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(password) {
        // Example: Minimum eight characters, at least one letter, one number and one special character
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
      },
      message: 'Password does not meet complexity requirements',
    },
  },
  income: {
    type: Number,
    default: 0,
  },
  validTime: {
    // Any tokens created before this time are considered invalid.
    type: String,
    required: true,
  },
  savings: {
    type: Number,
    default: 0,
  },
  budgetData: {
      type: Array,
      required: true,
      
    },
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new Error('Error hashing password'));
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual field to hide sensitive information
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema,'users');

module.exports = User;
