package io.scrollback.neighborhoods.modules.facebook;

import android.app.Activity;
import android.content.Intent;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class FacebookLoginModule extends ReactContextBaseJavaModule {

    private Activity mCurrentActivity;
    private CallbackManager mCallbackManager;
    private Promise mTokenPromise;

    public FacebookLoginModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);

        mCurrentActivity = activity;

        FacebookSdk.sdkInitialize(reactContext.getApplicationContext());

        mCallbackManager = CallbackManager.Factory.create();

        LoginManager.getInstance().registerCallback(mCallbackManager,
                new FacebookCallback<LoginResult>() {
                    @Override
                    public void onSuccess(final LoginResult loginResult) {
                        if (mTokenPromise != null) {
                            WritableMap map = Arguments.createMap();

                            map.putString("token", loginResult.getAccessToken().getToken());

                            WritableMap permissions = Arguments.createMap();

                            permissions.putArray("granted", permissionsToWritableArray(loginResult.getRecentlyGrantedPermissions()));
                            permissions.putArray("denied", permissionsToWritableArray(loginResult.getRecentlyDeniedPermissions()));

                            map.putMap("permissions", permissions);

                            resolvePromise(map);
                        }
                    }

                    @Override
                    public void onCancel() {
                        if (mTokenPromise != null) {
                            rejectPromise("Login was cancelled");
                        }
                    }

                    @Override
                    public void onError(FacebookException exception) {
                        if (mTokenPromise != null) {
                            rejectPromise(exception.getMessage());
                        }
                    }
                });
    }

    private void resolvePromise(WritableMap map) {
        if (mTokenPromise != null) {
            mTokenPromise.resolve(map);
            mTokenPromise = null;
        }
    }

    private void rejectPromise(String reason) {
        if (mTokenPromise != null) {
            mTokenPromise.reject(reason);
            mTokenPromise = null;
        }
    }

    private List<String> readableArrayToStringList(final ReadableArray array) {
        List<String> stringList = new ArrayList<>();

        for (int i = 0, l = array.size(); i < l; i++) {
            stringList.add(array.getString(i));
        }

        return stringList;
    }

    private WritableArray permissionsToWritableArray(Set<String> permissions) {
        WritableArray result = Arguments.createArray();

        for(String p: permissions) {
            result.pushString(p);
        }

        return result;
    }

    @Override
    public String getName() {
        return "FacebookLoginModule";
    }

    public void registerPermissionCallback(final Promise promise) {
        if (mTokenPromise != null) {
            rejectPromise("Cannot register multiple callbacks");
        }

        mTokenPromise = promise;
    }

    @ReactMethod
    public void logInWithReadPermissions(final ReadableArray permissions, final Promise promise) {
        registerPermissionCallback(promise);

        LoginManager.getInstance().logInWithReadPermissions(
                mCurrentActivity,
                readableArrayToStringList(permissions));
    }

    @ReactMethod
    public void logInWithPublishPermissions(final ReadableArray permissions, final Promise promise) {
        registerPermissionCallback(promise);

        LoginManager.getInstance().logInWithPublishPermissions(
                mCurrentActivity,
                readableArrayToStringList(permissions));
    }

    @ReactMethod
    public void getPermissions(final Promise promise) {
        promise.resolve(permissionsToWritableArray(AccessToken.getCurrentAccessToken().getPermissions()));
    }

    @ReactMethod
    public void logOut(final Promise promise) {
        LoginManager.getInstance().logOut();

        promise.resolve(true);
    }

    @ReactMethod
    public void getCurrentAccessToken(final Promise promise) {
        String token = AccessToken.getCurrentAccessToken().getToken();

        if (token != null) {
            promise.resolve(token);
        } else {
            promise.reject("Failed to get current access token");
        }
    }

    public boolean handleActivityResult(final int requestCode, final int resultCode, final Intent data) {
        return mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }
}
