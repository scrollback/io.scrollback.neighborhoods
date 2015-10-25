package io.scrollback.neighborhoods;

import android.os.AsyncTask;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class URLResolverModule extends ReactContextBaseJavaModule {

    private Map<String, String> resolverCache = new HashMap<>();
    private Map<String, ArrayList<Callback>> resolveCallbacks = new HashMap<>();
    private ArrayList<String> currentlyResolving = new ArrayList<>();

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

        if (currentlyResolving.contains(url)) {
            if (resolveCallbacks.containsKey(url)) {
                resolveCallbacks.get(url).add(callback);
            } else {
                ArrayList<Callback> list = new ArrayList<>();

                list.add(callback);

                resolveCallbacks.put(url, list);
            }

            return;
        }

        currentlyResolving.add(url);

        final int maxRedirects = 5;

        new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... voids) {
                String finalUrl;

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

                    finalUrl = newURL != null ? newURL : url;

                    resolverCache.put(url, finalUrl);
                } catch (IOException e) {
                    finalUrl = url;
                }

                currentlyResolving.remove(url);

                callback.invoke(finalUrl);

                if (resolveCallbacks.containsKey(url)) {
                    ArrayList<Callback> list = resolveCallbacks.get(url);

                    for (Callback cb : list) {
                        cb.invoke(finalUrl);
                    }
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
