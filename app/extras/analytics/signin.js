import Answers from "../../modules/Answers";
import userUtils from "../../lib/user-utils";
import core from "../../store/core";

function track() {
	let pending;

	function log(success) {
		if (pending.provider) {
			if (pending.signup) {
				Answers.logSignup(pending.provider, success);
			} else {
				Answers.logLogin(pending.provider, success);
			}
		}

		pending = null;
	}

	core.on("error-dn", error => {
		if (pending && error.id === pending.id) {
			log(false);
		}
	});

	core.on("init-dn", init => {
		if (pending && init.id === pending.id) {
			// Check if its a signup
			const { user } = init;

			if (userUtils.isGuest(user.id) && user.identities && user.identities.some(ident => ident.indexOf("mailto:") === 0)) {
				pending.signup = true;
			}

			log(true);
		}
	});

	core.on("init-up", init => {
		// Check if it's a sign in
		if (init.auth) {
			let provider;

			if (init.auth.facebook) {
				provider = "Facebook";
			} else if (init.auth.google) {
				provider = "Google";
			}

			pending = {
				id: init.id,
				provider
			};
		}
	}, 1);
}

export default {
	track
};
