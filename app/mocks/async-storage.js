const data = {};

export default {
	setItem(key, value) {
		data[key] = value;

		return new Promise(resolve => setTimeout(resolve, 0));
	},

	getItem(key) {
		return new Promise(resolve => setTimeout(() => resolve(data[key]), 0));
	},

	removeItem(key) {
		delete data[key];

		return new Promise(resolve => setTimeout(resolve, 0));
	}
};
