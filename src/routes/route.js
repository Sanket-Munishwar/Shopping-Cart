const express = require('express');
const router = express.Router();
const { uploadfiles } = require('../middleWare/aws')
const { registerUser,login,getUser,updateUsers, } = require('../controllers/userController')
const { isAuthentication } = require('../middleWare/auth')
const {createProduct,getProducts,fetchProductsById,updateProducts,deleteProductById} = require('../controllers/productController')


// -----------User Routes ---------------//
router.post('/register',registerUser)
router.post("/login", login);
router.get('/user/:userId/profile', isAuthentication, getUser);
router.put('/user/:userId/profile', isAuthentication, updateUsers);


//======APIs for Product========
router.post("/products",  createProduct);
router.get("/products", getProducts);
router.get("/products/:productId", fetchProductsById);
router.put("/products/:productId", updateProducts);
router.delete("/products/:productId", deleteProductById);
module.exports = router