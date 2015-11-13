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

public class GoogleLoginModule extends ReactContextBaseJavaModule {

    public final int REQ_SIGN_IN_REQUIRED = 1000;
    public final int CHOOSE_ACCOUNT_REQUIRED = 1500;

    private String mAccountName;
    private String mAccessToken;
    private Context mActivityContext;

    private Promise mRetrievePromise;

    private Dialog dialog;

    public GoogleLoginModule(ReactApplicationContext reactContext, Context activityContext) {
        super(reactContext);

        mActivityContext = activityContext;
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

        ((Activity) mActivityContext).startActivityForResult(intent, CHOOSE_ACCOUNT_REQUIRED);
    }

    @ReactMethod
    public void logOut(final Promise promise) {
        deleteToken(mAccountName, promise);
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

                    if (mRetrievePromise != null) {
                        rejectPromise(e.getMessage());
                    }
                } catch (UserRecoverableAuthException e) {
                    ((Activity) mActivityContext).startActivityForResult(e.getIntent(), REQ_SIGN_IN_REQUIRED);

                    return "false";
                } catch (GoogleAuthException e) {
                    Log.e(Constants.TAG, e.getMessage());

                    if (mRetrievePromise != null) {
                        rejectPromise(e.getMessage());
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

                if (token.equals("false")) {
                    return;
                }

                if (mRetrievePromise != null) {
                    if (token != null) {
                        mAccessToken = token;

                        WritableMap map = Arguments.createMap();

                        map.putString("accountName", accountName);
                        map.putString("token", mAccessToken);

                        resolvePromise(map);
                    } else {
                        rejectPromise("No access token found");
                    }
                }
            }
        }.execute(accountName);
    }

    protected void deleteToken(final String accountName, final Promise promise) {
        new AsyncTask<String, Void, Boolean>() {
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
            }

            @Override
            protected Boolean doInBackground(String... params) {
                mAccessToken = params[0];

                try {
                    GoogleAuthUtil.clearToken(mActivityContext, mAccessToken);

                    return true;
                } catch (GoogleAuthException e) {
                    Log.e(Constants.TAG, e.getMessage());

                    promise.reject(e.getMessage());

                    return false;
                } catch (IOException e) {
                    Log.e(Constants.TAG, e.getMessage());

                    promise.reject(e.getMessage());

                    return false;
                }
            }

            @Override
            protected void onPostExecute(Boolean result) {
                super.onPostExecute(result);

                mAccessToken = null;

                if (result) {
                    promise.resolve(true);
                }
            }
        }.execute(accountName);
    }

    public boolean handleActivityResult(final int requestCode, final int resultCode, final Intent data) {
        if ((requestCode == CHOOSE_ACCOUNT_REQUIRED || requestCode == REQ_SIGN_IN_REQUIRED) && resultCode == Activity.RESULT_CANCELED) {
            if (mRetrievePromise != null) {
                rejectPromise("Login was cancelled");
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
