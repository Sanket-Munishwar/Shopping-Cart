const userModel = require('../Model/userModel')
const {validateName, validateEmail, validateMobileNo, validatePassword, validatePlace, validatePincode } = require('../validations/validations')
const { uploadfiles } = require('../middleWare/aws')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
// const validator =require("validator");




const registerUser = async function (req, res) {
    try {
      let body = req.body;
      const file = req.files
      let { fname, lname, email, phone, password , address} = body;

        // console.log(body.address.billing)
        // return res.send({data:"hello"})
  
      if (Object.keys(body).length == 0) {
          return res.status(400).send({ status: false, message: "Request body can't be empty." });
      }
  
        //====validations for First name====
        if (fname && typeof fname != "string") {
            return res.status(400).send({ status: false, message: "First name must be in string" });
        }
        if (!fname ) {
            return res.status(400).send({ status: false, message: "First name is required." });
        }
        if (!validateName(fname)) {
            return res.status(400).send({ status: false, message: "Enter a valid First name" });
        }
  
        //====validations for last name====
        if (lname && typeof lname != "string") {
            return res.status(400).send({ status: false, message: "Last name must be in string" });
        }
        if (!lname ) {
            return res.status(400).send({ status: false, message: "Last name is required." });
        }
        if (!validateName(lname)) {
            return res.status(400).send({ status: false, message: "Enter a valid Last name." });
        }
  
        //====validations for Email====
        if (email && typeof email != "string") {
            return res.status(400).send({ status: false, message: "Email must be in String." });
        }
        if (!email ) {
            return res.status(400).send({ status: false, message: "Email is required." });
        }
        if (!validateEmail(email)) {
            return res.status(400).send({ status: false, message: "Enter a valid Email." });
        }
        const existEmail = await userModel.findOne({ email: email });
        if (existEmail) {
            return res.status(400).send({ status: false, message: "This Email is already in use, try with another one." });
        }
  
        //====validations for Phone====
        if (phone && typeof phone != "string") {
            return res.status(400).send({ status: false, message: "phone number must be in String." });
        }
        if (!phone ) {
            return res.status(400).send({ status: false, message: "phone number is required." });
        }
        if (!validateMobileNo(phone)) {
            return res.status(400).send({ status: false, message: "Enter a valid indian phone Number." });
        }
        const existphone = await userModel.findOne({ phone: phone });
        if (existphone) {
            return res.status(400).send({ status: false, message: "This phone is already in use, try with another one." });
        }
  
        //====validations for password====
        if (password && typeof password != "string") {
            return res.status(400).send({ status: false, message: "Password must be in string" });
        }
        if (!password ) {
            return res.status(400).send({ status: false, message: "password is required." });
        }
        if (!validatePassword(password)) {
            return res.status(400).send({ status: false, message: "Password Must be 8-15 length,consist of mixed character and special character" });
        }
  
        let hashing = bcrypt.hashSync(password, 10);
        req.body.password = hashing;
  
        // ====validations for address====
        // if (!address) {
        //     return res.status(400).send({ status: false, message: "Address is required." });
        // }
  
        address = JSON.parse(body.address);
        if (address && typeof address != "object") {
            return res.status(400).send({ status: false, message: "Address must be in Object Form." });
        }
        let { shipping, billing } = address;
        //====validations for shipping address====
        if (shipping && typeof shipping != "object") {
            return res.status(400).send({ status: false, message: "Shipping Address must be in Object Form." });
        }
        if (!shipping) {
            return res.status(400).send({ status: false, message: "Shipping Adderss is required." });
        }
        if (shipping.street && typeof shipping.street != "string") {
            return res.status(400).send({ status: false, message: "shipping Street must be in string" });
        }
        if (!shipping.street ) {
            return res.status(400).send({ status: false, message: "shipping Street is required." });
        }
        if (shipping.city && typeof shipping.city != "string") {
            return res.status(400).send({ status: false, message: "shipping City must be in string" });
        }
        if (!shipping.city ) {
            return res.status(400).send({ status: false, message: "shipping City is required." });
        }
        if (!validatePlace(shipping.city)) {
            return res.status(400).send({ status: false, message: "shipping City is invalid, number is not allowed." });
        }
        
        if (!shipping.pincode ) {
            return res.status(400).send({ status: false, message: "shipping Pincode is required." });
        }
        if (!validatePincode(shipping.pincode)) {
            return res.status(400).send({ status: false, message: "shipping pincode is invalid, it contains only 6 digits." });
        }
  
        //====validations for Billing address====
        if (billing && typeof billing != "object") {
            return res.status(400).send({ status: false, message: "Billing Address must be in Object Form." });
        }
        if (!billing) {
            return res.status(400).send({ status: false, message: "Billing Adderss is required." });
        }
        if (billing.street && typeof billing.street != "string") {
            return res.status(400).send({ status: false, message: "Billing Street must be in string" });
        }
        if (!billing.street ) {
            return res.status(400).send({ status: false, message: "Billing Street is required." });
        }
        if (billing.city && typeof billing.city != "string") {
            return res.status(400).send({ status: false, message: "Billing City must be in string" });
        }
        if (!billing.city ) {
            return res.status(400).send({ status: false, message: "Billing City is required." });
        }
        if (!validatePlace(billing.city)) {
            return res.status(400).send({ status: false, message: "Billing City is invalid, number is not allowed." });
        }
        
        if (!billing.pincode ) {
            return res.status(400).send({ status: false, message: "Billing Pincode is required." });
        }
        if (!validatePincode(billing.pincode)) {
            return res.status(400).send({ status: false, message: "Billing pincode is invalid, it contains only 6 digits." });
        }

        const url = await uploadfiles(file[0])
        console.log(url)
        req.body.profileImage = url
      
      const registerUser = await userModel.create(body);
      let{ __v, ...otherData} = registerUser._doc
       
      res.status(201).send({ status: true, message: "User created successfully", data: otherData });
    } catch (err) {
     
      // if(err.message.includes("JSON")) { 
      //   return res.status(400).send({ status: false, message: "please enter valid address object..." }); 
      // }
      return res.status(500).send({ status: false, message: err.message });
  
    }
}




//============Router handler for Login User===============
const login = async function (req, res) {
  try {
      const body = req.body;
      let { email, password } = body;

      if (email && typeof email != "string") {
          return res.status(400).send({ status: false, message: "email must be in string" });
      }
      if (!email || !email.trim()) {
          return res.status(400).send({ status: false, message: "Email is mandatory and can not be empty." });
      }
      email = email.toLowerCase().trim();
      if (!validateEmail(email)) {
          return res.status(400).send({ status: false, message: "Please enter a valid Email." });
      }

      if (password && typeof password != "string") {
          return res.status(400).send({ status: false, message: "password must be in string" });
      }
      if (!password || !password.trim()) {
          return res.status(400).send({ status: false, message: "Password is mandatory and can not be empty." });
      }

      const check = await userModel.findOne({ email: email });
      if (!check) {
          return res.status(404).send({ status: false, message: "No such user exist. Please Enter a valid Email and Passowrd." })//status code
      }
      const passwordCompare = await bcrypt.compare(password, check.password)

      if (!passwordCompare) {
          return res.status(400).send({ status: false, message: "please provide correct credentials , Password is incorrect." });
      }

      const token = jwt.sign(
          { userId: check._id.toString() }, "Shopping-Cart", { expiresIn: "10h" }
      );
      return res.status(200).send({ status: true, message: "User Login Successfull", data: { userId: check._id, token: token } });
  }
  catch (err) {
      res.status(500).send({ status: false, message: err.message })
  }
}


//===========Router handler for get user============
const getUser = async (req, res) => {
  try {
      const userId = req.params.userId;
      if (!userId) {
          res.status(400).json({ status: false, message: 'Please enter user id' });
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          res.status(400).json({ status: false, message: 'Please enter valid user id' });
      }
      if (userId.toString() !== String(req.userId)) {
          res.status(403).json({ status: false, message: 'You are Not authenticate' });
      }
      const user = await userModel.findById(userId);
      if (!user) {
          res.status(404).json({ status: false, message: 'User not found' });
      }
      res.status(200).json({ status: true, message: 'User Profile Details', data: user });
  } catch (error) {
      if (error.message.includes('duplicate')) {
          res.status(400).json({ status: false, message: error.message });
      }
      else if (error.message.includes('validation')) {
          res.status(400).json({ status: false, message: error.message });
      }
      else {
          res.status(500).json({ status: false, message: error.message });
      }
  }
}



//===========router handler for Update user================
const updateUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    let data = req.body;
    if (!data) {
        return res.status(400).json({ status: false, message: 'Please enter data' });
    }
    if (!userId) {
        res.status(400).json({ status: false, message: 'Please enter user id' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ status: false, message: 'Please enter valid user id' });
    }
    if (userId.toString() !== String(req.userId)) {
        res.status(403).json({ status: false, message: 'You are Not authenticate' });
    }
    const user = await userModel.findById(userId);
    if (!user) {
        res.status(404).json({ status: false, message: 'User not found' });
    }
    if (data.email) {
        const emailCheck = await userModel.findOne({ email: data.email });
        if (emailCheck) {
            res.status(400).json({ status: false, message: 'Email already exists' });
        }
        if(!validator.isEmail(data.email)){
            return res.status(400).json({status:false, message: 'Please enter valid email'})
        }
    }
    if (data.phone) {
        const phoneCheck = await userModel.findOne({ phone: data.phone });
        if (phoneCheck) {
            res.status(400).json({ status: false, message: 'Phone number already exists' });
        }
        if((data.phone).length!=10){
            return res.status(400).json({status:false, message: 'Please enter valid phone number'})
        }
    }
    if (data.password) {
        if (data.password.length < 8 || data.password.length > 15) {
            res.status(400).json({ status: false, message: 'Please enter valid password' });
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword
    }
    let updateUser2 = await userModel.findByIdAndUpdate(userId, {$set : req.body}, { new: true });
    res.status(200).json({ status: true, message: 'User updated successfully', data: updateUser2 });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}














module.exports = {registerUser,login, updateUsers, getUser } 