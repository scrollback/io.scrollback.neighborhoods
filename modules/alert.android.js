import { NativeModules } from "react-native";

const { AlertDialogModule } = NativeModules;

export default {
	prompt(message, buttons) {
		if (buttons.length !== 2) {
			throw new Error("Prompt accepts only two buttons");
		}

		AlertDialogModule.showPrompt(message, buttons[0].text, buttons[1].text, result => {
			switch (result) {
			case AlertDialogModule.DIALOG_OK:
				buttons[0].onPress();
				break;
			case AlertDialogModule.DIALOG_CANCEL:
				buttons[1].onPress();
				break;
			}
		});
	}
};
