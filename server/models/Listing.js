import mongoose from 'mongoose'

const listingSchema = new mongoose.Schema(
  {
    title:          { type: String, required: true, trim: true },
    location:       { type: String, required: true, trim: true },
    description:    { type: String, default: '' },
    type:           { type: String, default: 'Entire home' },
    guests:         { type: Number, default: 2, min: 1 },
    beds:           { type: Number, default: 1, min: 1 },
    baths:          { type: Number, default: 1, min: 1 },
    price:          { type: Number, required: true, min: 0 },
    weeklyDiscount: { type: Number, default: 0, min: 0, max: 100 },
    cleaningFee:    { type: Number, default: 0, min: 0 },
    serviceFee:     { type: Number, default: 0, min: 0 },
    occupancyTax:   { type: Number, default: 0, min: 0 },
    priceFormatted: { type: String },                        // e.g. "R 2,500"
    currency:       { type: String, default: 'ZAR' },
    rating:         { type: Number, default: 0, min: 0, max: 5 },
    reviews:        { type: Number, default: 0 },
    host:           { type: String, default: 'Host' },
    hostSince:      { type: String },
    image:          { type: String, default: '' },
    gallery:        { type: [String], default: [] },
    amenities:      { type: [String], default: [] },
    isActive:       { type: Boolean, default: true },

    // Optional: link to the owner user account
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

// Auto-generate priceFormatted before saving
listingSchema.pre('save', function () {
  if (this.isModified('price') || !this.priceFormatted) {
    this.priceFormatted = `R ${Number(this.price).toLocaleString('en-ZA')}`
  }
})

// Text index for search
listingSchema.index({ title: 'text', location: 'text', description: 'text' })

export default mongoose.model('Listing', listingSchema)
