import { NativeModules, ToastAndroid } from "react-native";
import config from "../store/config";

const { ClipboardModule } = NativeModules;

export default {
	setText(text) {
		ClipboardModule.setText("Copied text from " + config.app_name, text, () => {
			ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
		});
	},

	getText() {
		return new Promise(resolve => ClipboardModule.getText(resolve));
	}
};
