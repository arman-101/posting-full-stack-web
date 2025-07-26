const db = require("../../database");

const getUser = (user_id, done) => {
    const user_sql = `SELECT user_id, first_name, last_name, username 
                      FROM users 
                      WHERE user_id=?`;

    const follower_sql = `SELECT f.follower_id, u.first_name, u.last_name, u.username 
                          FROM followers f
                          JOIN users u ON f.follower_id = u.user_id
                          WHERE f.user_id=?`;
    const following_sql = `SELECT f.user_id, u.first_name, u.last_name, u.username 
                           FROM followers f
                           JOIN users u ON f.user_id = u.user_id
                           WHERE f.follower_id=?`;

    const post_sql = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
                      FROM posts p
                      JOIN users u ON p.author_id = u.user_id
                      WHERE p.author_id = ?`;

    const likes_sql = `SELECT u.user_id, u.first_name, u.last_name, u.username
                      FROM users u
                      JOIN likes l ON u.user_id = l.user_id
                      WHERE l.post_id=?`;


    db.get(user_sql, [user_id], (err, user) => {
        if (err) return done(err);
        if (!user) return done(404);

        const profile = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            followers: [],
            following: [],
            posts: [],
        };

        const likes = [];

        db.each(follower_sql, [user_id], (err, follower) => {
            if (err) return done(err);
            profile.followers.push(follower);
        }, () => {
            db.each(following_sql, [user_id], (err, followee) => {
                if (err) return done(err);
                profile.following.push(followee);
            }, () => {

                db.each(likes_sql, [user_id], (err, likes_done) => {
                    if (err) return done(err);
                    likes.push(likes_done);
                }, () => {

                    db.each(post_sql, [user_id], (err, post) => {
                        if (err) return done(err);

                        const formatted_post = {
                            post_id: post.post_id,
                            timestamp: post.date_published,
                            text: post.text,
                            author: {
                                user_id: post.user_id,
                                first_name: post.first_name,
                                last_name: post.last_name,
                                username: post.username,
                            },
                            likes: likes,
                        };
                        profile.posts.push(formatted_post);
                    }, () => {
                        // result
                        done(null, profile);
                    });

                });

            });
        });
    });
};

const followUser = (follower_id, user_id, done) => {
    const check_user_exists_sql = 'SELECT * FROM users WHERE user_id=?';

    // Check if the user with user_id exists
    db.get(check_user_exists_sql, [user_id], (err, row) => {
        if (err) {
            return done(err);
        }

        if (!row) {
            // User doesn't exist, return an error
            return done(404);
        }

        // User exists
        const follow_sql = 'INSERT INTO followers (follower_id, user_id) VALUES (?, ?)';
        const values = [follower_id, user_id];

        db.run(follow_sql, values, function (err) {
            if (err) {
                if (err.errno === 19) {
                    return done(403); // Assuming 403 for duplicate follow
                } else {
                    return done(err);
                }
            }

            return done(null); // Follow was successful
        });
    });
};

const unfollowUser = (follower_id, user_id, done) => {
    const check_user_exists_sql = 'SELECT * FROM followers WHERE user_id=? AND follower_id=?';

    // Check if the user with user_id exists
    db.get(check_user_exists_sql, [user_id, follower_id], (err, row) => {
        if (err) {
            return done(err);
        }

        if (!row) {
            // User doesn't exist, return an error
            return done(403);
        }

        const sql = 'DELETE FROM followers WHERE user_id=? AND follower_id=?';
        let values = [user_id, follower_id];

        db.run(sql, values, function (err) {
            if (err) {
                return done(err)
            }
            return done(null)
        });
    });
};

const searchUser = (query, done) => {

    const sql = `SELECT user_id, first_name, last_name, username
                FROM users
                WHERE first_name LIKE ?
                OR last_name LIKE ?
                OR username LIKE ?`;

    db.all(sql, [query, query, query], (err, users) => {

        // server error
        if (err) {
            return done(500);
        }

        return done(null, users);
    });
}

module.exports = {
    getUser: getUser,
    followUser: followUser,
    unfollowUser: unfollowUser,
    searchUser: searchUser
}