const express = require('express');
const Router = express.Router();

// @route             GET api/users
// @description       Test Route
// @access            Public

Router.get('/',(req,res)=>res.send("User Route"));

module.exports=Router;