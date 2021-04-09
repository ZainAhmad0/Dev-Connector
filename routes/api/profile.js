const express = require('express');
const Router = express.Router();

// @route             GET api/profile
// @description       Test Route
// @access            Public

Router.get('/',(req,res)=>res.send("profile Route"));

module.exports=Router;