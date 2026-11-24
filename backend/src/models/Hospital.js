import mongoose from 'mongoose';

const { Schema } = mongoose;

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const stockSchema = new Schema(
  {
    'A+': { type: Number, default: 0, min: 0 },
    'A-': { type: Number, default: 0, min: 0 },
    'B+': { type: Number, default: 0, min: 0 },
    'B-': { type: Number, default: 0, min: 0 },
    'AB+': { type: Number, default: 0, min: 0 },
    'AB-': { type: Number, default: 0, min: 0 },
    'O+': { type: Number, default: 0, min: 0 },
    'O-': { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const hospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      maxlength: 160,
    },
    owner: {
      // The User (role: 'hospital') account that manages this hospital's dashboard
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    location: {
      // GeoJSON Point for distance queries: coordinates = [longitude, latitude]
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    stock: {
      type: stockSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ name: 'text', address: 'text', city: 'text' });

hospitalSchema.virtual('totalUnits').get(function totalUnits() {
  if (!this.stock) return 0;
  return BLOOD_GROUPS.reduce((sum, g) => sum + (this.stock[g] || 0), 0);
});

hospitalSchema.set('toJSON', { virtuals: true });
hospitalSchema.set('toObject', { virtuals: true });

export default mongoose.model('Hospital', hospitalSchema);
