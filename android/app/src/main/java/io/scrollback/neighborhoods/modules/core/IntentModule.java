package io.scrollback.neighborhoods.modules.core;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Intent module. Launch other activities or open URLs.
 */
public class IntentModule extends ReactContextBaseJavaModule {

    public IntentModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "IntentModule";
    }

    /**
     * Return the URL the activity was started with
     *
     * @param callback a callback which is called with the initial URL
     */
    @ReactMethod
    public void getInitialURL(Callback callback) {
        try {
            Activity currentActivity = getCurrentActivity();
            String initialURL = null;

            if (currentActivity != null) {
                Intent intent = currentActivity.getIntent();
                String action = intent.getAction();
                Uri uri = intent.getData();

                if (Intent.ACTION_VIEW.equals(action) && uri != null) {
                    initialURL = uri.toString();
                }
            }

            callback.invoke(null, initialURL);
        } catch (Exception e) {
            callback.invoke(e.getMessage(), null);
        }
    }

    /**
     * Starts a corresponding external activity for the given URL.
     *
     * For example, if the URL is "https://www.facebook.com", the system browser will be opened,
     * or the "choose application" dialog will be shown.
     *
     * @param url the URL to open
     */
    @ReactMethod
    public void openURL(String url) {
        if (url == null || url.isEmpty()) {
            throw new JSApplicationIllegalArgumentException("Invalid URL: " + url);
        }

        try {
            Activity currentActivity = getCurrentActivity();
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));

            if (currentActivity != null) {
                currentActivity.startActivity(intent);
            } else {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getReactApplicationContext().startActivity(intent);
            }
        } catch (Exception e) {
            throw new JSApplicationIllegalArgumentException(
                    "Could not open URL '" + url + "': " + e.getMessage());
        }
    }

    /**
     * Determine whether or not an installed app can handle a given URL.
     *
     * @param url the URL to open
     * @param callback a callback that is always called with a boolean argument
     */
    @ReactMethod
    public void canOpenURL(String url, Callback callback) {
        if (url == null || url.isEmpty()) {
            throw new JSApplicationIllegalArgumentException("Invalid URL: " + url);
        }

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            // We need Intent.FLAG_ACTIVITY_NEW_TASK since getReactApplicationContext() returns
            // the ApplicationContext instead of the Activity context.
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            boolean canOpen =
                    intent.resolveActivity(getReactApplicationContext().getPackageManager()) != null;

            callback.invoke(null, canOpen);
        } catch (Exception e) {
            callback.invoke(e.getMessage(), null);
        }
    }
}
