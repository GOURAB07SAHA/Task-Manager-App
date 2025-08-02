const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profile: {
    avatar: {
      url: {
        type: String,
        default: ''
      },
      publicId: {
        type: String,
        default: ''
      }
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [30, 'First name cannot be more than 30 characters']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [30, 'Last name cannot be more than 30 characters']
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: [100, 'Job title cannot be more than 100 characters']
    },
    department: {
      type: String,
      trim: true,
      maxlength: [50, 'Department cannot be more than 50 characters']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[1-9]?[0-9]{7,15}$/, 'Please provide a valid phone number']
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot be more than 100 characters']
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    dateOfBirth: {
      type: Date
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      github: String,
      website: String
    }
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      taskReminders: {
        type: Boolean,
        default: true
      },
      weeklyDigest: {
        type: Boolean,
        default: false
      }
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user'
  },
  permissions: [{
    type: String,
    enum: ['create_tasks', 'edit_tasks', 'delete_tasks', 'assign_tasks', 'manage_team', 'view_reports']
  }],
  teamMemberships: [{
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    role: {
      type: String,
      enum: ['member', 'lead', 'admin'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    }
  }],
  workHistory: [{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    description: String,
    isCurrent: {
      type: Boolean,
      default: false
    }
  }],
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
