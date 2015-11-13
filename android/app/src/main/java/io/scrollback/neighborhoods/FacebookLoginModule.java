package io.scrollback.neighborhoods;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookRequestError;
import com.facebook.FacebookSdk;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.util.Arrays;

public class FacebookLoginModule extends ReactContextBaseJavaModule {

    private Context mActivityContext;
    private CallbackManager mCallbackManager;
    private Promise mTokenPromise;

    public FacebookLoginModule(ReactApplicationContext reactContext, Context activityContext) {
        super(reactContext);

        mActivityContext = activityContext;

        FacebookSdk.sdkInitialize(activityContext.getApplicationContext());

        mCallbackManager = CallbackManager.Factory.create();

        LoginManager.getInstance().registerCallback(mCallbackManager,
                new FacebookCallback<LoginResult>() {
                    @Override
                    public void onSuccess(final LoginResult loginResult) {
                        if (loginResult.getRecentlyGrantedPermissions().contains("email")) {
                            GraphRequest.newMeRequest(
                                    loginResult.getAccessToken(),
                                    new GraphRequest.GraphJSONObjectCallback() {
                                        @Override
                                        public void onCompleted(JSONObject me, GraphResponse response) {
                                            if (mTokenPromise != null) {
                                                FacebookRequestError error = response.getError();

                                                if (error != null) {
                                                    rejectPromise(error.getErrorMessage());
                                                } else {
                                                    WritableMap map = Arguments.createMap();

                                                    map.putString("token", loginResult.getAccessToken().getToken());

                                                    resolvePromise(map);
                                                }
                                            }
                                        }
                                    }).executeAsync();
                        } else {
                            rejectPromise("Insufficient permissions");
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

    @Override
    public String getName() {
        return "FacebookLoginModule";
    }

    @ReactMethod
    public void logIn(final Promise promise) {
        if (mTokenPromise != null) {
            AccessToken accessToken = AccessToken.getCurrentAccessToken();

            if (accessToken != null) {
                WritableMap map = Arguments.createMap();

                map.putString("token", AccessToken.getCurrentAccessToken().getToken());
                map.putBoolean("cache", true);

                resolvePromise(map);
            } else {
                rejectPromise("Cannot register multiple callbacks");
            }
        }

        mTokenPromise = promise;

        LoginManager.getInstance().logInWithReadPermissions(
                (Activity) mActivityContext,
                Arrays.asList("public_profile", "email"));
    }

    @ReactMethod
    public void logOut(final Promise promise) {
        LoginManager.getInstance().logOut();

        promise.resolve(true);
    }

    @ReactMethod
    public void getCurrentToken(final Promise promise) {
        String token = AccessToken.getCurrentAccessToken().getToken();

        if (token != null) {
            promise.resolve(token);
        } else {
            promise.reject("Failed to get current token");
        }
    }

    public boolean handleActivityResult(final int requestCode, final int resultCode, final Intent data) {
        return mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }
}
