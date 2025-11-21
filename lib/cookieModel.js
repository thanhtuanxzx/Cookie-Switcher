import mongoose from 'mongoose';

const SharedCookieSchema = new mongoose.Schema({
  groupId: { 
    type: String, 
    required: true,
    index: true,
    unique: true
  },
  profiles: [
    {
      profileName: {
        type: String,
        required: true
      },
      cookies: {
        type: Array,
        default: []
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index để tìm kiếm nhanh
SharedCookieSchema.index({ groupId: 1 });

const SharedCookie = mongoose.models.SharedCookie || mongoose.model('SharedCookie', SharedCookieSchema);

export default SharedCookie;

