import mongoose from 'mongoose';

const { Schema } = mongoose;

const bloodRequestSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
    },
    units: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    urgency: {
      type: String,
      enum: ['normal', 'urgent', 'emergency'],
      default: 'normal',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

bloodRequestSchema.index({ patient: 1, createdAt: -1 });
bloodRequestSchema.index({ hospital: 1, createdAt: -1 });

export default mongoose.model('BloodRequest', bloodRequestSchema);
