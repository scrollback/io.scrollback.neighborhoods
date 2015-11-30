import { AsyncStorage } from "react-native";

let data;

export default {

	async _readData() {
		const dataString = await AsyncStorage.getItem("embed_json");

		if (dataString) {
			data = JSON.parse(dataString);
		} else {
			data = [];
		}
	},

	_findItem(key) {
		for (let i = 0, l = data.length; i < l; i++) {
			if (data[i] && data[i].url === key) {
				return data[i].json;
			}
		}
	},

	async set(url, json) {
		if (!data) {
			await this._readData();
		}

		if (data.length >= 100) {
			data.splice(0, 10);
		}
		const item = this._findItem(url);

		if (item) {
		    item.json = json;
		} else {
		    data.push({
		        url,
		        json
		    });
		}

		return AsyncStorage.setItem("oembed_storage", JSON.stringify(data));
	},

	async get(url) {

		if (!data) {
		    await this._readData();
		}

		return this._findItem(url);
	}

};
