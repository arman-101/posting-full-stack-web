const db = require("../../database");
const crypto = require('node:crypto');

const getHash = function(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
};

// Creating a user - to create
const addNewUser = (user, done) => {
    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password, salt);

    const sql = `INSERT INTO users (first_name, last_name, username, password, salt) VALUES (?,?,?,?,?)`;
    let values = [user.first_name, user.last_name, user.username, hash, salt.toString('hex')];

    db.run(sql, values, function(err) {

        if(err){
            if(err.errno === 19){
                return done(400)
            }
        }
        
        return done(null, this.lastID);
    })
}

// Authenticates / Logs in user - for login
const authenticateUser = (username, password, done) => {
    const sql = 'SELECT user_id, password, salt FROM users WHERE username=?'

    db.get(sql, [username], (err, row) => {
        if(err) {
            return done(err)
        }
        if(!row) {
            return done(404) // wrong username
        }

        if(row.salt === null) row.salt = ''

        let salt = Buffer.from(row.salt, 'hex')

        if (row.password === getHash(password, salt)) {
            return done(false, row.user_id)
        } else {
            return done(404) // wrong password
        }
    })
}

// Creates new token and saves into DB - for login
const setToken = (id, done) => {
    let token = crypto.randomBytes(16).toString('hex');

    const sql = 'UPDATE users SET session_token=? WHERE user_id=?'
    
    db.run(sql, [token, id], (err) => {
        return done(err, token)
    })
}

// Gets token from DB - for login
const getToken = (id, done) => {
    const sql = 'SELECT session_token FROM users WHERE user_id=?';

    db.get(sql, [id], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);

        // If data is found, pass it to the callback
        return done(null, row.session_token);
    })
}

// Removes token from DB - to log out
const removeToken = (token, done) => {
    const sql = 'UPDATE users SET session_token=null WHERE session_token=?'

    db.run(sql, [token], (err) => {
        return done(err)
    })
}

// Get ID where it's equal to the Session Token - for authentication
const getIdFromToken = (token, done) => {
    const sql = 'SELECT user_id FROM users WHERE session_token=?';

    db.get(sql, [token], (err, user_id) => {
        if(user_id === null) return res.sendStatus(401);
        // no user id found
        if (!user_id) return done(404);
        if(err) return done(err);

        // If data is found, pass it to the callback
        return done(null, user_id.user_id);
    })
}


module.exports = {
    addNewUser: addNewUser,
    authenticateUser: authenticateUser,
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    getIdFromToken: getIdFromToken
}