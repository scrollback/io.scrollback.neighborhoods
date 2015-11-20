package io.scrollback.neighborhoods;

import android.content.Context;
import android.support.annotation.Nullable;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.security.NoSuchAlgorithmException;

public class JSBundleManager {

    private final static String TAG = "JSBundleManager";
    private final static String METADATA_NAME = "metadata.json";
    private final static String BUNDLE_NAME = "index.android.bundle";
    private final static String BUNDLE_ASSET_PATH = "assets://" + BUNDLE_NAME;
    private final static String REQUEST_BASE_PATH = "https://heyneighbor.chat/s/bundles/android/" + BuildConfig.VERSION_NAME + "/";

    private final static String PROP_FILENAME = "filename";
    private final static String PROP_CHECKSUM_MD5 = "checksum_md5";

    private Context mActivityContext;
    private File assetDir;
    private File tmpDir;

    JSBundleManager(Context activityContext) {
        File cacheDir = activityContext.getCacheDir();

        mActivityContext = activityContext;
        assetDir = new File(cacheDir, "assets");
        tmpDir = new File(cacheDir, "tmp");

        if (!BuildConfig.DEBUG) {
            // Don't check update in development mode
            (new Thread() {
                @Override
                public void run() {
                    checkUpdate();
                }
            }).start();
        }
    }

    public String getBundlePath() {
        File assetFile = new File(assetDir, BUNDLE_NAME);

        if (assetFile.exists()) {
            Log.d(TAG, "Loading bundle from cache");

            return assetFile.getAbsolutePath();
        }

        return BUNDLE_ASSET_PATH;
    }

    private String convertStreamToString(InputStream is) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));

        try {
            StringBuilder sb = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }

            return sb.toString();
        } finally {
            reader.close();
        }
    }

    private String getStringFromFile(File file) throws IOException {
        FileInputStream fis = new FileInputStream(file);

        try {
            return convertStreamToString(fis);
        } finally {
            fis.close();
        }
    }

    private boolean shouldDownloadBundle(JSONObject metadata) throws IOException, NoSuchAlgorithmException {
        try {
            InputStream in;
            File assetFile = new File(assetDir, BUNDLE_NAME);

            if (assetFile.exists()) {
                in = new FileInputStream(assetFile);
            } else {
                in = mActivityContext.getAssets().open(BUNDLE_NAME);
            }

            try {
                // Check if MD5 has changed
                String updateChecksum = metadata.getString(PROP_CHECKSUM_MD5);
                String currentChecksum = Checksum.MD5(in);

                if (updateChecksum.equals(currentChecksum)) {
                    Log.d(TAG, "Bundle is already up-to-date");

                    return false;
                }
            } finally {
                in.close();
            }

            return true;
        } catch (JSONException e) {
            Log.e(TAG, "Failed to get MD5 from metadata", e);
        }

        return false;
    }

    private File downloadFile(String sourceFileName, @Nullable String downloadFileName) throws IOException {
        URL downloadUrl = new URL(REQUEST_BASE_PATH + sourceFileName);

        Log.d(TAG, "Downloading file " + downloadUrl + " to " + tmpDir.getAbsolutePath());

        String fileName = downloadFileName == null ? sourceFileName : downloadFileName;
        URL link = new URL(REQUEST_BASE_PATH + sourceFileName);

        File file = new File(tmpDir, fileName);

        if (!file.exists() && !file.getParentFile().mkdirs() && !file.createNewFile()) {
            throw new IOException("Failed to create file " + file.getAbsolutePath());
        }

        InputStream in = new BufferedInputStream(link.openStream());
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        byte[] buf = new byte[1024];
        int n;

        while (-1 != (n = in.read(buf))) {
            out.write(buf, 0, n);
        }

        out.close();
        in.close();

        byte[] response = out.toByteArray();

        FileOutputStream fos = new FileOutputStream(file);

        fos.write(response);
        fos.close();

        return file;
    }

    private JSONObject fetchMetadata() throws IOException, JSONException {
        return new JSONObject(getStringFromFile(downloadFile(METADATA_NAME, null)));
    }

    private File downloadBundle(JSONObject metadata) throws IOException, JSONException, NoSuchAlgorithmException {
        File bundle = downloadFile(metadata.getString(PROP_FILENAME), BUNDLE_NAME);

        Log.d(TAG, "Verifying downloaded bundle");

        String updateChecksum = metadata.getString(PROP_CHECKSUM_MD5);
        String currentChecksum = Checksum.MD5(bundle);

        if (!updateChecksum.equals(currentChecksum)) {
            throw new IOException("MD5 checksums don't match: " + updateChecksum + " != " + currentChecksum);
        }

        return bundle;
    }

    private void copyStream(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[1024];
        int read;

        while ((read = in.read(buffer)) != -1) {
            out.write(buffer, 0, read);
        }
    }

    private void copyFiles(File source, File target) throws IOException {
        if (source.isDirectory()) {
            Log.d(TAG, "Copying files from " + source.getAbsolutePath() + " to " + target.getAbsolutePath());

            if (!target.exists() && !target.mkdirs()) {
                throw new IOException("Cannot create directory " + target.getAbsolutePath());
            }

            String[] children = source.list();

            for (String child : children) {
                copyFiles(new File(source, child), new File(target, child));
            }
        } else {
            Log.d(TAG, "Copying file " + source.getName() + " to " + target.getParent());

            // Make sure the directory we plan to store the recording in exists
            File directory = target.getParentFile();

            if (directory != null && !directory.exists() && !directory.mkdirs()) {
                throw new IOException("Cannot create directory " + directory.getAbsolutePath());
            }

            InputStream in = new FileInputStream(source);

            try {
                OutputStream out = new FileOutputStream(target);

                try {
                    copyStream(in, out);
                } finally {
                    out.close();
                }
            } finally {
                in.close();
            }
        }
    }

    private void checkUpdate() {
        try {
            JSONObject metadata = fetchMetadata();

            if (shouldDownloadBundle(metadata)) {
                downloadBundle(metadata);

                if (assetDir.exists()) {
                    assetDir.delete();
                }

                copyFiles(tmpDir, assetDir);
            }
        } catch (JSONException e) {
            Log.e(TAG, "Failed to parse metadata", e);
        } catch (IOException e) {
            Log.e(TAG, "Failed to check update", e);
        } catch (NoSuchAlgorithmException e) {
            Log.e(TAG, "Unable to find algorithm MD5", e);
        } finally {
            if (tmpDir.exists()) {
                tmpDir.delete();
            }
        }
    }
}

