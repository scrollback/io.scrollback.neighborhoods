package io.scrollback.neighborhoods;

import android.accounts.AccountManager;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

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
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.util.Arrays;

public class FacebookLoginModule extends ReactContextBaseJavaModule {

    private Context mActivityContext;
    private CallbackManager mCallbackManager;
    private Callback mTokenCallback;

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
                                            if (mTokenCallback != null) {
                                                FacebookRequestError error = response.getError();

                                                if (error != null) {
                                                    WritableMap map = Arguments.createMap();

                                                    map.putString("type", "error");
                                                    map.putString("errorType", error.getErrorType());
                                                    map.putString("message", error.getErrorMessage());
                                                    map.putString("recoveryMessage", error.getErrorRecoveryMessage());
                                                    map.putString("userMessage", error.getErrorUserMessage());
                                                    map.putString("userTitle", error.getErrorUserTitle());
                                                    map.putInt("code", error.getErrorCode());

                                                    mTokenCallback.invoke(map);
                                                } else {
                                                    WritableMap map = Arguments.createMap();

                                                    map.putString("type", "success");
                                                    map.putString("token", loginResult.getAccessToken().getToken());

                                                    mTokenCallback.invoke(map);
                                                }

                                                mTokenCallback = null;
                                            }
                                        }
                                    }).executeAsync();
                        } else {
                            WritableMap map = Arguments.createMap();

                            map.putString("type", "error");
                            map.putString("message", "Insufficient permissions");

                            mTokenCallback.invoke(map);
                            mTokenCallback = null;
                        }
                    }

                    @Override
                    public void onCancel() {
                        if (mTokenCallback != null) {
                            WritableMap map = Arguments.createMap();

                            map.putString("type", "cancel");

                            mTokenCallback.invoke(map);
                            mTokenCallback = null;
                        }
                    }

                    @Override
                    public void onError(FacebookException exception) {
                        if (mTokenCallback != null) {
                            WritableMap map = Arguments.createMap();

                            map.putString("type", "error");
                            map.putString("message", exception.getMessage());

                            mTokenCallback.invoke(map);
                            mTokenCallback = null;
                        }
                    }
                });
    }

    @Override
    public String getName() {
        return "FacebookLoginModule";
    }

    @ReactMethod
    public void pickAccount(final Callback callback) {
        if (mTokenCallback != null) {
            AccessToken accessToken = AccessToken.getCurrentAccessToken();

            WritableMap map = Arguments.createMap();

            if (accessToken != null) {
                map.putString("type", "success");
                map.putString("token", AccessToken.getCurrentAccessToken().getToken());
                map.putBoolean("cache", true);
            } else {
                map.putString("type", "cancel");
                map.putString("message", "Cannot register multiple callbacks");
            }

            mTokenCallback.invoke(map);
        }

        mTokenCallback = callback;

        LoginManager.getInstance().logInWithReadPermissions(
                (Activity) mActivityContext,
                Arrays.asList("public_profile", "email"));
    }

    @ReactMethod
    public void getCurrentToken(final Callback callback) {
        callback.invoke(AccessToken.getCurrentAccessToken().getToken());
    }

    public boolean handleActivityResult(final int requestCode, final int resultCode, final Intent data) {
        return mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }
}
