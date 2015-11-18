package io.scrollback.neighborhoods;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Checksum {
    public static String MD5(File path) throws IOException, NoSuchAlgorithmException {
        FileInputStream fis = new FileInputStream(path);
        MessageDigest md = MessageDigest.getInstance("MD5");

        byte[] buffer = new byte[8192];
        int numOfBytesRead;

        while ((numOfBytesRead = fis.read(buffer)) > 0) {
            md.update(buffer, 0, numOfBytesRead);
        }

        byte[] hash = md.digest();

        return String.format("%032x", new BigInteger(1, hash));
    }
}
