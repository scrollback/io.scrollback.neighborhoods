import { NativeModules } from "react-native";

const { ImageChooserModule } = NativeModules;

export default {
	pickImage() {
		return new Promise((resolve, reject) => {
			ImageChooserModule.pickImage(result => {
				if (result.type === "success") {
					resolve(result);
				} else {
					reject(new Error("Failed to pick an image"));
				}
			});
		});
	}
};
