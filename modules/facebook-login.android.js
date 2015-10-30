import { NativeModules } from "react-native";

const { FacebookLoginModule } = NativeModules;

export default {
	logIn() {
		return new Promise((resolve, reject) => {
			FacebookLoginModule.logIn(result => {
				if (result.type === "success") {
					resolve(result);
				} else {
					const error = new Error();

					for (const item in result) {
						error[item] = result[item];
					}

					reject(error);
				}
			});
		});
	},

	logOut() {
		return new Promise((resolve, reject) => {
			FacebookLoginModule.logOut(result => {
				if (result.type === "success") {
					resolve(result);
				} else {
					reject(new Error(result.message));
				}
			});
		});
	},

	getCurrentToken() {
		return new Promise((resolve, reject) => {
			FacebookLoginModule.getCurrentToken(token => {
				if (token) {
					resolve(token);
				} else {
					reject(new Error("No token available"));
				}
			});
		});
	}
};
