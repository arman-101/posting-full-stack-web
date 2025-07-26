const feed = require("../models/feed.server.models");
const users = require("../models/user.server.models");

const get_feed = (req, res) => {
    // get the user_id
    let token = req.get('X-Authorization');

    users.getIdFromToken(token, (err, user_id) => {
        if(err || user_id === null) {
            // user not logged in
            feed.getFeed(user_id, (err, result) => {
                // server error
                if (err) return res.sendStatus(500)
    
                // ok
                return res.status(200).send(result)
            })

            // user not found
            // return res.sendStatus(401);
        }

        else {
            // user logged in
            feed.getFeed(user_id, (err, result) => {
                // server error
                if (err) return res.sendStatus(500)

                // ok
                return res.status(200).send(result)
            })
        }
    })
}

module.exports = {
    get_feed: get_feed
};