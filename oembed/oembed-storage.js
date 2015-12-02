import { AsyncStorage } from "react-native";

let data;

export default {
	async _readData() {
		const dataString = await AsyncStorage.getItem("oembed_storage");

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
		const item = await this.get(url);

		if (item) {
			item.json = json;
		} else {
			data.push({
				url,
				json
			});
		}

		if (data.length >= 100) {
			data.splice(0, 10);
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
