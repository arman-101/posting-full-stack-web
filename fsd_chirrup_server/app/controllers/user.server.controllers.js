const users = require("../models/user.server.models");
const Joi = require('joi');

// Create a user
const add_user = (req, res) => {
        // Validate Data
        const schema = Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            username: Joi.string().required(),
            password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})/)
        });
    
        const {error} = schema.validate(req.body);
        if (error) return res.status(400).send({"error_message": error.details[0].message});
    
        let user = Object.assign({}, req.body); // converting req body to an object

        // add user
        users.addNewUser(user, (err, id) => {
            if (err) { // errors
                if (err === 400) {
                    return res.status(400).send("The username is already taken")
                }

                return res.sendStatus(500);
            }
            else { // worked
                return res.status(201).send({user_id: id});
            }
        })
};

// Log in a user
const login_user = (req, res) => {
        // Validate Data
        const schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        });
    
        const {error} = schema.validate(req.body);
        if (error) return res.status(400).send({"error_message": error.details[0].message});
    
        let user = Object.assign({}, req.body); // converting req body to an object

        // authenticate / login user
        users.authenticateUser(user.username, user.password, (err, id) => {
            // errors
            if(err === 404) {
                return res.status(400).send({"error_message": "Invalid username/password supplied"})
            }
            if(err) {
                return res.sendStatus(500) // internal server error
            }
            
            // get token or create one
            users.getToken(id, (err, token) => {
                // error
                if(err) {
                    return res.sendStatus(500)
                }
                
                // if there's a token, return it, otherwise create on and return it
                if(token) {
                    return res.status(200).send({user_id: id, session_token: token})
                } else {
                    users.setToken(id, (err, token) => {
                        if(err) return res.sendStatus(500)
                        return res.status(200).send({user_id: id, session_token: token})
                    })
                }
            })
        })
}

// Log out a user
const logout_user = (req, res, next) => {
    let token = req.get('X-Authorization');

    users.removeToken(token, (err) => {
        if (err) {
            return res.sendStatus(500); // Handle the error
        }
        else {
            return res.sendStatus(200); // Successful logout
        }
    })
}

module.exports = {
    add_user: add_user,
    login_user: login_user,
    logout_user: logout_user
};