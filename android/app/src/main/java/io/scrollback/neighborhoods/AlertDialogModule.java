package io.scrollback.neighborhoods;

import android.content.Context;
import android.content.DialogInterface;
import android.support.v7.app.AlertDialog;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class AlertDialogModule extends ReactContextBaseJavaModule {

    final int DIALOG_OK = 0;
    final int DIALOG_CANCEL = 1;

    ReactApplicationContext mReactContext;
    Context mActiviyContext;

    public AlertDialogModule(ReactApplicationContext reactContext, Context activityContext) {
        super(reactContext);

        mReactContext = reactContext;
        mActiviyContext = activityContext;
    }

    @Override
    public String getName() {
        return "AlertDialogModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();

        constants.put("DIALOG_OK", DIALOG_OK);
        constants.put("DIALOG_CANCEL", DIALOG_CANCEL);

        return constants;
    }

    @ReactMethod
    public void showPrompt(final String message, final String ok, final String cancel, final Callback callback) {
        final AlertDialog.Builder builder = new AlertDialog.Builder(mActiviyContext);

        builder.setMessage(message)
                .setPositiveButton(ok,
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface d, int id) {
                                d.dismiss();
                                callback.invoke(DIALOG_OK);
                            }
                        })
                .setNegativeButton(cancel,
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface d, int id) {
                                d.cancel();
                                callback.invoke(DIALOG_CANCEL);
                            }
                        });

        builder.create().show();
    }
}
