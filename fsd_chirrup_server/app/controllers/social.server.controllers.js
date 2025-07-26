const social = require("../models/social.server.models");
const users = require("../models/user.server.models");

const get_user = (req, res) => {
    let user_id = parseInt(req.params.user_id);

    social.getUser(user_id, (err, result) => {
        if (err === 404) return res.sendStatus(404)
        if (err) return res.sendStatus(500)

        return res.status(200).send(result)
    })
};

const add_follow = (req, res) => {
    // person going to follow id
    let user_id = parseInt(req.params.user_id);

    // get the user_id
    let token = req.get('X-Authorization');

    users.getIdFromToken(token, (err, follower_id) => {
        if(err || follower_id === null) {
            return done.sendStatus(401); // user not found
        }

        social.followUser(follower_id, user_id, (err) => {
            // error
            if(err){
                if(err === 403){
                    return res.status(403).send("You are already following this user")
                }

                if(err === 404) {
                    return res.status(404).send("User doesn't exist")
                }

                return res.sendStatus(500);
            } 
            // worked
            return res.sendStatus(200);
        })
    })
};

const remove_follow = (req, res) => {
    // person going to unfollow id
    let user_id = parseInt(req.params.user_id);

    // get the user_id
    let token = req.get('X-Authorization');
    users.getIdFromToken(token, (err, follower_id) => {
        if(err || user_id === null) {
            return res.sendStatus(500); // user not found
        }

        social.getUser(user_id, (err) => {
            if(err === 404) {
                return res.sendStatus(404)
            }

            if (err) {
                return res.sendStatus(500);
            }
            

            social.unfollowUser(follower_id, user_id, (err) => {
                // error
                if(err){
                    if(err === 403){
                        return res.status(403).send({"error_message": "You can not unfollow a user that you are not following"})
                    }
                    else if (err === 400) {
                        return res.status(400).send({"error_message": "You can not unfollow a user that does not exist"})
                    }
                    return res.sendStatus(500);
                } 
                // worked
                return res.sendStatus(200);
            })
        })
    })
};

const search_users = (req, res) => {
    let query = req.query.q;

    social.searchUser(query, (err, result) => {
        if (err) {
            // Server Error
            return res.sendStatus(500);
        }

        // worked
        return res.status(200).send(result);
    })
};

module.exports = {
    get_user: get_user,
    add_follow: add_follow,
    remove_follow: remove_follow,
    search_users: search_users
};