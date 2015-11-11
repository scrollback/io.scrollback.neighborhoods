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
	"☺": [ "(:", ":)", ":-)", ":-]", ":->", ":>" ],
	"😀": [ "=)", "=-)", ":3" ],

	// Grin
	"😂": [ ":D", ":-D" ],

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

let smileyIndex;

function buildIndex() {
	smileyIndex = {};

	for (const smiley in smileyMap) {
		if (Array.isArray(smileyMap[smiley])) {
			for (let i = 0, l = smileyMap[smiley].length; i < l; i++) {
				smileyIndex[smileyMap[smiley][i]] = smiley;
			}
		} else {
			smileyIndex[smileyMap[smiley]] = smiley;
		}
	}
}

function format(text) {
	if (!smileyIndex) {
		buildIndex();
	}

	let formatted = "";

	const lines = text.trim().split("\n");

	for (let i = 0, l = lines.length; i < l; i++) {
		const words = lines[i].split(" ");

		for (let j = 0, k = words.length; j < k; j++) {
			const part = words[j];
			const emoji = smileyIndex[part];

			formatted += (emoji ? emoji : part);

			if (j < k - 1) {
				formatted += " ";
			}
		}

		if (i < l - 1) {
			formatted += "\n";
		}
	}

	return formatted;
}

export default { format };
