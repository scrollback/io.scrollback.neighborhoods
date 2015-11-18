package io.scrollback.neighborhoods;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import okio.BufferedSink;
import okio.Okio;

public class JSBundleManager {

    private final static String TAG = "JSBundleManager";
    private final static String METADATA_NAME = "metadata.json";
    private final static String BUNDLE_NAME = "index.android.bundle";
    private final static String BUNDLE_ASSET_PATH = "assets://" + BUNDLE_NAME;
    private final static String REQUEST_BASE_PATH = "https://heyneighbor.chat/s/bundles/android/" + BuildConfig.VERSION_CODE + "/";

    private final static String PROP_CHECKSUM_MD5 = "checksum_md5";
    private final static String PROP_ASSETS_LIST = "assets";

    private Context mActivityContext;
    private File assetDir;
    private File tmpDir;

    JSBundleManager(Context activityContext) {
        File cacheDir = activityContext.getCacheDir();

        mActivityContext = activityContext;
        assetDir = new File(cacheDir, "assets");
        tmpDir = new File(cacheDir, "tmp");

        AsyncTask.execute(new Runnable() {
            @Override
            public void run() {
                checkUpdate();
            }
        });
    }

    public static String generateMD5(File path) {
        String checksum = null;

        try {
            FileInputStream fis = new FileInputStream(path);
            MessageDigest md = MessageDigest.getInstance("MD5");

            byte[] buffer = new byte[8192];
            int numOfBytesRead;

            while ((numOfBytesRead = fis.read(buffer)) > 0) {
                md.update(buffer, 0, numOfBytesRead);
            }

            byte[] hash = md.digest();

            checksum = String.format("%032x", new BigInteger(1, hash));
        } catch (IOException e) {
            Log.e(TAG, "Failed to calculate MD5", e);
        } catch (NoSuchAlgorithmException e) {
            Log.e(TAG, "Unable to find algorithm MD5", e);
        }

        return checksum;
    }

    public String getBundlePath() {
        File assetFile = new File(assetDir, BUNDLE_NAME);

        if (assetFile.exists()) {
            return assetFile.getAbsolutePath();
        }

        return BUNDLE_ASSET_PATH;
    }

    private String convertStreamToString(InputStream is) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));

        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }

        reader.close();

        return sb.toString();
    }

    private String getStringFromFile(File file) throws IOException {
        FileInputStream fis = new FileInputStream(file);

        String ret = convertStreamToString(fis);

        fis.close();

        return ret;
    }

    private boolean shouldDownloadBundle(JSONObject metadata) throws IOException {
        try {
            // Check if MD5 has changed
            String updateChecksum = metadata.getString(PROP_CHECKSUM_MD5);
            String currentChecksum = generateMD5(new File(assetDir, BUNDLE_NAME));

            if (updateChecksum.equals(currentChecksum)) {
                Log.d(TAG, "Bundle is already up-to-date");

                return false;
            }

            // List unique assets
            List<String> updateAssetsList = new ArrayList<>();

            // Build unique assets list
            JSONArray assets = metadata.getJSONArray(PROP_ASSETS_LIST);

            if (assets != null) {
                for (int i = 0, l = assets.length(); i < l; i++) {
                    // Discard directory implying dpi
                    String assetName = assets.getString(i).replace("/^drawable-([a-z]+)\\//", "");

                    if (updateAssetsList.contains(assetName)) {
                        continue;
                    }

                    updateAssetsList.add(assetName);
                }
            }

            List<String> currentAssetList = Arrays.asList(mActivityContext.getResources().getAssets().list(""));

            for (int i = 0, l = updateAssetsList.size(); i < l; i++) {
                if (!currentAssetList.contains(updateAssetsList.get(i))) {
                    Log.d(TAG, "Asset not found in package: " + updateAssetsList.get(i));

                    return false;
                }
            }

            return true;
        } catch (JSONException e) {
            Log.e(TAG, "Failed to get MD5 from metadata", e);
        }

        return false;
    }

    private File downloadFile(String fileName) throws IOException {
        String downloadUrl = REQUEST_BASE_PATH + fileName;
        OkHttpClient client = new OkHttpClient();

        Log.d(TAG, "Downloading file " + downloadUrl + " to " + tmpDir.getAbsolutePath());

        Request request = new Request.Builder()
                .url(downloadUrl)
                .build();

        Response response = client.newCall(request).execute();

        File file = new File(tmpDir, fileName);

        if (!file.exists() && !file.getParentFile().mkdirs() && !file.createNewFile()) {
            throw new IOException("Failed to create file " + file.getAbsolutePath());
        }

        BufferedSink sink = Okio.buffer(Okio.sink(file));

        sink.writeAll(response.body().source());
        sink.close();

        return file;
    }

    private JSONObject fetchMetadata() throws IOException, JSONException {
        return new JSONObject(getStringFromFile(downloadFile(METADATA_NAME)));
    }

    private File downloadBundle(JSONObject metadata) throws IOException, JSONException {
        File bundle = downloadFile(BUNDLE_NAME);

        String updateChecksum = metadata.getString(PROP_CHECKSUM_MD5);
        String currentChecksum = generateMD5(bundle);

        if (!updateChecksum.equals(currentChecksum)) {
            throw new IOException("MD5 checksums don't match: " + updateChecksum + " != " + currentChecksum);
        }

        return bundle;
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
            OutputStream out = new FileOutputStream(target);

            byte[] buffer = new byte[1024];
            int read;

            while ((read = in.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }

            in.close();
            out.close();
        }
    }

    private boolean cleanUp() {
        return !tmpDir.exists() || tmpDir.delete();
    }

    private void checkUpdate() {
        cleanUp();

        try {
            JSONObject metadata = fetchMetadata();

            if (shouldDownloadBundle(metadata)) {
                downloadBundle(metadata);

                copyFiles(tmpDir, assetDir);
                cleanUp();
            }
        } catch (JSONException e) {
            Log.e(TAG, "Failed to parse metadata", e);
        } catch (IOException e) {
            Log.e(TAG, "Failed to check update", e);
        }
    }
}

