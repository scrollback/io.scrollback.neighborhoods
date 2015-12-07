package io.scrollback.neighborhoods.modules.core;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class IntentModule extends ReactContextBaseJavaModule {

    private Activity mCurrentActivity;

    public IntentModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);

        mCurrentActivity = activity;
    }

    @Override
    public String getName() {
        return "IntentModule";
    }

    @ReactMethod
    public void getInitialURL(final Promise promise) {
        Intent intent = mCurrentActivity.getIntent();
        String action = intent.getAction();
        Uri uri = intent.getData();

        if (Intent.ACTION_VIEW.equals(action) && uri != null) {
            promise.resolve(uri.toString());
        } else {
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void openURL(final String url) {
        if (url == null || url.isEmpty()) {
            throw new JSApplicationIllegalArgumentException("Invalid URL: " + url);
        }

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));

            mCurrentActivity.startActivity(intent);
        } catch (Exception e) {
            throw new JSApplicationIllegalArgumentException(
                    "Could not open URL '" + url + "': " + e.getMessage());
        }
    }

    @ReactMethod
    public void canOpenURL(final String url, final Callback callback) {
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
            callback.invoke(canOpen);
        } catch (Exception e) {
            throw new JSApplicationIllegalArgumentException(
                    "Could not check if URL '" + url + "' can be opened: " + e.getMessage());
        }
    }
}
