import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    lastlogin: {
        type: Date,
        default: Date.now
     },
     isverified: {
        type: Boolean,
        default: false
     },
     verificationToken: {
        type: String,
      },
}, {timestamps: true})

// Pre-save mongoose middleware that handles encrypting the user's password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // Encrypt password before saving to the database
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
})

// Method to compare the password entered  with the one in the database 
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Method to generate JWTtoken for user 
userSchema.methods.generateToken = async function () {
    return await jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

export const User = mongoose.model('User', userSchema);