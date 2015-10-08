import { NativeModules } from "react-native";

const { ClipboardModule } = NativeModules;

export default {
	setText(text, cb = () => {}) {
		ClipboardModule.setText("Copied text", text, cb);
	},

	getText(cb) {
		ClipboardModule.getText(cb);
	}
};
