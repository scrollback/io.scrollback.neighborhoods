package io.scrollback.neighborhoods;

import android.accounts.AccountManager;
import android.app.Activity;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
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
    private ReactContext mReactContext;
    private Context mActivityContext;

    private Dialog dialog;

    public GoogleLoginModule(ReactApplicationContext ctx, Context aCtx) {
        super(ctx);

        mReactContext = ctx;
        mActivityContext = aCtx;
    }

    @Override
    public String getName() {
        return "GoogleLoginModule";
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        mReactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void login() {
        Intent intent = AccountPicker.newChooseAccountIntent(
                null, null, new String[] {"com.google"},
                false, null, null, null, null);

        ((Activity) mActivityContext).startActivityForResult(intent, CHOOSE_ACCOUNT_REQUIRED);
    }

    @ReactMethod
    public void logout() {
        deleteToken(mAccountName);
    }

    protected void retrieveToken(final String accountName) {
        new AsyncTask<String, Void, String>() {

            @Override
            protected void onPreExecute() {
                super.onPreExecute();

                dialog = new ProgressDialog(mActivityContext);
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
                } catch (UserRecoverableAuthException e) {
                    ((Activity) mActivityContext).startActivityForResult(e.getIntent(), REQ_SIGN_IN_REQUIRED);
                } catch (GoogleAuthException e) {
                    Log.e(Constants.TAG, e.getMessage());
                }

                return token;
            }

            @Override
            protected void onPostExecute(String token) {
                super.onPostExecute(token);

                if (dialog != null && dialog.isShowing()) {
                    dialog.dismiss();
                }

                if (token != null) {
                    mAccessToken = token;

                    WritableMap map = Arguments.createMap();

                    map.putString("accountName", accountName);
                    map.putString("token", mAccessToken);

                    sendEvent("googleTokenReceived", map);
                }
            }
        }.execute(accountName);
    }

    protected void deleteToken(final String accountName) {
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

                mAccessToken = token;

                WritableMap map = Arguments.createMap();

                map.putString("accountName", accountName);
                map.putString("token", mAccessToken);

                sendEvent("googleTokenDeleted", map);
            }
        }.execute(accountName);
    }

    public boolean onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        if (resultCode == Activity.RESULT_CANCELED) {
            return false;
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
