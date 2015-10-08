const oEmbedProviders = [
	[ /https?:\/\/(www\.)?youtube\.com\/watch/i, "http://www.youtube.com/oembed" ],
	[ /https?:\/\/youtu\.be\S+/, "http://www.youtube.com/oembed" ],
	[ /https?:\/\/(www\.)?vimeo\.com\S+/i, "http://vimeo.com/api/oembed.json" ],
	[ /https?:\/\/(www\.)?dailymotion\.com\S+/i, "http://www.dailymotion.com/services/oembed" ],
	[ /https?:\/\/(www\.)?flickr\.com\S+/i, "http://www.flickr.com/services/oembed" ],
	[ /https?:\/\/(www\.)?hulu\.com\/watch\S+/i, "http://www.hulu.com/api/oembed.json" ],
	[ /https?:\/\/(www\.)?funnyordie\.com\/videos\S+/i, "http://www.funnyordie.com/oembed" ],
	[ /https?:\/\/(www\.)?soundcloud\.com\S+/i, "http://soundcloud.com/oembed" ],
	[ /https?:\/\/instagr(\.am|am\.com)\/p\S+/i, "http://api.instagram.com/oembed" ]
];

export default function(link: string): ?string {
	for (let i = 0, l = oEmbedProviders.length; i < l; i++) {
		const provider = oEmbedProviders[i];

		if (provider[0].test(link)) {
			return provider[1] + "?format=json&maxheight=240&url=" + encodeURIComponent(link);
		}
	}

	return null;
}
