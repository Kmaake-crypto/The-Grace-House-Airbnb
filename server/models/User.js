import mongoose from 'mongoose'
import crypto from 'crypto'

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:    { type: String },

    // Simple hashed password (use bcrypt in production — left simple here)
    passwordHash: { type: String, select: false },

    role:   { type: String, enum: ['guest', 'host', 'admin'], default: 'guest' },
    avatar: { type: String },

    // Host-specific
    isSuperhost: { type: Boolean, default: false },
    hostSince:   { type: Date },

    // Saved / favourited listings
    savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Simple SHA-256 hash helper — replace with bcrypt for production
userSchema.methods.setPassword = function (plain) {
  this.passwordHash = crypto.createHash('sha256').update(plain).digest('hex')
}

userSchema.methods.checkPassword = function (plain) {
  return this.passwordHash === crypto.createHash('sha256').update(plain).digest('hex')
}

// Never return passwordHash in JSON responses
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash
    return ret
  },
})

export default mongoose.model('User', userSchema)
