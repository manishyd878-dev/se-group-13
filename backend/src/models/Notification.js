import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    // Notifications can belong to a patient/hospital user, and/or a hospital record
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    tone: {
      type: String,
      enum: ['info', 'caution', 'success', 'danger'],
      default: 'info',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ hospital: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
