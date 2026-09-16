import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refreshToken: { type: String, required: true },
    userAgent: { type: String },
    ip: { type: String },
    isValid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Session = mongoose.model('Session', sessionSchema);
