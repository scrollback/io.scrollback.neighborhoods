import storage from "./oembed-storage";

const linkRegex = /<link[^>]*type[ ]*=[ ]*['|"]application\/json\+oembed['|"][^>]*[>]/i;
const contRegex = /content[ ]*=[ ]*["|'][^"']*/i;
const descRegex = /<meta[^>]*name[ ]*=[ ]*['|"]description['|"][^>]*[>]/;

function getContent(regex) {
	return regex[0].match(contRegex)[0].match(/['|"].*/)[0].slice(1);
}

function parseHTML(body) {

	const bodyString = body.replace(/(\r\n|\n|\r)/g, "");

	const res = bodyString.match(linkRegex);

	if (res !== null) {
		return res[0].match(/http[s]?:\/\/[^"']*/i)[0];
	}

	const oembed = {};

	const props = [ "type", "title", "description" ];
	const propsWithType = [ "width", "height" ];

	for (let i = 0; i < props.length; i++) {
		const match = bodyString.match(new RegExp("<meta[^>]*property[ ]*=[ ]*['|\"]og:" + props[i] + "['|\"][^>]*[>]"));

		if (match) {
			oembed[props[i]] = getContent(match);
		}
	}

	for (let i = 0; i < propsWithType.length; i++) {
		const types = [ "video", "image" ];

		for (let j = 0; j < types.length; j++) {
			const match = bodyString.match(new RegExp("<meta[^>]*property[ ]*=[ ]*['|\"]og:" + types[j] + ":" + propsWithType[i] + "['|\"][^>]*[>]"));

			if (match) {
				oembed[propsWithType[i]] = getContent(match);
			}
		}
	}

	const imageUrl = bodyString.match(/<meta[^>]*property[ ]*=[ ]*['|\"]og:image['|"][^>]*[>]/);

	if (imageUrl) {
		oembed.thumbnail_url = getContent(imageUrl);
	}

	if (!oembed.title) {
		const title = bodyString.match(/<title>[^>]*/);

		if (title) {
			oembed.title = title[0].match(/[>][^<]*/)[0].slice(1);
		}
	}

	if (!oembed.description) {
		const description = bodyString.match(descRegex);

		if (description) {
			oembed.description = description[0].match(contRegex)[0].match(/['|"][^'|^"]*/)[0].slice(1);
		}
	}

	return Object.keys(oembed).length ? oembed : null;
}

async function fetchData(url) {
	try {
		const json = await storage.get(url);

		if (typeof json !== "undefined") {
			console.log("returning from storage");
			return json;
		}

		if ((/(\.jpg|\.png)/).test(url)) {
			return {
				type: "image",
				thumbnail_url: url
			};
		} else {
			const res = await fetch(url);
			const body = await res.text();
			const parsed = parseHTML(body);

			let data;

			if (typeof parsed === "string") {
				data = await (await fetch(parsed)).json();
			} else {
				data = parsed;
			}

			if (typeof data === "object" && data !== null) {
				storage.save(url, data);

				return data;
			}
		}
	} catch (e) {
		// Ignore
		return null;
	}
}

export default {
	fetchData
};
