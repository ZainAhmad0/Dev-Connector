const express = require('express');
const User = require('../../models/User')
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const { check, validationResult } = require('express-validator');
const c = require('config');

const Router = express.Router();

// @route             POST api/users
// @description       Test Route
// @access            Public

Router.post('/', [

    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', "Please include a valid Email").isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
        min: 6
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })


    const { email, name, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'User already exists' }] });
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        user = new User({
            name,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
        return res.send("User Registered")

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Server Error")
    }


});

module.exports = Router;