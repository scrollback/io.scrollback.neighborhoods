import { NativeModules, ToastAndroid } from "react-native";

const { ClipboardModule } = NativeModules;

export default {
	setText(text) {
		ClipboardModule.setText("Copied text from Hey, Neighbor!", text, () => {
			ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
		});
	},

	getText(cb) {
		ClipboardModule.getText(cb);
	}
};
