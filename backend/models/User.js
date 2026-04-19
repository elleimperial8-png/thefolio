const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    },

    // ✅ Admin approval system (FIXED CORE LOGIC)
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },

    bio: {
      type: String,
      default: ''
    },

    profilePic: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// ── Hash password before saving ─────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// ── Compare password ────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);