package io.scrollback.neighborhoods;

import android.accounts.AccountManager;
import android.app.Activity;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.support.v4.app.DialogFragment;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.auth.GoogleAuthException;
import com.google.android.gms.auth.GoogleAuthUtil;
import com.google.android.gms.auth.UserRecoverableAuthException;
import com.google.android.gms.common.AccountPicker;

import java.io.IOException;

public class GoogleLoginModule extends ReactContextBaseJavaModule {

    public final int REQ_SIGN_IN_REQUIRED = 1000;
    public final int CHOOSE_ACCOUNT_REQUIRED = 1500;
    private final String CALLBACK_TYPE_SUCCESS = "success";
    private final String CALLBACK_TYPE_ERROR = "error";
    private final String CALLBACK_TYPE_CANCEL = "cancel";
    private String mAccountName;
    private String mAccessToken;
    private Context mActivityContext;

    private Callback mRetrieveCallback;

    private Dialog dialog;

    public GoogleLoginModule(ReactApplicationContext reactContext, Context activityContext) {
        super(reactContext);

        mActivityContext = activityContext;
    }

    @Override
    public String getName() {
        return "GoogleLoginModule";
    }

    private void consumeCallback(String type, WritableMap map) {
        if (mRetrieveCallback != null) {
            map.putString("type", type);
            map.putString("provider", "google");

            mRetrieveCallback.invoke(map);
            mRetrieveCallback = null;
        }
    }

    @ReactMethod
    public void logIn(final Callback callback) {
        Intent intent = AccountPicker.newChooseAccountIntent(
                null, null, new String[]{"com.google"},
                false, null, null, null, null);

        if (mRetrieveCallback != null) {
            WritableMap map = Arguments.createMap();

            if (mAccessToken != null) {
                map.putString("accountName", mAccountName);
                map.putString("token", mAccessToken);
                map.putBoolean("cache", true);

                consumeCallback(CALLBACK_TYPE_SUCCESS, map);
            } else {
                map.putString("message", "Cannot register multiple callbacks");

                consumeCallback(CALLBACK_TYPE_CANCEL, map);
            }
        }

        mRetrieveCallback = callback;

        ((Activity) mActivityContext).startActivityForResult(intent, CHOOSE_ACCOUNT_REQUIRED);
    }

    @ReactMethod
    public void logOut(final Callback callback) {
        deleteToken(mAccountName, callback);
    }

    protected void retrieveToken(final String accountName) {
        new AsyncTask<String, Void, String>() {

            @Override
            protected void onPreExecute() {
                super.onPreExecute();

                dialog = new ProgressDialog(mActivityContext, DialogFragment.STYLE_NO_TITLE);
                dialog.show();
            }

            @Override
            protected String doInBackground(String... params) {
                String accountName = params[0];
                String scopes = "oauth2:profile email";
                String token = null;

                try {
                    token = GoogleAuthUtil.getToken(mActivityContext, accountName, scopes);
                } catch (IOException e) {
                    Log.e(Constants.TAG, e.getMessage());

                    if (mRetrieveCallback != null) {
                        WritableMap map = Arguments.createMap();

                        map.putString("message", e.getMessage());

                        consumeCallback(CALLBACK_TYPE_ERROR, map);
                    }
                } catch (UserRecoverableAuthException e) {
                    ((Activity) mActivityContext).startActivityForResult(e.getIntent(), REQ_SIGN_IN_REQUIRED);
                } catch (GoogleAuthException e) {
                    Log.e(Constants.TAG, e.getMessage());

                    if (mRetrieveCallback != null) {
                        WritableMap map = Arguments.createMap();

                        map.putString("message", e.getMessage());

                        consumeCallback(CALLBACK_TYPE_ERROR, map);
                    }
                }

                return token;
            }

            @Override
            protected void onPostExecute(String token) {
                super.onPostExecute(token);

                if (dialog != null && dialog.isShowing()) {
                    dialog.dismiss();
                }

                if (mRetrieveCallback != null) {
                    if (token != null) {
                        mAccessToken = token;

                        WritableMap map = Arguments.createMap();

                        map.putString("accountName", accountName);
                        map.putString("token", mAccessToken);

                        consumeCallback(CALLBACK_TYPE_SUCCESS, map);
                    } else {
                        WritableMap map = Arguments.createMap();

                        map.putString("message", "No access token found");

                        consumeCallback(CALLBACK_TYPE_ERROR, map);
                    }
                }
            }
        }.execute(accountName);
    }

    protected void deleteToken(final String accountName, final Callback callback) {
        new AsyncTask<String, Void, String>() {
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
            }

            @Override
            protected String doInBackground(String... params) {
                mAccessToken = params[0];

                String result = null;

                try {
                    GoogleAuthUtil.clearToken(mActivityContext, mAccessToken);

                    result = "true";
                } catch (GoogleAuthException e) {
                    Log.e(Constants.TAG, e.getMessage());
                } catch (IOException e) {
                    Log.e(Constants.TAG, e.getMessage());
                }

                return result;
            }

            @Override
            protected void onPostExecute(String token) {
                super.onPostExecute(token);

                mAccessToken = null;

                callback.invoke();
            }
        }.execute(accountName);
    }

    public boolean handleActivityResult(final int requestCode, final int resultCode, final Intent data) {
        if ((requestCode == CHOOSE_ACCOUNT_REQUIRED || requestCode == REQ_SIGN_IN_REQUIRED) && resultCode == Activity.RESULT_CANCELED) {
            if (mRetrieveCallback != null) {
                consumeCallback(CALLBACK_TYPE_CANCEL, Arguments.createMap());
            }

            return true;
        }

        if (requestCode == CHOOSE_ACCOUNT_REQUIRED && resultCode == Activity.RESULT_OK) {
            mAccountName = data.getStringExtra(AccountManager.KEY_ACCOUNT_NAME);

            retrieveToken(mAccountName);

            return true;
        } else if (requestCode == REQ_SIGN_IN_REQUIRED && resultCode == Activity.RESULT_OK) {
            // We had to sign in - now we can finish off the token request.
            retrieveToken(mAccountName);

            return true;
        }

        return false;
    }
}
