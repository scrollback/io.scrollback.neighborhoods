export default function(text) {
    const matches = /\b(http|https):\/\/(\S*)\b/i.exec(text);

    if (matches && matches.length) {
        let url = matches[0];

        if (/youtube\.com/.test(url)) {
            return "http://youtube.com/oembed?format=json&maxheight=240&url=" + encodeURIComponent(url);
        }
    }

    return null;
}
