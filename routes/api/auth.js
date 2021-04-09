const express = require('express');
const Router = express.Router();

// @route             GET api/auth
// @description       Test Route
// @access            Public

Router.get('/',(req,res)=>res.send("Auth Route"));

module.exports=Router;