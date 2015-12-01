import storage from "./oembed-storage";
import regexes from "./regexes";
import providers from "./providers";

function getContent(regex) {
	return regex[0].match(regexes.content)[0].match(/['|"].*/)[0].slice(1);
}

function parseHTML(body) {
	const bodyString = body.replace(/(\r\n|\n|\r)/g, "");
	const res = bodyString.match(regexes.link);

	if (res !== null) {
		return res[0].match(regexes.matchHTTP)[0].replace(/&amp;/g, "&");
	}

	const oembed = {};

	const props = [ "type", "title", "description" ];
	const propsWithType = [ "width", "height" ];

	for (let i = 0; i < props.length; i++) {
		const match = bodyString.match(regexes.propertyRegex(props[i]));

		if (match) {
			oembed[props[i]] = getContent(match);
		}
	}

	for (let i = 0; i < propsWithType.length; i++) {
		const types = [ "video", "image" ];

		for (let j = 0; j < types.length; j++) {

			const match = bodyString.match(regexes.propertyRegex(propsWithType[i], types[j]));

			if (match) {
				oembed["thumbnail_" + propsWithType[i]] = getContent(match);
			}
		}
	}

	const imageUrl = bodyString.match(regexes.image);

	if (imageUrl) {
		oembed.thumbnail_url = getContent(imageUrl);
	}

	if (!oembed.title) {
		const title = bodyString.match(regexes.title);

		if (title) {
			oembed.title = title[0].match(/[>][^<]*/)[0].slice(1);
		}
	}

	if (!oembed.description) {
		const description = bodyString.match(regexes.description);

		if (description) {
			oembed.description = description[0].match(regexes.content)[0].match(/['|"][^'|^"]*/)[0].slice(1);
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

async function fetchData(url) {
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
				if (request.getResponseHeader("content-type").indexOf("image") !== -1) {
					resolve({
						type: "image",
						thumbnail_url: url
					});
				} else {
					resolve(embed(url));
				}
			} else {
				reject();
			}
		};

		request.open("HEAD", url, true);
		request.send();
	});
}

export default {
	fetchData
};
