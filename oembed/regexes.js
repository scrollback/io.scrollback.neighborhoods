export default {

	link : /<link[^>]*type[ ]*=[ ]*['|"]application\/json\+oembed['|"][^>]*[>]/i,
	content : /content[ ]*=[ ]*["|'][^"']*/i,
	description : /<meta[^>]*name[ ]*=[ ]*['|"]description['|"][^>]*[>]/i,
	title : /<title.*>[^>]*/,
	image : /<meta[^>]*property[ ]*=[ ]*['|\"]og:image['|"][^>]*[>]/,
	matchHTTP : /http[s]?:\/\/[^"']*/i,
	propertyRegex : function (prop, type) {

		if(type === null){

			return new RegExp("<meta[^>]*property[ ]*=[ ]*['|\"]og:" + type + ":" + prop + "['|\"][^>]*[>]");
		}

		return new RegExp("<meta[^>]*property[ ]*=[ ]*['|\"]og:" + prop + "['|\"][^>]*[>]");
	}
};