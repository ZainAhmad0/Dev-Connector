const express = require('express');
const Router = express.Router();

// @route             GET api/posts
// @description       Test Route
// @access            Public

Router.get('/',(req,res)=>res.send("Posts Route"));

module.exports=Router;