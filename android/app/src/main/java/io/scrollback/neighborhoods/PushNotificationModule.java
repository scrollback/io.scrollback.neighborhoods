package io.scrollback.neighborhoods;

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
import com.google.android.gms.gcm.GoogleCloudMessaging;

import java.io.IOException;

public class PushNotificationModule extends ReactContextBaseJavaModule {

    private final String SENDER_ID = "949615022713";

    private String mCurrentRegId;
    private ReactContext mReactContext;
    private GoogleCloudMessaging mGcmInstance;

    public PushNotificationModule(ReactApplicationContext ctx) {
        super(ctx);

        mReactContext = ctx;
        mGcmInstance = GoogleCloudMessaging.getInstance(mReactContext);
        mCurrentRegId = getRegistrationId(mReactContext);
    }

    @Override
    public String getName() {
        return "PushNotificationModule";
    }

    private SharedPreferences getGCMPreferences() {
        return PreferenceManager.getDefaultSharedPreferences(mReactContext);
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

        // check if app was updated; if so, it must clear registration id to
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
        new AsyncTask<Void, Void, String>() {
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
            }

            @Override
            protected String doInBackground(Void... params) {
                String msg;

                try {
                    if (mGcmInstance == null) {
                        mGcmInstance = GoogleCloudMessaging.getInstance(mReactContext);
                    }

                    mCurrentRegId = mGcmInstance.register(SENDER_ID);

                    msg = "Device registered, registration ID: " + mCurrentRegId;

                    setRegistrationId(mReactContext, mCurrentRegId);
                } catch (IOException ex) {
                    msg = "Error :" + ex.getMessage();
                }

                return msg;
            }

            @Override
            protected void onPostExecute(String msg) {
                String uuid = Settings.Secure.getString(mReactContext.getContentResolver(),
                        Settings.Secure.ANDROID_ID);

                WritableMap map = Arguments.createMap();

                map.putString("registrationId", mCurrentRegId);
                map.putString("uuid", uuid);
                map.putString("deviceModel", Build.MODEL);

                callback.invoke(map);
            }
        }.execute(null, null, null);
    }

    @ReactMethod
    public void unRegisterGCM(final Callback callback) {
        new AsyncTask<Void, Void, String>() {

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
            }

            @Override
            protected String doInBackground(Void... params) {
                String msg = "";

                try {
                    if (mGcmInstance == null) {
                        mGcmInstance = GoogleCloudMessaging.getInstance(mReactContext);
                    }

                    mGcmInstance.unregister();

                    setRegistrationId(mReactContext, mCurrentRegId);
                } catch (IOException ex) {
                    msg = "Error :" + ex.getMessage();
                }

                return msg;
            }

            @Override
            protected void onPostExecute(String msg) {
                WritableMap map = Arguments.createMap();

                map.putString("registrationId", mCurrentRegId);

                callback.invoke(map);
            }
        }.execute(null, null, null);
    }
}
