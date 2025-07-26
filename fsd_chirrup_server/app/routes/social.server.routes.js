const social = require('../controllers/social.server.controllers');
const auth = require('../lib/authentication');

module.exports = function(app) {
    
    app.route('/users/:user_id')
        .get(social.get_user);

    app.route('/users/:user_id/follow')
        .post(auth.isAuthenticated, social.add_follow)
        .delete(auth.isAuthenticated, social.remove_follow);
    
    app.route('/search') 
        .get(social.search_users);
        
};