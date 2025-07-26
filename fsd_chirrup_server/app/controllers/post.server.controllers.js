const posts = require("../models/post.server.models");
const users = require("../models/user.server.models");
const Joi = require('joi');

// ext 1
const Filter = require('bad-words');
const filter = new Filter();

const add_post = (req, res) => {
    // Validate incoming data
    const schema = Joi.object({
        text: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.sendStatus(400);

    let post = Object.assign({}, req.body); // converting req body to an object

    // ext 1 - check for profanity
    const { text } = req.body;
    if (filter.isProfane(text)) {
        return res.status(400).send('Text contains offensive language');
    }

    // author_id is passed to addNewPost model
    let token = req.get('X-Authorization');
    users.getIdFromToken(token, (err, author_id) => {

        if (err || author_id === null) {
            return done.sendStatus(401); // author not found
        }

        // calls model, adds post to database and returns post id
        posts.addNewPost(post, author_id, (err, id) => {
            if (err) {
                return res.sendStatus(500);
            }
            else {
                return res.status(201).send({ post_id: id });
            }
        })
    });
};

const get_post = (req, res) => {
    let post_id = parseInt(req.params.post_id);

    posts.getSinglePost(post_id, (err, result) => {
        if (err === 404) return res.sendStatus(404)
        if (err) return res.sendStatus(500)

        return res.status(200).send(result)
    })
};

const update_post = (req, res) => {
    let post_id = parseInt(req.params.post_id);

    posts.getSinglePost(post_id, (err, post) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);

        // Validate patched text
        const schema = Joi.object({
            "text": Joi.string().required()
        })

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Check if text sent is same as stored
        if (post.text === req.body.text) {
            return res.sendStatus(200);
        }

        // get the author of post
        let author_id = post.author.user_id;
        // get the user_id - aka the person that's patching the post
        let token = req.get('X-Authorization');
        users.getIdFromToken(token, (err, user_patching_id) => {
            if (err || user_patching_id === null) {
                return res.sendStatus(401); // user not found
            }
            else if (user_patching_id !== author_id) {
                return res.status(403).send({ "error_message": "You are not the author of this post" });
            } // end of code for checking if user_id === author_id
            else {
                // Call model function and send new text
                posts.updatePost(post_id, req.body.text, (err) => {
                    // error
                    if (err) {
                        return res.sendStatus(500);
                    }
                    // worked
                    else {
                        return res.sendStatus(200);
                    }
                })
            }
        })
    })
};

const delete_post = (req, res) => {
    let post_id = parseInt(req.params.post_id);

    posts.getSinglePost(post_id, (err, post) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);

        // get the author of post
        let author_id = post.author.user_id;
        // get the user_id - aka the person that's deleting the post
        let token = req.get('X-Authorization');
        users.getIdFromToken(token, (err, user_deleting_id) => {
            if (err || user_deleting_id === null) {
                return done.sendStatus(401); // user not found
            }
            if (user_deleting_id !== author_id) {
                return res.status(403).send('You can only delete your own posts');
            } // end of code for checking if user_id === author_id

            // Call the model function
            posts.deletePost(post_id, (err) => {
                // error
                if (err) return res.sendStatus(500);
                // worked
                return res.sendStatus(200);

            })
        })
    })
};

const add_like = (req, res) => {
    // get the post_id
    let post_id = parseInt(req.params.post_id);

    posts.getSinglePost(post_id, (err, post) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);

        // get the user_id
        let token = req.get('X-Authorization');
        users.getIdFromToken(token, (err, user_id) => {
            if (err || user_id === null) {
                return done.sendStatus(401); // user not found
            }

            posts.likePost(post_id, user_id, (err) => {
                // error
                if (err) {
                    if (err === 403) {
                        return res.status(403).send("You have already liked this post")
                    }

                    return res.sendStatus(500);
                }
                // worked
                return res.sendStatus(200);
            })
        })
    })
};

const remove_like = (req, res) => {
    // get the post_id
    let post_id = parseInt(req.params.post_id);

    posts.getSinglePost(post_id, (err, post) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);

        // get the user_id
        let token = req.get('X-Authorization');
        users.getIdFromToken(token, (err, user_id) => {
            if (err || user_id === null) {
                return done.sendStatus(401); // user not found
            }

            posts.unlikePost(post_id, user_id, (err) => {
                // error
                if (err) {
                    if (err === 403) {
                        return res.status(403).send("You can not unfollow a user that you are not following")
                    }

                    return res.sendStatus(500);
                }
                // worked
                return res.sendStatus(200);
            })
        })
    })
};

module.exports = {
    add_post: add_post,
    get_post: get_post,
    update_post: update_post,
    delete_post: delete_post,
    add_like: add_like,
    remove_like: remove_like,
};