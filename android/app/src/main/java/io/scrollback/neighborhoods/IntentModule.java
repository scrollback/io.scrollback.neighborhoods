package io.scrollback.neighborhoods;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class IntentModule extends ReactContextBaseJavaModule {

    ReactApplicationContext mReactContext;
    Context mActivityContext;

    public IntentModule(ReactApplicationContext reactContext, Context activityContext) {
        super(reactContext);

        mReactContext = reactContext;
        mActivityContext = activityContext;
    }

    @Override
    public String getName() {
        return "IntentModule";
    }

    @ReactMethod
    public void getInitialURL(final Callback callback) {
        Intent intent = ((Activity) mActivityContext).getIntent();

        String action = intent.getAction();
        Uri uri = intent.getData();

        if (Intent.ACTION_VIEW.equals(action) && uri != null) {
            callback.invoke(uri.toString());
        } else {
            callback.invoke();
        }
    }

    @ReactMethod
    public void openURL(final String url) {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));

        mActivityContext.startActivity(intent);
    }

    @ReactMethod
    public void canOpenURL(final String url, final Callback callback) {
        PackageManager packageManager = mReactContext.getPackageManager();

        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));

        callback.invoke(intent.resolveActivity(packageManager) != null);
    }
}
