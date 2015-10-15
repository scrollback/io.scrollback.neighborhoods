function uniqueArray(arr) {
	return Array.isArray(arr) ? arr.filter((t, i) => arr.indexOf(t) === i) : [];
}

function getHashtags(text) {
	return uniqueArray(text.match(/#\S+\b/g));
}

function getLinks(text) {
	return uniqueArray(text.match(/\b(http|https):\/\/(\S+)\b/gi));
}

function getMetadata(text) {
	const parts = text.match(/\[!\[([^\]]+)+\]\(([^\)]+)\)\]\(([^\)]+)\)/);

	if (parts && parts.length) {
		const caption = parts[1];
		const thumbnailUrlParts = parts[2].split("#");
		const originalUrl = parts[3];

		const metaData = {
			type: "image",
			thumbnailUrl: thumbnailUrlParts[0].trim(),
			originalUrl,
			caption
		};

		const data = thumbnailUrlParts[1];

		if (data) {
			const pairs = data.split("&");

			for (let i = 0, l = pairs.length; i < l; i++) {
				const kv = pairs[i].split("=");

				metaData[kv[0]] = kv[1];
			}
		}

		return metaData;
	}
}

function getTextFromMetadata(data) {
	if (data.type === "image") {
		return `[![${data.caption}](${data.thumbnailUrl}#width=${data.width}&height=${data.height})](${data.originalUrl})`;
	}
}

export default {
	getHashtags,
	getLinks,
	getMetadata,
	getTextFromMetadata
};
