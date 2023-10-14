

import mongoose from "mongoose";
import crypto from 'crypto'

const userSchema = mongoose.Schema({


    fullname: {
        type: String
    },
    mobileno: {
        type: Number
    },
    gender: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
  
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date

},
    {
        timestamps: true
    }
)


// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         return next()
//     }
//     this.password = await bcrypt.hash(this.password, 10);
// })


userSchema.methods = {


    generatePasswordResetToken: async function () {
        const resetToken = crypto.randomBytes(20).toString('hex')

        // this.forgotPasswordToken= crypto
        // .createHash('varad')
        // .update(resetToken)

        this.forgotPasswordToken = resetToken;


        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;

        return resetToken;

    }
}
const user = mongoose.model('user', userSchema)
export default user;