package io.scrollback.neighborhoods.modules.gcm;

import android.app.Activity;
import android.content.SharedPreferences;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;

public class PushNotificationModule extends ReactContextBaseJavaModule {

    public static final String TAG = "PushNotification";

    public PushNotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);

        if (!checkPlayServices()) {
            Log.e(TAG, "No valid Google Play Services APK found");
        }
    }

    @Override
    public String getName() {
        return "PushNotificationModule";
    }

    private boolean checkPlayServices() {
        final int PLAY_SERVICES_RESOLUTION_REQUEST = 5000;
        final int resultCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(getReactApplicationContext());

        if (resultCode != ConnectionResult.SUCCESS) {
            if (GooglePlayServicesUtil.isUserRecoverableError(resultCode)) {
                try {
                    Activity currentActivity = getCurrentActivity();

                    if (currentActivity == null) {
                        return false;
                    }

                    GooglePlayServicesUtil.getErrorDialog(resultCode, currentActivity,
                            PLAY_SERVICES_RESOLUTION_REQUEST).show();
                } catch (RuntimeException e) {
                    Log.e(TAG, "Failed to show Google Play Services dialog", e);
                }
            } else {
                Log.e(TAG, "This device is not supported");
            }

            return false;
        }

        return true;
    }

    @ReactMethod
    public void getRegistrationToken(final Promise promise) {
        promise.resolve(PushNotificationPreferences.get(getReactApplicationContext()).getString(PushNotificationPreferences.REGISTRATION_TOKEN, ""));
    }

    @ReactMethod
    public void setPreference(final String key, final String value) {
        SharedPreferences.Editor e = PushNotificationPreferences.get(getReactApplicationContext()).edit();

        e.putString(key, value);
        e.apply();
    }

    @ReactMethod
    public void getPreference(final String key, final Promise promise) {
        promise.resolve(PushNotificationPreferences.get(getReactApplicationContext()).getString(key, ""));
    }
}
