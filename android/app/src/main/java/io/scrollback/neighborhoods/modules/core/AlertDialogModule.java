package io.scrollback.neighborhoods.modules.core;

import android.content.Context;
import android.content.DialogInterface;
import android.support.annotation.Nullable;
import android.support.v7.app.AlertDialog;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class AlertDialogModule extends ReactContextBaseJavaModule {

    private static final int POSITIVE_BUTTON = 0;
    private static final int NEGATIVE_BUTTON = 1;

    Context mActiviyContext;

    public AlertDialogModule(ReactApplicationContext reactContext, Context activityContext) {
        super(reactContext);

        mActiviyContext = activityContext;
    }

    @Override
    public String getName() {
        return "AlertDialogModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();

        constants.put("POSITIVE_BUTTON", POSITIVE_BUTTON);
        constants.put("NEGATIVE_BUTTON", NEGATIVE_BUTTON);

        return constants;
    }

    @ReactMethod
    public void show(
            @Nullable final String title, @Nullable final String message,
            @Nullable final String positiveLabel, @Nullable final String negativeLabel,
            final Callback callback) {

        final AlertDialog.Builder dialog = new AlertDialog.Builder(mActiviyContext);

        dialog.setCancelable(false);

        if (title != null) {
            dialog.setTitle(title);
        }

        if (message != null) {
            dialog.setMessage(message);
        }

        if (positiveLabel != null) {
            dialog.setPositiveButton(positiveLabel,
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface d, int id) {
                            callback.invoke(POSITIVE_BUTTON);
                        }
                    });
        }

        if (negativeLabel != null) {
            dialog.setNegativeButton(negativeLabel,
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface d, int id) {
                            callback.invoke(NEGATIVE_BUTTON);
                        }
                    });
        }

        dialog.show();
    }
}
