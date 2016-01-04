package io.scrollback.neighborhoods.modules.google;

import android.accounts.AccountManager;
import android.app.Activity;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatDialogFragment;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.auth.GoogleAuthException;
import com.google.android.gms.auth.GoogleAuthUtil;
import com.google.android.gms.auth.UserRecoverableAuthException;
import com.google.android.gms.common.AccountPicker;

import java.io.IOException;

public class GoogleLoginModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final String TAG = "GoogleLogin";

    private static final int REQ_SIGN_IN_REQUIRED = 1000;
    private static final int CHOOSE_ACCOUNT_REQUIRED = 1500;

    private String mAccountName;
    private String mAccessToken;
    private Activity mCurrentActivity;

    private Promise mRetrievePromise;

    private Dialog dialog;

    public GoogleLoginModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);

        reactContext.addActivityEventListener(this);

        mCurrentActivity = activity;
    }

    @Override
    public String getName() {
        return "GoogleLoginModule";
    }

    private void resolvePromise(WritableMap map) {
        if (mRetrievePromise != null) {
            mRetrievePromise.resolve(map);
            mRetrievePromise = null;
        }
    }

    private void rejectPromise(String reason) {
        if (mRetrievePromise != null) {
            mRetrievePromise.reject(reason);
            mRetrievePromise = null;
        }
    }

    @ReactMethod
    public void logIn(final Promise promise) {
        String[] accountTypes = new String[]{"com.google"};
        Intent intent = AccountPicker.newChooseAccountIntent(
                null, null, accountTypes,
                false, null, null, null, null);

        if (mRetrievePromise != null) {
            if (mAccessToken != null) {
                WritableMap map = Arguments.createMap();

                map.putString("accountName", mAccountName);
                map.putString("token", mAccessToken);
                map.putBoolean("cache", true);

                resolvePromise(map);
            } else {
                rejectPromise("Cannot register multiple callbacks");
            }
        }

        mRetrievePromise = promise;

        mCurrentActivity.startActivityForResult(intent, CHOOSE_ACCOUNT_REQUIRED);
    }

    @ReactMethod
    public void logOut(final Promise promise) {
        deleteToken(mAccountName, promise);
    }

    protected void retrieveToken(final String accountName) {
        new AsyncTask<String, Void, Void>() {

            @Override
            protected void onPreExecute() {
                super.onPreExecute();

                dialog = new ProgressDialog(mCurrentActivity, AppCompatDialogFragment.STYLE_NO_TITLE|ProgressDialog.STYLE_SPINNER);
                dialog.setCancelable(false);
                dialog.show();
            }

            @Override
            protected Void doInBackground(String... params) {
                String accountName = params[0];
                String scopes = "oauth2:profile email";

                try {
                    mAccessToken = GoogleAuthUtil.getToken(mCurrentActivity, accountName, scopes);

                    WritableMap map = Arguments.createMap();

                    map.putString("accountName", accountName);
                    map.putString("token", mAccessToken);

                    if (mRetrievePromise != null) {
                        resolvePromise(map);
                    }
                } catch (UserRecoverableAuthException e) {
                    mCurrentActivity.startActivityForResult(e.getIntent(), REQ_SIGN_IN_REQUIRED);
                } catch (GoogleAuthException|IOException e) {
                    Log.e(TAG, e.getMessage());

                    if (mRetrievePromise != null) {
                        rejectPromise(e.getMessage());
                    }
                }

                return null;
            }

            @Override
            protected void onPostExecute(Void params) {
                super.onPostExecute(params);

                if (dialog != null && dialog.isShowing()) {
                    dialog.dismiss();
                }
            }
        }.execute(accountName);
    }

    protected void deleteToken(final String accountName, final Promise promise) {
        new AsyncTask<String, Void, Void>() {
            @Override
            protected Void doInBackground(String... params) {
                mAccessToken = params[0];

                try {
                    GoogleAuthUtil.clearToken(mCurrentActivity, mAccessToken);

                    promise.resolve(true);
                } catch (GoogleAuthException|IOException e) {
                    Log.e(TAG, e.getMessage());

                    promise.reject(e.getMessage());
                }

                return null;
            }
        }.execute(accountName);
    }

    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        if ((requestCode == CHOOSE_ACCOUNT_REQUIRED || requestCode == REQ_SIGN_IN_REQUIRED) && resultCode == Activity.RESULT_CANCELED) {
            if (mRetrievePromise != null) {
                rejectPromise("Login was cancelled");
            }
        }

        if (requestCode == CHOOSE_ACCOUNT_REQUIRED && resultCode == Activity.RESULT_OK) {
            mAccountName = data.getStringExtra(AccountManager.KEY_ACCOUNT_NAME);

            retrieveToken(mAccountName);
        } else if (requestCode == REQ_SIGN_IN_REQUIRED && resultCode == Activity.RESULT_OK) {
            // We had to sign in - now we can finish off the token request.
            retrieveToken(mAccountName);
        }
    }
}
