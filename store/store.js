import data from "../data";

let user = {
    id: "satya164",
    type: "user",
    createTime: 1421602250498,
    description: "After all this time? Always.",
    identities: [
        "mailto:satyajit.happy@gmail.com"
    ],
    params: {
        email: {
            frequency: "daily",
            notifications: false
        },
        pictures: [
            "https://lh4.googleusercontent.com/-oj3ghzcr1Qg/AAAAAAAAAAI/AAAAAAAAOkw/wjtabXxcxVk/photo.jpg",
            "https://gravatar.com/avatar/84d56ea2b15f524765efe80e7fa6be06/?d=retro",
            "https://lh4.googleusercontent.com/-oj3ghzcr1Qg/AAAAAAAAAAI/AAAAAAAAV-A/qhYBmlcKM0Q/photo.jpg",
            "https://graph.facebook.com/100000665916861/picture?type=square",
            "https://lh4.googleusercontent.com/-oj3ghzcr1Qg/AAAAAAAAAAI/AAAAAAAAWxo/nZWZsz5-oBs/photo.jpg",
            "https://lh4.googleusercontent.com/-oj3ghzcr1Qg/AAAAAAAAAAI/AAAAAAAAXE0/JzoTI5aD00o/photo.jpg",
            "https://lh4.googleusercontent.com/-oj3ghzcr1Qg/AAAAAAAAAAI/AAAAAAAAX3g/6vQ62-glx3g/photo.jpg"
        ],
        notifications: {
            sound: false,
            desktop: false,
            push: true
        }
    },
    picture: "https://graph.facebook.com/100000665916861/picture?type=square"
};

class Store {
    constructor(d) {
        this._data = d;
    }

    getUser() {
        return user;
    }

    setUser(u) {
        user = u;
    }

    getRoom(roomId) {
        for (let i = 0, l = this._data.rooms.length; i < l; i++) {
            const room = this._data.rooms[i];

            if (room && room.id === roomId) {
                return room;
            }
        }
    }

    getTexts() {
        return this._data.texts;
    }

    getThreads() {
        return this._data.threads;
    }

    getAllRooms() {
        return this._data.rooms;
    }

    getRelation(roomId, userId) {
        return {
            user: userId,
            room: roomId,
            role: Math.random() < 0.5 ? "follower" : "none"
        };
    }

    getRelatedRooms() {
        return this._data.rooms.slice(0, 5);
    }

    getRelatedUsers() {
        return this._data.users;
    }

    getNotes() {
        return this._data.notes;
    }

    getThreadById(id) {
        const threads = this._data.threads;

        for (let i = 0, l = threads.length; i < l; i++) {
            if (threads[i] && threads[i].id === id) {
                return threads[i];
            }
        }
    }

    getRoomById(id) {
        const rooms = this._data.rooms;

        for (let i = 0, l = rooms.length; i < l; i++) {
            if (rooms[i] && rooms[i].id === id) {
                return rooms[i];
            }
        }
    }
}

export default new Store(data);
