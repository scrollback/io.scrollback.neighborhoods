export function isValidURL(link) {
	return /^((https?|ftp):\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test(link);
}

export function isValidMail(link) {
	return /^(mailto:)?[^@]+@[^@]+\.[^@]+$/i.test(link);
}

export function isValidTel(link) {
	return /^(tel:)?(?:\+?(\d{1,3}))?[-.\s(]*(\d{3})?[-.\s)]*(\d{3})[-.\s]*(\d{4})(?: *x(\d+))?$/.test(link);
}

export function buildLink(link) {
	if (isValidURL(link)) {
		// a normal link
		return /^(https?|ftp):\/\//.test(link) ? link : 'http://' + link;
	}

	if (isValidMail(link)) {
		// an email id
		return /^mailto:/.test(link) ? link : 'mailto:' + link;
	}

	if (isValidTel(link)) {
		// a phone number
		return /^tel:/.test(link) ? link : 'tel:' + link;
	}

	return null;
}

export function parseURLs(text, count) {
	const links = [];
	const words = text.replace(/(\r\n|\n|\r)/g, ' ').split(' ');

	let url;

	for (let i = 0, l = words.length; i < l; i++) {
		url = buildLink(words[i].trim().replace(/[\.,\?!:;]+$/, ''));

		if (/^https?:\/\//.test(url)) {
			links.push(url);

			if (count && links.length >= count) {
				break;
			}
		}
	}

	return links;
}
