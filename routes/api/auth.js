const express = require('express');
const Router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/Users')
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// @route             GET api/auth
// @description       Test Route
// @access            Public

Router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        return res.json(user)
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error");
    }

});

// @route             POST api/auth
// @description       authenticate user
// @access            Public

Router.post('/', [
    check('email', "Please include a valid Email").isEmail(),
    check('password', 'Please enter a password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })


    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload
            , config.get('jwtSecret')
            , { expiresIn: 36000 },
            (err, token) => {
                if (err) throw err
                return res.json({ token });
            }
        )
        console.log(req);
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Server Error")
    }
});

module.exports = Router;