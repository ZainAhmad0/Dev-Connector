const express = require('express');
const Router = express.Router();
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/Users')
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth')

// @route             POST api/posts
// @description       create a post 
// @access            private

Router.post('/', [auth, [
    check('text', "Text is required").notEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() })
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        const post = await newPost.save();
        return res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route             GET api/posts
// @description       get all posts 
// @access            private

Router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route             GET api/posts/:id
// @description       get post by id 
// @access            private

Router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ "msg": "Post not found" });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ "msg": "Post not found" });
        }
        return res.status(500).send('Server Error');
    }
})

// @route             DELETE api/posts/:id
// @description       delete post by id 
// @access            private

Router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ "msg": "Post not found" });
        }
        // checking that the owner of the post is going to delete the post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ "msg": "User Not Authorized" });
        }
        await post.remove();
        res.json({ 'msg': 'Post Removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ "msg": "Post not found" });
        }
        return res.status(500).send('Server Error');
    }
})

// @route             PUT api/posts/like/:post_id
// @description       create a post 
// @access            private

Router.put('/like/:post_id', [auth], async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)
        // check if the post has already been liked or not
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ 'msg': "Post Already Liked" })
        }
        post.likes.unshift({ user: req.user.id })
        await post.save();
        return res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route             PUT api/posts/unlike/:post_id
// @description       create a post 
// @access            private

Router.put('/unlike/:post_id', [auth], async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)
        // check if the post has already been liked or not
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ 'msg': "Post Has not been liked" })
        }
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)
        await post.save();
        return res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route             POST api/posts/comments/:id
// @description       create a post 
// @access            private

Router.post('/comments/:id', [auth, [
    check('text', "Text is required").notEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() })
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }
        post.comments.unshift(newComment);
        await post.save();
        return res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});


// @route             DELETE api/posts/comments/:post_id/:comment_id
// @description       Delete a comment 
// @access            private

Router.delete('/comments/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)
        //pull out the comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        if (!comment) {
            return res.status(404).json({ "msg": 'Comment does not exists' });
        }
        // check the user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ "msg": 'User not authorized' });
        }
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
        post.comments.splice(removeIndex, 1)
        await post.save();
        return res.json(post.comments)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


module.exports = Router;