const express = require('express');
const Router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const axios = require('axios');
const config = require('config');
const { check, validationResult } = require('express-validator');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
Router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user');

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
Router.post('/', [auth,
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // build profle object
    const profileFields = {};
    profileFields.social = {};
    const socials = {
        'youtube': youtube,
        'facebook': facebook,
        'twitter': twitter,
        'instagram': instagram,
        'linkedin': linkedin
    }
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills && !Array.isArray(skills)) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }else{
        profileFields.skills = skills;
    }
    if (youtube) socials.youtube = youtube;
    if (facebook) socials.facebook = facebook;
    if (twitter) socials.twitter = twitter;
    if (instagram) socials.instagram = instagram;
    if (linkedin) socials.linkedin = linkedin;
    profileFields.social = socials;
    try {
        let profile = await Profile.findOne({ user: req.user.id })
        if (profile) {
            // update 
            await Profile.findOneAndUpdate({ user: req.user.id }, profileFields)
            profile = await Profile.findOne({ user: req.user.id })
            return res.send(profile);
        }
        //create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    Get api/profile
// @desc     Get all profiles
// @access   Public

Router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        return res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route    Get api/profile/user/:user_id
// @desc     Get profile By User Id
// @access   Public

Router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user');
        if (!profile) {
            res.status(400).json({ msg: "Profile not found" });
        }
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId')
            res.status(400).json({ msg: "Profile not found" });
        res.status(500).send('Server Error');
    }
})

// @route    DELETE api/profilee
// @desc     DELETE user & profile
// @access   private

Router.delete('/', auth, async (req, res) => {
    try {
        // remove user posts
        await Post.deleteMany({user: req.user.id})
        await Profile.findOneAndRemove({ user: req.user.id });
        // deleting user
        await User.findOneAndRemove({ _id: req.user.id });
        res.send("User Deleted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route    PATCH api/profilee/experiance
// @desc     update profile experiance
// @access   private

Router.put('/experiance', [auth, [
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'from date is required').notEmpty()
]]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ errors: errors.array() })
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExperiance = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id })
            profile.experience.unshift(newExperiance);
            profile.save();
            return res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    })

// @route    DELETE api/profilee/experiance/:exp_id
// @desc     Delete Experiance on the basis of id
// @access   private

Router.delete('/experiance/:exp_id', auth, async (req, res) => {

    try {

        const profile = await Profile.findOne({ user: req.user.id })
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
})

// @route    PATCH api/profilee/education
// @desc     update profile education
// @access   private

Router.put('/education', [auth, [
    check('school', 'School is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Field of study is required').notEmpty(),
    check('from', 'from date is required').notEmpty()
]]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ errors: errors.array() })
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEducation = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id })
            profile.education.unshift(newEducation);
            profile.save();
            return res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    })

// @route    DELETE api/profilee/education/:edu_id
// @desc     Delete Education on the basis of id
// @access   private

Router.delete('/education/:edu_id', auth, async (req, res) => {

    try {

        const profile = await Profile.findOne({ user: req.user.id })
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
/*
router.get('/github/:username', async (req, res) => {
    try {
      const uri = encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      );
      const headers = {
        'user-agent': 'node.js',
        Authorization: `token ${config.get('githubToken')}`
      };
  
      const gitHubResponse = await axios.get(uri, { headers });
      return res.json(gitHubResponse.data);
    } catch (err) {
      console.error(err.message);
      return res.status(404).json({ msg: 'No Github profile found' });
    }
  });
  */



module.exports = Router;