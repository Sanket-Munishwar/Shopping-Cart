const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fname: {
        type:String, required:true
    },
    lname: {
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    profileImage: {
        type: String,
        required: true
  
    }, // s3 link
    phone: {
        type: String,
        required: true,
        unique: true,
        
    }, 
    password: {
        type: String,
        required: true,
        // maxLength:15,
        minLength:8,
        
    }, // encrypted password
    address: {
        shipping: {
        street: {type:String, required:true,trim:true},
        city: {type:String, required:true,trim:true},
        pincode: {type:Number, required:true,trim:true}
            },
        billing: {
            street: {type:String, required:true,trim:true},
            city: {type:String, required:true,trim:true},
            pincode: {type:Number, required:true,trim:true}
        }
    },
}, { timestamps:true})

module.exports = mongoose.model('User', userSchema)