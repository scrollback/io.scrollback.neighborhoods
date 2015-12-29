package io.scrollback.neighborhoods.modules.socialshare;

import android.app.Activity;
import android.net.Uri;

import com.facebook.FacebookSdk;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.share.model.ShareLinkContent;
import com.facebook.share.widget.ShareDialog;

public class SocialShareModule extends ReactContextBaseJavaModule {

    private Activity mCurrentActivity;

    public SocialShareModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);

        FacebookSdk.sdkInitialize(reactContext.getApplicationContext());

        mCurrentActivity = activity;
    }

    @Override
    public String getName() {
        return "SocialShareModule";
    }

    @ReactMethod
    public void shareOnFacebook(final ReadableMap options) {
        ShareLinkContent.Builder builder = new ShareLinkContent.Builder();

        if (options.hasKey("title")) {
            builder.setContentTitle(options.getString("title"));
        }

        if (options.hasKey("description")) {
            builder.setContentDescription(options.getString("description"));
        }

        if (options.hasKey("link")) {
            builder.setContentUrl(Uri.parse(options.getString("link")));
        }

        if (options.hasKey("image")) {
            builder.setImageUrl(Uri.parse(options.getString("image")));
        }

        ShareDialog.show(mCurrentActivity, builder.build());
    }
}
