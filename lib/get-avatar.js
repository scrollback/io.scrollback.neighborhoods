export default function(url, size) {
	function replaceparams(u, params) {
		let link = u.replace(/(&|\?)(.+=.+)*/g, "");

		for (const q in params) {
			if (params[q]) {
				link += ((/\?(.*=.*)*/).test(link) ? "&" : "?") + q + "=" + params[q];
			}
		}

		return link;
	}

	if (typeof url !== "string") {
		return null;
	}

	if (/https?\:\/\/.*\.googleusercontent\.com\//.test(url)) {
		return replaceparams(url, {
			sz: size
		});
	}

	if (/https?\:\/\/graph\.facebook\.com\//.test(url)) {
		return replaceparams(url, {
			type: "square",
			height: size,
			width: size
		});
	}

	if (/https?\:\/\/gravatar\.com\//.test(url)) {
		return replaceparams(url, {
			size,
			d: "retro"
		});
	}

	return replaceparams(url, { size });
}
