import { NativeModules, ToastAndroid } from "react-native";
import config from "../store/config";

const { ClipboardModule } = NativeModules;

export default {
	async setText(text) {
		await ClipboardModule.setText("Copied text from " + config.app_name, text);

		ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
	},

	getText() {
		return ClipboardModule.getText();
	}
};
