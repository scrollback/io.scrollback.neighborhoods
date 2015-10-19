package io.scrollback.neighborhoods;

import android.os.AsyncTask;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class URLResolverModule extends ReactContextBaseJavaModule {

    private Map<String, String> resolverCache = new HashMap<>();

    public URLResolverModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "URLResolverModule";
    }

    private String findRedirectURL(String url) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();

        conn.setInstanceFollowRedirects(false);

        int status = conn.getResponseCode();

        if (status != HttpURLConnection.HTTP_OK) {
            if (status == HttpURLConnection.HTTP_MOVED_TEMP
                    || status == HttpURLConnection.HTTP_MOVED_PERM
                    || status == HttpURLConnection.HTTP_SEE_OTHER) {
                return conn.getHeaderField("Location");
            }
        }

        return url;
    }

    @ReactMethod
    public void resolveURL(final String url, final Callback callback) {
        if (resolverCache.containsKey(url)) {
            callback.invoke(resolverCache.get(url));

            return;
        }

        final int maxRedirects = 5;

        new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... voids) {
                try {
                    int redirects = 0;

                    String newURL = findRedirectURL(url);

                    if (!url.equals(newURL)) {
                        String movingTo = newURL;

                        while (movingTo != null && redirects < maxRedirects) {
                            movingTo = findRedirectURL(movingTo);

                            if (movingTo != null) {
                                if (newURL.equals(movingTo)) {
                                    break;
                                } else {
                                    newURL = movingTo;
                                }
                            }

                            redirects++;
                        }
                    }

                    String finalUrl = newURL != null ? newURL : url;

                    resolverCache.put(url, finalUrl);
                    callback.invoke(finalUrl);
                } catch (IOException e) {
                    callback.invoke(url);
                }

                return null;
            }
        }.execute();
    }

    @ReactMethod
    public void invalidateCache(final String url, final Callback callback) {
        if (resolverCache.containsKey(url)) {
            resolverCache.remove(url);
        }

        callback.invoke();
    }
}
