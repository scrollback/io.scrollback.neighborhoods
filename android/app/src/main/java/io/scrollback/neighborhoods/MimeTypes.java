package io.scrollback.neighborhoods;

import java.util.HashMap;
import java.util.Map;

public class MimeTypes {
    private static Map<String, String> mimeTypes;

    private static void addTypes() {
        mimeTypes = new HashMap<>();

        mimeTypes.put("json", "application/json");
        mimeTypes.put("map", "application/json");
        mimeTypes.put("topojson", "application/json");
        mimeTypes.put("rdf", "application/xml");
        mimeTypes.put("xml", "application/xml");
        mimeTypes.put("js", "application/javascript");
        mimeTypes.put("appcache", "text/cache-manifest");
        mimeTypes.put("mid", "audio/midi");
        mimeTypes.put("midi", "audio/midi");
        mimeTypes.put("kar", "audio/midi");
        mimeTypes.put("mp3", "audio/mpeg");
        mimeTypes.put("oga", "audio/ogg");
        mimeTypes.put("ogg", "audio/ogg");
        mimeTypes.put("opus", "audio/ogg");
        mimeTypes.put("ra", "audio/x-realaudio");
        mimeTypes.put("wav", "audio/x-wav");
        mimeTypes.put("bmp", "image/bmp");
        mimeTypes.put("gif", "image/gif");
        mimeTypes.put("jpeg", "image/jpeg");
        mimeTypes.put("jpg", "image/jpeg");
        mimeTypes.put("png", "image/png");
        mimeTypes.put("tif", "image/tiff");
        mimeTypes.put("tiff", "image/tiff");
        mimeTypes.put("webp", "image/webp");
        mimeTypes.put("jng", "image/x-jng");
        mimeTypes.put("mpeg", "video/mpeg");
        mimeTypes.put("mpg", "video/mpeg");
        mimeTypes.put("ogv", "video/ogg");
        mimeTypes.put("mov", "video/quicktime");
        mimeTypes.put("webm", "video/webm");
        mimeTypes.put("flv", "video/x-flv");
        mimeTypes.put("mng", "video/x-mng");
        mimeTypes.put("asx", "video/x-ms-asf");
        mimeTypes.put("asf", "video/x-ms-asf");
        mimeTypes.put("wmv", "video/x-ms-wmv");
        mimeTypes.put("avi", "video/x-msvideo");
        mimeTypes.put("cur", "image/x-icon");
        mimeTypes.put("ico", "image/x-icon");
        mimeTypes.put("woff", "application/font-woff");
        mimeTypes.put("ttc", "application/x-font-ttf");
        mimeTypes.put("ttf", "application/x-font-ttf");
        mimeTypes.put("otf", "font/opentype");
        mimeTypes.put("jar", "application/java-archive");
        mimeTypes.put("war", "application/java-archive");
        mimeTypes.put("ear", "application/java-archive");
        mimeTypes.put("bin", "application/octet-stream");
        mimeTypes.put("deb", "application/octet-stream");
        mimeTypes.put("dll", "application/octet-stream");
        mimeTypes.put("dmg", "application/octet-stream");
        mimeTypes.put("exe", "application/octet-stream");
        mimeTypes.put("img", "application/octet-stream");
        mimeTypes.put("iso", "application/octet-stream");
        mimeTypes.put("msi", "application/octet-stream");
        mimeTypes.put("msm", "application/octet-stream");
        mimeTypes.put("msp", "application/octet-stream");
        mimeTypes.put("safariextz", "application/octet-stream");
        mimeTypes.put("pdf", "application/pdf");
        mimeTypes.put("ps", "application/postscript");
        mimeTypes.put("eps", "application/postscript");
        mimeTypes.put("ai", "application/postscript");
        mimeTypes.put("rtf", "application/rtf");
        mimeTypes.put("zip", "application/zip");
        mimeTypes.put("css", "text/css");
        mimeTypes.put("html", "text/html");
        mimeTypes.put("htm", "text/html");
        mimeTypes.put("shtml", "text/html");
        mimeTypes.put("mml", "text/mathml");
        mimeTypes.put("txt", "text/plain");
        mimeTypes.put("vcard", "text/vcard");
        mimeTypes.put("vcf", "text/vcard");
        mimeTypes.put("vtt", "text/vtt");
    }

    public static String get(String extension) {
        if (mimeTypes == null) {
            addTypes();
        }

        return mimeTypes.get(extension);
    }
}
