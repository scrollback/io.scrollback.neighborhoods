export default {
	link: /<link[^>]*type[ ]*=[ ]*['|"]application\/json\+oembed['|"][^>]*[>]/i,
	content: /content[ ]*=[ ]*["|'][^"']*/i,
	description: /<meta[^>]*name[ ]*=[ ]*['|"]description['|"][^>]*[>]/i,
	title: /<title.*>[^>]*/,
	image: /<meta[^>]*property[ ]*=[ ]*['|\"]og:image['|"][^>]*[>]/,
	matchHTTP: /http[s]?:\/\/[^"']*/i,
	propertyRegex(prop, type) {
		if (typeof type === "undefined") {
			return new RegExp("<meta[^>]*property[ ]*=[ ]*['|\"]og:" + type + ":" + prop + "['|\"][^>]*[>]");
		}

		return new RegExp("<meta[^>]*property[ ]*=[ ]*['|\"]og:" + prop + "['|\"][^>]*[>]");
	}
};
