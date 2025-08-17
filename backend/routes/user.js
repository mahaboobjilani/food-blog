const express = require("express");
const{userSignup,userLogin,getUser}=require("../controller/user.js")
const router=express.Router();

router.post("/signup",userSignup)
router.post("/login",userLogin)
router.get("/user/:id",getUser)


module.exports = router;