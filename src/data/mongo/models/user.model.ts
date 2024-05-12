import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, 'Name is required' ]
    },
    email: {
        type: String,
        required: [ true, 'Email is required' ],
        unique: true,
    },
    emailValidated: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [ true, 'Password is required' ]
    },
    userName: {
        type: String,
        required: [ true, 'Username is required' ]
    },
    role: {
        type: [String],
        default: ['USER'],
        enum: ['ADMIN','USER']
    },
    foto: {
        type: String
    }
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret, options) {
        delete ret._id;
        delete ret.password;
    }
})

export const UserModel = mongoose.model('User', userSchema);