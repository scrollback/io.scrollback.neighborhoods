package io.scrollback.neighborhoods;

import android.content.Context;
import android.content.DialogInterface;
import android.support.annotation.Nullable;
import android.support.v7.app.AlertDialog;
import android.view.View;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class AlertDialogModule extends ReactContextBaseJavaModule {

    final int DIALOG_OK = 0;
    final int DIALOG_CANCEL = 1;

    private Map<Integer, AlertDialog> mAlertDialogs = new HashMap<>();

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
    public void build(
            final int id,
            @Nullable final String title, @Nullable final String message,
            @Nullable final String ok, @Nullable final String cancel,
            @Nullable final Callback callback) {

        final AlertDialog.Builder builder = new AlertDialog.Builder(mActiviyContext);

        if (title != null) {
            builder.setTitle(title);
        }

        if (message != null) {
            builder.setMessage(message);
        }

        builder.setCancelable(false);

        if (ok != null) {
            builder.setPositiveButton(ok, null);
        }

        if (cancel != null) {
            builder.setNegativeButton(cancel,
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface d, int i) {
                            if (callback != null) {
                                callback.invoke(DIALOG_CANCEL);
                            }
                        }
                    });
        }

        final AlertDialog dialog = builder.create();

        dialog.setOnShowListener(new DialogInterface.OnShowListener() {
            @Override
            public void onShow(DialogInterface d) {
                if (ok != null) {
                    dialog
                            .getButton(AlertDialog.BUTTON_POSITIVE)
                            .setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View view) {
                                    if (callback != null) {
                                        callback.invoke(DIALOG_OK);
                                    }
                                }
                            });
                }
            }
        });

        mAlertDialogs.put(id, dialog);
    }

    @ReactMethod
    public void show(final int id) {
        AlertDialog dialog = mAlertDialogs.get(id);

        if (dialog != null) {
            dialog.show();
        }
    }

    @ReactMethod
    public void dismiss(final int id) {
        AlertDialog dialog = mAlertDialogs.get(id);

        if (dialog != null) {
            dialog.dismiss();
            mAlertDialogs.remove(id);
        }
    }
}
