import { NativeModules } from "react-native";

const { GoogleLoginModule } = NativeModules;

export default {
	logIn() {
		return new Promise((resolve, reject) => {
			GoogleLoginModule.logIn(result => {
				if (result.type === "success") {
					resolve(result);
				} else {
					const error = new Error(result.message);

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
			GoogleLoginModule.logOut(result => {
				if (result.type === "success") {
					resolve(result);
				} else {
					const error = new Error(result.message);

					for (const item in result) {
						error[item] = result[item];
					}

					reject(error);
				}
			});
		});
	}
};
