import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    // Which listing was booked
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: false,       // allow bookings for Tapline/external listings too
    },

    // For Tapline listings that don't exist in our DB we store the raw id
    externalListingId: { type: String },
    listingTitle:      { type: String, required: true },
    listingLocation:   { type: String },
    listingImage:      { type: String },

    // Guest details
    guestName:  { type: String, required: true },
    guestEmail: { type: String, required: true },
    guests:     { type: Number, required: true, min: 1 },

    // Dates
    checkin:  { type: String, required: true },   // stored as YYYY-MM-DD string
    checkout: { type: String, required: true },
    nights:   { type: Number, required: true, min: 1 },

    // Pricing (all ZAR)
    nightlyRate:  { type: Number, required: true },
    subtotal:     { type: Number, required: true },
    cleaningFee:  { type: Number, default: 0 },
    serviceFee:   { type: Number, default: 0 },
    totalAmount:  { type: Number, required: true },
    currency:     { type: String, default: 'ZAR' },

    // Status lifecycle
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },

    // Optional: link to registered user
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Confirmation reference number
    confirmationRef: { type: String, unique: true },
  },
  { timestamps: true }
)

// Auto-generate a short confirmation reference before saving
bookingSchema.pre('save', function (next) {
  if (!this.confirmationRef) {
    this.confirmationRef = 'GH-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  }
  next()
})

export default mongoose.model('Booking', bookingSchema)
