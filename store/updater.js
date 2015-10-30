import AlertDialog from "../modules/alert-dialog";
import BuildConfig from "../modules/build-config";
import Linking from "../modules/linking";

const CHECK_URL = "https://raw.githubusercontent.com/scrollback/static/gh-pages/assets/app-update.json";

async function checkUpdate() {
	try {
		const response = await fetch(CHECK_URL);
		const data = await response.json();

		if (
			(data.minimum_version_name !== BuildConfig.VERSION_NAME) ||
			(data.minimum_version_code > BuildConfig.VERSION_CODE)
		) {
			AlertDialog.Builder()
				.setTitle(data.action_title)
				.setMessage(data.action_message)
				.setPositiveButton(data.action_label, () => Linking.openURL(data.action_link))
				.show();
		}
	} catch (e) {
		// Ignore
	}
}

export default { checkUpdate };
