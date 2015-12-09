package io.scrollback.neighborhoods.modules.core;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ClipboardModule extends ReactContextBaseJavaModule {

    public ClipboardModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ClipboardModule";
    }

    @ReactMethod
    public void setText(final String text) {
        ClipboardManager clipboard = (ClipboardManager) getReactApplicationContext().getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText(null, text);

        clipboard.setPrimaryClip(clip);
    }

    @ReactMethod
    public void getText(final Promise promise) {
        ClipboardManager clipboard = (ClipboardManager) getReactApplicationContext().getSystemService(Context.CLIPBOARD_SERVICE);

        ClipData data = clipboard.getPrimaryClip();
        ClipData.Item item = data.getItemAt(0);

        promise.resolve(item.getText().toString());
    }
}
