const db = require("../../database");

const getFeed = (user_id, done) => {
    let feed_sql;

    if (user_id) {
        console.log("Getting posts for logged-in user");
        feed_sql = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
                    FROM posts p
                    JOIN users u ON p.author_id = u.user_id
                    WHERE p.author_id IN (SELECT f.follower_id FROM followers f WHERE f.user_id=? OR f.follower_id=?)
                    ORDER BY p.date_published DESC`;
    } else {
        console.log("Getting all posts");
        feed_sql = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
                    FROM posts p
                    JOIN users u ON p.author_id = u.user_id
                    ORDER BY p.date_published DESC`;
    }

    const likes_sql = `SELECT u.user_id, u.first_name, u.last_name, u.username
                       FROM users u, likes l
                       WHERE l.post_id=?
                       AND u.user_id`;

    const feed = [];
    let expectedPostCount = 0;

    db.each(feed_sql, [user_id], (err) => {
        if (err) return done(err);
        expectedPostCount++;
    });

    db.each(feed_sql, [user_id], (err, post) => {
        if (err) return done(err);
        
        const likes = [];

        db.each(likes_sql, [post.post_id], (err, row) => {
            if (err) return done(err);
            
            likes.push({
                user_id: row.user_id,
                first_name: row.first_name,
                last_name: row.last_name,
                username: row.username
            });
        }, (err) => {
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

            feed.push(formatted_post);
            feed.sort((a, b) => b.timestamp - a.timestamp);

            // Check if all posts have been processed
            if (feed.length === expectedPostCount) {
                done(null, feed);
            }
        });
    }, () => {
        // End
    });
};


module.exports = {
    getFeed: getFeed
}