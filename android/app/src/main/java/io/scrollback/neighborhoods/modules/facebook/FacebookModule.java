package io.scrollback.neighborhoods.modules.facebook;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookRequestError;
import com.facebook.FacebookSdk;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.HttpMethod;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class FacebookModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final String ACTIVITY_DOES_NOT_EXIST_ERROR = "Activity doesn't exist";

    private CallbackManager mCallbackManager;
    private Promise mTokenPromise;

    public FacebookModule(ReactApplicationContext reactContext) {
        super(reactContext);

        reactContext.addActivityEventListener(this);

        FacebookSdk.sdkInitialize(reactContext.getApplicationContext());

        mCallbackManager = CallbackManager.Factory.create();

        LoginManager.getInstance().registerCallback(mCallbackManager,
                new FacebookCallback<LoginResult>() {
                    @Override
                    public void onSuccess(final LoginResult loginResult) {
                        if (mTokenPromise != null) {
                            WritableMap map = accessTokenToWritableMap(loginResult.getAccessToken());

                            map.putArray("permissions_granted", permissionsToWritableArray(loginResult.getRecentlyGrantedPermissions()));
                            map.putArray("permissions_declined", permissionsToWritableArray(loginResult.getRecentlyDeniedPermissions()));

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
                            rejectPromise(exception);
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

    private void rejectPromise(Exception reason) {
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

    private WritableMap accessTokenToWritableMap(AccessToken accessToken) {
        WritableMap map = Arguments.createMap();

        map.putString("token", accessToken.getToken());
        map.putString("user_id", accessToken.getUserId());
        map.putDouble("expires", accessToken.getExpires().getTime());

        return map;
    }

    @Override
    public String getName() {
        return "FacebookModule";
    }

    public void registerPermissionCallback(final Promise promise) {
        if (mTokenPromise != null) {
            rejectPromise("Cannot register multiple callbacks");
        } else {
            mTokenPromise = promise;
        }
    }

    @ReactMethod
    public void logInWithReadPermissions(final ReadableArray permissions, final Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity != null) {
            registerPermissionCallback(promise);

            LoginManager.getInstance().logInWithReadPermissions(
                    currentActivity,
                    readableArrayToStringList(permissions));
        } else {
            promise.reject(ACTIVITY_DOES_NOT_EXIST_ERROR);
        }
    }

    @ReactMethod
    public void logInWithPublishPermissions(final ReadableArray permissions, final Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity != null) {
            registerPermissionCallback(promise);

            LoginManager.getInstance().logInWithPublishPermissions(
                    currentActivity,
                    readableArrayToStringList(permissions));
        } else {
            promise.reject(ACTIVITY_DOES_NOT_EXIST_ERROR);
        }
    }

    @ReactMethod
    public void logOut(final Promise promise) {
        LoginManager.getInstance().logOut();

        promise.resolve(true);
    }

    @ReactMethod
    public void getCurrentAccessToken(final Promise promise) {
        AccessToken accessToken = AccessToken.getCurrentAccessToken();

        if (accessToken != null) {
            WritableMap map = accessTokenToWritableMap(accessToken);

            map.putArray("permissions_granted", permissionsToWritableArray(accessToken.getPermissions()));
            map.putArray("permissions_declined", permissionsToWritableArray(accessToken.getDeclinedPermissions()));

            promise.resolve(map);
        } else {
            promise.reject("Failed to get current access token");
        }
    }

    @ReactMethod
    public void sendGraphRequest(final String method, final String path, @Nullable final ReadableMap params, final Promise promise) {
        Bundle parameters = null;

        if (params != null) {
            parameters = new Bundle();

            ReadableMapKeySetIterator it = params.keySetIterator();

            while (it.hasNextKey()) {
                String key = it.nextKey();
                parameters.putString(key, params.getString(key));
            }
        }

        HttpMethod requestMethod;

        switch (method) {
            case "GET":
                requestMethod = HttpMethod.GET;
                break;
            case "POST":
                requestMethod = HttpMethod.POST;
                break;
            case "DELETE":
                requestMethod = HttpMethod.DELETE;
                break;
            default:
                throw new JSApplicationIllegalArgumentException("Invalid method for graph request: " + method);
        }

        new GraphRequest(
                AccessToken.getCurrentAccessToken(),
                path,
                parameters,
                requestMethod,
                new GraphRequest.Callback() {
                    public void onCompleted(GraphResponse response) {
                        FacebookRequestError error = response.getError();

                        if (error != null) {
                            promise.reject(error.getException());
                        } else {
                            promise.resolve(response.getRawResponse());
                        }
                    }
                }
        ).executeAsync();
    }

    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }
}
