package io.scrollback.neighborhoods;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Checksum {
    public static String MD5(InputStream stream) throws IOException, NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("MD5");

        byte[] buffer = new byte[8192];
        int numOfBytesRead;

        while ((numOfBytesRead = stream.read(buffer)) > 0) {
            md.update(buffer, 0, numOfBytesRead);
        }

        byte[] hash = md.digest();

        return String.format("%032x", new BigInteger(1, hash));
    }

    public static String MD5(File file) throws IOException, NoSuchAlgorithmException {
        InputStream stream = new FileInputStream(file);

        try {
            return MD5(stream);
        } finally {
            stream.close();
        }
    }
}
