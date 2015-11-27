import { NativeModules } from "react-native";

const { AlertDialogModule } = NativeModules;

export default {
	POSITIVE_BUTTON: AlertDialogModule.POSITIVE_BUTTON,
	NEGATIVE_BUTTON: AlertDialogModule.NEGATIVE_BUTTON,

	show(title, message, buttons) {
		let positive, negative;

		for (let i = 0, l = buttons.length; i < l; i++) {
			const button = buttons[i];

			switch (button.type) {
			case this.POSITIVE_BUTTON:
				positive = button;
				break;
			case this.NEGATIVE_BUTTON:
				negative = button;
				break;
			}
		}

		AlertDialogModule.show(
			title, message,
			positive ? positive.label : null,
			negative ? negative.label : null,
			type => {
				switch (type) {
				case this.POSITIVE_BUTTON:
					if (positive && typeof positive.onPress === "function") {
						positive.onPress();
					}
					break;
				case this.NEGATIVE_BUTTON:
					if (negative && typeof negative.onPress === "function") {
						negative.onPress();
					}
					break;
				}
			}
		);
	}
};
