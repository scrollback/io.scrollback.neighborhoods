"use strict";

module.exports = {
    getNick: function(userId) {
        var nick = (typeof userId === "string") ? userId.replace(/^guest-/, "") : "";

        return nick;
    },

    getPicture: function(userId, size) {
        return "/i/" + userId + "/picture?size=" + (size || 256);
    },

    isGuest: function(user) {
        if (!user) return false;
        if (typeof user === "string") return (/^guest-/.test(user));
        if(typeof user === "object") {
            if (user.identities) {
                return user.identities.reduce(function(prev, identity) {
                    return prev || /^guest:/.test(identity);
                }, false);
            } else {
                return (/^guest-/.test(user.id));
            }
        }

        return false;
    }
};
