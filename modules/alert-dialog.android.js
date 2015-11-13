import { NativeModules } from "react-native";
import RCTDeviceEventEmitter from "RCTDeviceEventEmitter";

const { AlertDialogModule } = NativeModules;

let dialogId = 0;

class AlertDialogBuilder {
	setTitle(title) {
		this._title = title;

		return this;
	}

	setMessage(message) {
		this._message = message;

		return this;
	}

	setPositiveButton(label, action) {
		this._positiveLabel = label;
		this._positiveAction = action;

		return this;
	}

	setNegativeButton(label, action) {
		this._negativeLabel = label;
		this._negativeAction = action;

		return this;
	}

	show() {
		dialogId++;

		AlertDialogModule.build(dialogId, this._title, this._message, this._positiveLabel, this._negativeLabel);

		const listener = RCTDeviceEventEmitter.addListener("alertDialogEvent", event => {
			if (event.id !== dialogId) {
				return;
			}

			switch (event.value) {
			case AlertDialogModule.DIALOG_OK:
				this._positiveAction();
				break;
			case AlertDialogModule.DIALOG_CANCEL:
				this._negativeAction();
				break;
			}
		});

		AlertDialogModule.show(dialogId);

		return {
			dismiss() {
				AlertDialogModule.dismiss(dialogId);
				listener.remove();
			}
		};
	}
}

export default {
	Builder() {
		return new AlertDialogBuilder();
	}
};
