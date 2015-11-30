package io.scrollback.neighborhoods.modules.gcm;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.gcm.GoogleCloudMessaging;

import java.io.IOException;

public class PushNotificationModule extends ReactContextBaseJavaModule {

    public static final String TAG = "PushNotification";
    public static final String STORAGE_KEY = "push_notifications_shared_preferences";

    private final String PROPERTY_REG_ID = "private_registration_id";
    private final String PROPERTY_APP_VERSION = "private_app_version";

    private String senderId;

    private String mCurrentRegId;
    private ReactContext mReactContext;
    private Context mActivityContext;
    private GoogleCloudMessaging mGcmInstance;
    private boolean isPlayServicesAvailable = false;

    public PushNotificationModule(ReactApplicationContext reactContext, Context activityContext) {
        super(reactContext);

        mReactContext = reactContext;
        mActivityContext = activityContext;

        // Showing status
        if (checkPlayServices()) {
            mGcmInstance = GoogleCloudMessaging.getInstance(mReactContext);
            mCurrentRegId = getRegistrationId(mReactContext);

            isPlayServicesAvailable = true;
        } else {
            Log.e(TAG, "No valid Google Play Services APK found");
        }
    }

    private static int getAppVersion(Context context) {
        try {
            PackageInfo packageInfo = context.getPackageManager()
                    .getPackageInfo(context.getPackageName(), 0);

            return packageInfo.versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            // Should never happen
            throw new RuntimeException("Could not get package name: " + e);
        }
    }

    @Override
    public String getName() {
        return "PushNotificationModule";
    }

    private boolean checkPlayServices() {
        final int PLAY_SERVICES_RESOLUTION_REQUEST = 5000;
        final int resultCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(mReactContext);

        if (resultCode != ConnectionResult.SUCCESS) {
            if (GooglePlayServicesUtil.isUserRecoverableError(resultCode)) {
                GooglePlayServicesUtil.getErrorDialog(resultCode, (Activity) mActivityContext,
                        PLAY_SERVICES_RESOLUTION_REQUEST).show();
            } else {
                Log.e(TAG, "This device is not supported");
            }

            return false;
        }

        return true;
    }

    private SharedPreferences getGCMPreferences() {
        return mReactContext.getSharedPreferences(STORAGE_KEY, Context.MODE_PRIVATE);
    }

    private void setRegistrationId(Context context, String regId) {
        final SharedPreferences prefs = getGCMPreferences();
        int appVersion = getAppVersion(context);

        Log.d(TAG, "Saving registration ID for app version: " + appVersion);

        SharedPreferences.Editor editor = prefs.edit();

        editor.putString(PROPERTY_REG_ID, regId);
        editor.putInt(PROPERTY_APP_VERSION, appVersion);
        editor.apply();
    }

    private String getRegistrationId(Context context) {
        final SharedPreferences prefs = getGCMPreferences();
        final String registrationId = prefs.getString(PROPERTY_REG_ID, "");

        if (registrationId.length() == 0) {
            Log.d(TAG, "No registration ID found");

            return "";
        }

        // Check if app was updated; if so, it must clear registration id to
        // avoid a race condition if GCM sends a message
        int registeredVersion = prefs.getInt(PROPERTY_APP_VERSION, Integer.MIN_VALUE);
        int currentVersion = getAppVersion(context);

        if (registeredVersion != currentVersion) {
            Log.d(TAG, "App version changed or registration expired");

            return "";
        }

        return registrationId;
    }

    @ReactMethod
    public void setGCMSenderID(final String id) {
        senderId = id;
    }

    @ReactMethod
    public void registerGCM(final Promise promise) {
        if (!isPlayServicesAvailable) {
            promise.reject("Google Play services not found on device");

            return;
        }

        if (senderId == null) {
            promise.reject("GCM sender ID is not set");

            return;
        }

        new AsyncTask<Void, Void, Boolean>() {
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
            }

            @Override
            protected Boolean doInBackground(Void... params) {
                try {
                    if (mGcmInstance == null) {
                        mGcmInstance = GoogleCloudMessaging.getInstance(mReactContext);
                    }

                    mCurrentRegId = mGcmInstance.register(senderId);

                    setRegistrationId(mReactContext, mCurrentRegId);

                    return true;
                } catch (IOException e) {
                    promise.reject(e.getMessage());

                    return false;
                }
            }

            @Override
            protected void onPostExecute(Boolean result) {
                if (!result) {
                    return;
                }

                String uuid = Settings.Secure.getString(mReactContext.getContentResolver(),
                        Settings.Secure.ANDROID_ID);

                WritableMap map = Arguments.createMap();

                map.putString("registrationId", mCurrentRegId);
                map.putString("uuid", uuid);
                map.putString("deviceModel", Build.MODEL);

                promise.resolve(map);
            }
        }.execute(null, null, null);
    }

    @ReactMethod
    public void unRegisterGCM(final Promise promise) {
        if (!isPlayServicesAvailable) {
            promise.reject("Google Play services not found on device");

            return;
        }

        new AsyncTask<Void, Void, Boolean>() {

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
            }

            @Override
            protected Boolean doInBackground(Void... params) {
                try {
                    if (mGcmInstance == null) {
                        mGcmInstance = GoogleCloudMessaging.getInstance(mReactContext);
                    }

                    mGcmInstance.unregister();

                    setRegistrationId(mReactContext, mCurrentRegId);

                    return true;
                } catch (IOException e) {
                    promise.reject(e.getMessage());

                    return false;
                }
            }

            @Override
            protected void onPostExecute(Boolean result) {
                if (!result) {
                    return;
                }

                promise.resolve(mCurrentRegId);
            }
        }.execute(null, null, null);
    }

    @ReactMethod
    public void setPreference(final String key, final String value) {
        SharedPreferences.Editor e = getGCMPreferences().edit();

        e.putString(key, value);
        e.apply();
    }

    @ReactMethod
    public void getPreference(final String key, final Promise promise) {
        promise.resolve(getGCMPreferences().getString(key, ""));
    }
}
