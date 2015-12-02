const numbers = [
	"height",
	"width",
	"thumbnail_height",
	"thumbnail_width"
];

function getMetadata(text) {
	const parts = text.match(/\[!\[([^\]]+)+\]\(([^\)]+)\)\]\(([^\)]+)\)/);

	if (parts && parts.length) {
		const title = parts[1];
		const thumbnailUrlParts = parts[2].split("#");
		const originalUrl = parts[3];

		const metadata = {
			type: "photo",
			url: originalUrl,
			thumbnail_url: thumbnailUrlParts[0].trim(),
			title
		};

		const data = thumbnailUrlParts[1];

		if (data) {
			const pairs = data.split("&");

			for (let i = 0, l = pairs.length; i < l; i++) {
				const kv = pairs[i].split("=");

				metadata[kv[0]] = numbers.indexOf(kv[0]) > -1 ? parseInt(kv[1], 10) : kv[1];
			}
		}

		return metadata;
	} else {
		return null;
	}
}

function getTextFromMetadata(data) {
	if (data.type === "photo") {
		return `[![${data.title}](${data.thumbnail_url}#width=${data.width}&height=${data.height}&thumbnail_width=${data.thumbnail_width}&thumbnail_height=${data.thumbnail_height})](${data.url})`;
	}
}

export default {
	getMetadata,
	getTextFromMetadata
};
