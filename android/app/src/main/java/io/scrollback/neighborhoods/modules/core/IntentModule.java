package io.scrollback.neighborhoods.modules.core;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

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

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();

        Intent intent = ((Activity) mActivityContext).getIntent();

        String action = intent.getAction();
        Uri uri = intent.getData();

        String initialURL = null;

        if (Intent.ACTION_VIEW.equals(action) && uri != null) {
            initialURL = uri.toString();
        }

        constants.put("initialURL", initialURL);

        return constants;
    }

    @ReactMethod
    public void openURL(final String url) {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));

        mActivityContext.startActivity(intent);
    }

    @ReactMethod
    public void canOpenURL(final String url, final Promise promise) {
        PackageManager packageManager = mReactContext.getPackageManager();

        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));

        promise.resolve(intent.resolveActivity(packageManager) != null);
    }
}
