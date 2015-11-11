const smileyMap = {
	// Heart
	"❤️": "<3",
	"💔": "</3",

	// Cool
	"😎": "8)",

	// Astonished
	"😧": "D:",

	// Monkey
	"🐵": ":o)",

	// Smile
	"🙂": [ "(:", ":)", ":-)", ":-]", ":->", ":>" ],
	"😀": [ "=)", "=-)", ":3" ],

	// Grin
	"😃": [ ":D", ":-D" ],

	// Frown
	"😟": [ ":(", ":-(", ":-c" ],

	// Wink
	"😉": [ ";)", ";-)", ",-)", "*-)" ],

	// Tongue
	"😛": [ ":p", ":–p", ":b", ":-b" ],
	"😜": [ ";p", ";–p", ";b", ";-b" ],

	// Open mouth
	"😱": [ ":o", ":-o", ":-()" ],

	// Distorted mouth
	"😕": [ ":/", ":-/", ":\\", ":-\\" ],

	// Beaked lips
	"😗": [ ":*", ":-*", ":-<>" ],
	"😘": ":-@",

	// Sealed lips
	"😷": [ ":-X", ":-#" ],

	// Halo
	"😇": [ "0:-)", "o:-)" ],

	// Tear
	"😢": [ ":'(", ":'-(" ],

	// Horns
	"😈": [ ">:-)", ">:-D" ],

	// Blank
	"😐": [ ":|", ":-|" ],

	// Spittle
	"😖": ":-p~~",

	// Arrow
	"😒": [ ">.>", ">_>" ]
};

let regexMap;

function escapeRegex(reg) {
	return reg.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function buildRegexMap() {
	regexMap = [];

	for (const smiley in smileyMap) {
		if (Array.isArray(smileyMap[smiley])) {
			for (let i = 0, l = smileyMap[smiley].length; i < l; i++) {
				regexMap.push([ new RegExp(escapeRegex(smileyMap[smiley][i]), "g"), smiley ]);
			}
		} else {
			regexMap.push([ new RegExp(escapeRegex(smileyMap[smiley]), "g"), smiley ]);
		}
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
