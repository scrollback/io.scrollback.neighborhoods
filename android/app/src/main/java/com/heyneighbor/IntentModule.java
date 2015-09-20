package com.heyneighbor;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class IntentModule extends ReactContextBaseJavaModule {
    ReactApplicationContext reactContext;

    public IntentModule(ReactApplicationContext ctx) {
        super(ctx);

        reactContext = ctx;
    }

    @Override
    public String getName() {
        return "IntentManager";
    }

    @ReactMethod
    public void openURL(final String url) {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));

        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        reactContext.startActivity(intent);
    }

    @ReactMethod
    public void canOpenURL(final String url, final Callback callback) {
        PackageManager packageManager = reactContext.getPackageManager();

        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));

        callback.invoke(intent.resolveActivity(packageManager) != null);
    }
}
