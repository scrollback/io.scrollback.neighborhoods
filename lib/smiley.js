const smileyMap = {
	// Smile
	":)": "😀",
	":-)": "😀",
	":-]": "😀",
	":3": "😀",
	":>": "😀",

	// Grin
	":D": "😃",
	":–D": "😃",

	// Frown
	":(": "😟",
	":-(": "😟",
	":-c": "😟",

	// Wink
	";)": "😉",
	";-)": "😉",
	",-)": "😉",
	"*-)": "😉",

	// Tongue
	":-P": "😛",
	":–p": "😛",
	":-b": "😛",

	// Open mouth
	":-O": "😱",
	":–()": "😱",

	// Distorted mouth
	":-/": "😕",

	// Beaked lips
	":-*": "😗",
	":-<>": "😗",
	":-@": "😘",

	// Sealed lips
	":-X": "😷",
	":-#": "😷",

	// Halo
	"0:-)": "😇",

	// Tear
	":'(": "😢",
	":’-(": "😢",

	// Horns
	">:-)": "😈",
	">:-D": "😈",

	// Blank
	":–|": "😐",

	// Spittle
	":-p~~": "😖",

	// Arrow
	">.>": "😒",
	">_>": "😒"
};

let regexMap;

function escapeRegex(reg) {
	return reg.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function buildRegexMap() {
	regexMap = [];

	for (const smiley in smileyMap) {
		regexMap.push([ new RegExp(escapeRegex(smiley), "g"), smileyMap[smiley] ]);
	}
}

function format(text) {
	let formattedText = text;

	if (!regexMap) {
		buildRegexMap();
	}

	for (let i = 0, l = regexMap.length; i < l; i++) {
		const kv = regexMap[i];

		formattedText = formattedText.replace(kv[0], kv[1]);
	}

	return formattedText;
}

export default { format };
