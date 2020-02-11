const express = require('express');

const router = express.Router();

const auth = require('../../middleWare/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/Users');

const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route GET api/profile/me
// get current user's profile
// private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res
                .status(400)
                .json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
});

router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status is required')
                .not()
                .isEmpty(),
            check('skills', 'Skills is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
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
            linkedin,
            instagram
        } = req.body;

        const profileField = {};
        profileField.user = req.user.id;
        if (company) {
            profileField.company = company;
        }
        if (website) {
            profileField.website = website;
        }
        if (location) {
            profileField.location = location;
        }
        if (bio) {
            profileField.bio = bio;
        }
        if (status) {
            profileField.status = status;
        }
        if (githubusername) {
            profileField.githubusername = githubusername;
        }
        if (skills) {
            profileField.skills = skills.split(',').map(skill => skill.trim());
        }

        profileField.social = {};
        if (youtube) profileField.social.youtube = youtube;
        if (facebook) profileField.social.facebook = facebook;
        if (twitter) profileField.social.twitter = twitter;
        if (linkedin) profileField.social.linkedin = linkedin;
        if (instagram) profileField.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileField },
                    { new: true }
                );
                return res.json(profile);
            }

            profile = new Profile(profileField);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status.send('server error');
        }

        res.send('Hello');
    }
);

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', [
            'name',
            'avatar'
        ]);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                msg: 'Profile not founds'
            });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                msg: 'Profile not found'
            });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;