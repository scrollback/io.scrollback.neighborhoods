function uniqueArray(arr) {
    return Array.isArray(arr) ? arr.filter((t, i) => arr.indexOf(t) === i) : [];
}

function getHashtags(text) {
    return uniqueArray(text.match(/#\S+\b/g));
}

function getLinks(text) {
    return uniqueArray(text.match(/\b(http|https):\/\/(\S+)\b/gi));
}

function getPictures(text) {
    let md = text.match(/!\[([^\]]+)\]\((([^(\s\"\')]+)(\s+\".+\")?)(\))/g),
        pics = [];

    if (Array.isArray(md)) {
        for (let i = 0, l = md.length; i < l; i++) {
            let parts = md[i].match(/!\[([^\]]+)\]\((([^(\s\"\')]+)(\s+\".+\")?)(\))/);

            if (Array.isArray(parts)) {
                pics.push(parts[3]);
            }
        }
    }

    return uniqueArray(pics);
}

export default {
    getHashtags,
    getLinks,
    getPictures
};
