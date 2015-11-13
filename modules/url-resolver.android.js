import { NativeModules } from "react-native";

const { URLResolverModule } = NativeModules;

export default {
	resolveURL(url) {
		return new Promise((resolve, reject) => {
			URLResolverModule.resolveURL(url, finalUrl => {
				if (finalUrl) {
					resolve(finalUrl);
				} else {
					reject(new Error("Failed to resolve URL"));
				}
			});
		});
	},

	invalidateCache(url) {
		URLResolverModule.invalidateCache(url);
	}
};
