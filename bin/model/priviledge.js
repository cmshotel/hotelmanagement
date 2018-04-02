var mongoUtil = require('../mongoUtil');

module.exports = {
    is_admin: function (session) {
        mongoUtil.connectToServer(function (err, db) {
            console.log(session.role);
            if (err) throw err;
        });
    },

    get_user_role: function (session) {
        return session.role;
    },

    get_user: function () {
        return {
            id: session.uid,
            name: session.name,
            email: session.email,
            role: session.role
        }
    }
}