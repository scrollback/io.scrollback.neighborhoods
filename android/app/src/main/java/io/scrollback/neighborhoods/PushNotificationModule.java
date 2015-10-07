package io.scrollback.neighborhoods;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
import android.os.Build;
import android.preference.PreferenceManager;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
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

    private final String CALLBACK_TYPE_SUCCESS = "success";
    private final String CALLBACK_TYPE_ERROR = "error";

    private final String senderId;
    private String mCurrentRegId;
    private ReactContext mReactContext;
    private Context mActivityContext;
    private GoogleCloudMessaging mGcmInstance;
    private boolean isPlayServicesAvailable = false;

    public PushNotificationModule(ReactApplicationContext reactContext, Context activityContext) {
        super(reactContext);

        mReactContext = reactContext;
        mActivityContext = activityContext;

        senderId = activityContext.getString(R.string.gcm_sender_id);

        // Showing status
        if (checkPlayServices()) {
            mGcmInstance = GoogleCloudMessaging.getInstance(mReactContext);
            mCurrentRegId = getRegistrationId(mReactContext);

            isPlayServicesAvailable = true;
        } else {
            Log.e(Constants.TAG, "No valid Google Play Services APK found");
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
                Log.e(Constants.TAG, "This device is not supported");
            }

            return false;
        }

        return true;
    }

    private SharedPreferences getGCMPreferences() {
        return PreferenceManager.getDefaultSharedPreferences(mReactContext);
    }

    private void setRegistrationId(Context context, String regId) {
        final SharedPreferences prefs = getGCMPreferences();
        int appVersion = getAppVersion(context);

        Log.d(Constants.TAG, "Saving registration ID for app version: " + appVersion);

        SharedPreferences.Editor editor = prefs.edit();

        editor.putString(Constants.PROPERTY_REG_ID, regId);
        editor.putInt(Constants.PROPERTY_APP_VERSION, appVersion);
        editor.apply();
    }

    private String getRegistrationId(Context context) {
        final SharedPreferences prefs = getGCMPreferences();
        final String registrationId = prefs.getString(Constants.PROPERTY_REG_ID, "");

        if (registrationId.length() == 0) {
            Log.d(Constants.TAG, "No registration ID found");

            return "";
        }

        // Check if app was updated; if so, it must clear registration id to
        // avoid a race condition if GCM sends a message
        int registeredVersion = prefs.getInt(Constants.PROPERTY_APP_VERSION, Integer.MIN_VALUE);
        int currentVersion = getAppVersion(context);

        if (registeredVersion != currentVersion) {
            Log.d(Constants.TAG, "App version changed or registration expired");

            return "";
        }

        return registrationId;
    }

    @ReactMethod
    public void registerGCM(final Callback callback) {
        if (!isPlayServicesAvailable) {
            WritableMap map = Arguments.createMap();

            map.putString("type", CALLBACK_TYPE_ERROR);
            map.putString("message", "Google Play services not found on device");

            callback.invoke(map);

            return;
        }

        new AsyncTask<Void, Void, String>() {
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
            }

            @Override
            protected String doInBackground(Void... params) {
                try {
                    if (mGcmInstance == null) {
                        mGcmInstance = GoogleCloudMessaging.getInstance(mReactContext);
                    }

                    mCurrentRegId = mGcmInstance.register(senderId);

                    setRegistrationId(mReactContext, mCurrentRegId);

                    return CALLBACK_TYPE_SUCCESS;
                } catch (IOException e) {
                    WritableMap map = Arguments.createMap();

                    map.putString("type", CALLBACK_TYPE_ERROR);
                    map.putString("message", e.getMessage());

                    callback.invoke(map);

                    return CALLBACK_TYPE_ERROR;
                }
            }

            @Override
            protected void onPostExecute(String msg) {
                if (msg.equals(CALLBACK_TYPE_ERROR)) {
                    return;
                }

                String uuid = Settings.Secure.getString(mReactContext.getContentResolver(),
                        Settings.Secure.ANDROID_ID);

                WritableMap map = Arguments.createMap();

                map.putString("type", CALLBACK_TYPE_SUCCESS);
                map.putString("registrationId", mCurrentRegId);
                map.putString("uuid", uuid);
                map.putString("deviceModel", Build.MODEL);

                callback.invoke(map);
            }
        }.execute(null, null, null);
    }

    @ReactMethod
    public void unRegisterGCM(final Callback callback) {
        if (!isPlayServicesAvailable) {
            WritableMap map = Arguments.createMap();

            map.putString("type", CALLBACK_TYPE_ERROR);
            map.putString("message", "Google Play services not found on device");

            callback.invoke(map);

            return;
        }

        new AsyncTask<Void, Void, String>() {

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
            }

            @Override
            protected String doInBackground(Void... params) {
                try {
                    if (mGcmInstance == null) {
                        mGcmInstance = GoogleCloudMessaging.getInstance(mReactContext);
                    }

                    mGcmInstance.unregister();

                    setRegistrationId(mReactContext, mCurrentRegId);

                    return CALLBACK_TYPE_SUCCESS;
                } catch (IOException e) {
                    WritableMap map = Arguments.createMap();

                    map.putString("type", CALLBACK_TYPE_ERROR);
                    map.putString("message", e.getMessage());

                    callback.invoke(map);

                    return CALLBACK_TYPE_ERROR;
                }
            }

            @Override
            protected void onPostExecute(String msg) {
                if (msg.equals(CALLBACK_TYPE_ERROR)) {
                    return;
                }

                WritableMap map = Arguments.createMap();

                map.putString("type", CALLBACK_TYPE_SUCCESS);
                map.putString("registrationId", mCurrentRegId);

                callback.invoke(map);
            }
        }.execute(null, null, null);
    }
}
