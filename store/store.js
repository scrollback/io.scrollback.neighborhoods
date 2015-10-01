import data from "../data";

class Store {
    constructor(d) {
        this._data = d;
    }

    getUser() {
        return {
            id: "satya164"
        };
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
