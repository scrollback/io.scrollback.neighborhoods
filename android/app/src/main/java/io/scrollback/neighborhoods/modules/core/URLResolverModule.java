package io.scrollback.neighborhoods.modules.core;

import android.os.AsyncTask;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class URLResolverModule extends ReactContextBaseJavaModule {

    private Map<String, String> resolverCache = new ConcurrentHashMap<>();
    private Map<String, ArrayList<Promise>> resolvePromises = new ConcurrentHashMap<>();
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
    public void resolveURL(final String url, final Promise promise) {
        if (resolverCache.containsKey(url)) {
            promise.resolve(resolverCache.get(url));

            return;
        }

        if (currentlyResolving.contains(url)) {
            if (resolvePromises.containsKey(url)) {
                resolvePromises.get(url).add(promise);
            } else {
                ArrayList<Promise> list = new ArrayList<>();

                list.add(promise);

                resolvePromises.put(url, list);
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

                promise.resolve(finalUrl);

                if (resolvePromises.containsKey(url)) {
                    ArrayList<Promise> list = resolvePromises.get(url);

                    for (Promise p : list) {
                        p.resolve(finalUrl);
                    }
                }

                resolvePromises.remove(url);

                return null;
            }
        }.execute();
    }

    @ReactMethod
    public void invalidateCache(final String url) {
        if (resolverCache.containsKey(url)) {
            resolverCache.remove(url);
        }
    }
}
