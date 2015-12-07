package io.scrollback.neighborhoods.modules.core;

import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ShareModule extends ReactContextBaseJavaModule {

    Context mActiviyContext;

    public ShareModule(ReactApplicationContext reactContext, Context activityContext) {
        super(reactContext);

        mActiviyContext = activityContext;
    }

    @Override
    public String getName() {
        return "ShareModule";
    }

    @ReactMethod
    public void shareItem(final String title, final String content) {
        Intent sharingIntent = new Intent(Intent.ACTION_SEND);

        sharingIntent.setType("text/plain");
        sharingIntent.putExtra(android.content.Intent.EXTRA_TEXT, content);

        mActiviyContext.startActivity(Intent.createChooser(sharingIntent, title));
    }
}
