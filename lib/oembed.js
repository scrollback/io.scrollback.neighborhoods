export default function(link) {
    if (/youtube\.com/.test(link)) {
        return "http://youtube.com/oembed?format=json&maxheight=240&url=" + encodeURIComponent(link);
    }

    return null;
}
