import storage from "./oembed-storage";
import regexes from "./regexes";
import providers from "./providers";

function getContent(regex) {
	return regex[0].match(regexes.content)[0].match(/['|"].*/)[0].slice(1);
}

function decodeText(text) {
	return text
	.replace(/&lt;/g, "<")
	.replace(/&gt;/g, ">")
	.replace(/&amp;/g, "&")
	.replace(/&quot;/g, '"')
	.replace(/&nbsp;/g, " ")
	.replace(/&#(x?)(\d+);/g, (m, p1, p2) => String.fromCharCode(((p1 === "x") ? parseInt(p2, 16) : p2)));
}

function parseHTML(body) {
	const bodyString = body.replace(/(\r\n|\n|\r)/g, "");
	const res = bodyString.match(regexes.link);

	if (res !== null) {
		return res[0].match(regexes.matchHTTP)[0].replace(/&amp;/g, "&");
	}

	const oembed = {
		type: "rich"
	};

	const props = [ "title", "description" ];

	for (let i = 0; i < props.length; i++) {
		const match = bodyString.match(regexes.propertyRegex(props[i]));

		if (match && match.length) {
			oembed[props[i]] = decodeText(getContent(match));
		}
	}

	const propsWithType = [ "width", "height" ];

	for (let i = 0; i < propsWithType.length; i++) {
		const types = [ "video", "image" ];

		for (let j = 0; j < types.length; j++) {
			const match = bodyString.match(regexes.propertyRegex(propsWithType[i], types[j]));

			if (match && match.length) {
				oembed[propsWithType[i]] = parseInt(getContent(match), 10);
			}
		}
	}

	const imageUrl = bodyString.match(regexes.image);

	if (imageUrl) {
		oembed.thumbnail_url = getContent(imageUrl);
	}

	if (!oembed.title) {
		const match = bodyString.match(regexes.title);

		if (match && match.length) {
			const title = title[0].match(/[>][^<]*/);

			if (title && title.length) {
				oembed.title = decodeText(title[0].slice(1));
			}
		}
	}

	if (!oembed.description) {
		const match = bodyString.match(regexes.description);

		if (match && match.length) {
			const description = description[0].match(regexes.content)[0].match(/['|"][^'|^"]*/);

			if (description && description.length) {
				oembed.description = decodeText(description[0].slice(1));
			}
		}
	}

	if (Object.keys(oembed).length) {
		return oembed;
	} else {
		throw new Error("No oEmbed data found");
	}
}

async function embed(url) {
	const res = await fetch(url);
	const body = await res.text();
	const parsed = parseHTML(body);

	let data;

	if (typeof parsed === "string") {
		data = await (await fetch(parsed)).json();
	} else {
		data = parsed;
	}

	if (data) {
		storage.set(url, data);
		return data;
	}
}

async function get(url) {
	if (typeof url !== "string") {
		throw new TypeError("URL must be a string");
	}

	if (!/^https?:\/\//i.test(url)) {
		throw new Error("URL must start with 'http://' or 'https://'");
	}
	const json = await storage.get(url);

	if (typeof json !== "undefined") {
		return json;
	}

	for (let i = 0, l = providers.length; i < l; i++) {
		const provider = providers[i];

		if (provider[0].test(url)) {
			const endpoint = provider[1] + "?format=json&maxheight=240&url=" + encodeURIComponent(url);
			const data = await (await fetch(endpoint)).json();

			storage.set(url, data);

			return data;
		}
	}

	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();

		request.onload = function() {
			if (request.status === 200) {
				const contentType = request.getResponseHeader("content-type");

				if (contentType && contentType.indexOf("image") > -1) {
					resolve({
						type: "image",
						thumbnail_url: url
					});
				} else if (contentType && contentType.indexOf("text/html") > -1) {
					resolve(embed(url));
				} else {
					reject(new Error("Unknown content-type: " + contentType));
				}
			} else {
				reject(new Error(request.responseText + ": " + request.responseCode));
			}
		};

		request.open("HEAD", url, true);
		request.send();
	});
}

export default {
	get
};
