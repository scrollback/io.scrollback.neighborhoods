package io.scrollback.neighborhoods;

import android.content.Intent;

import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactPackage;
import com.imagechooser.ImageChooserPackage;

import java.util.Arrays;
import java.util.List;

import io.scrollback.neighborhoods.bundle.JSBundleManager;
import io.scrollback.neighborhoods.modules.analytics.AnalyticsPackage;
import io.scrollback.neighborhoods.modules.core.CorePackage;
import io.scrollback.neighborhoods.modules.facebook.FacebookLoginPackage;
import io.scrollback.neighborhoods.modules.gcm.PushNotificationPackage;
import io.scrollback.neighborhoods.modules.google.GoogleLoginPackage;

public class MainActivity extends ReactActivity {

    private GoogleLoginPackage mGoogleLoginPackage = new GoogleLoginPackage(this);
    private FacebookLoginPackage mFacebookLoginPackage = new FacebookLoginPackage(this);
    private ImageChooserPackage mChoosersPackage = new ImageChooserPackage(this);

    @Override
    protected String getJSBundleFile() {
        return new JSBundleManager.Builder()
                .setBundleAssetName("index.android.bundle")
                .setMetadataName("metadata.json")
                .setRequestPath(
                        getString(R.string.app_protocol) + "//" +
                        getString(R.string.app_host) + "/s/bundles/android/" + BuildConfig.VERSION_NAME)
                .setCacheDir(getCacheDir())
                .setAssetManager(getAssets())
                .setEnabled(!BuildConfig.DEBUG)
                .build()
                .checkUpdate()
                .getJSBundleFile();
    }

    @Override
    protected String getMainComponentName() {
        return "HeyNeighbor";
    }

    @Override
    protected List<ReactPackage> getAdditionalPackages() {
        return Arrays.asList(
                new CorePackage(this),
                new PushNotificationPackage(this),
                new AnalyticsPackage(),
                mGoogleLoginPackage,
                mFacebookLoginPackage,
                mChoosersPackage
        );
    }

    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    @Override
    protected void onPause() {
        super.onPause();

        AppEventsLogger.deactivateApp(this);
    }

    @Override
    protected void onResume() {
        super.onResume();

        AppEventsLogger.activateApp(this);
    }

    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        mGoogleLoginPackage.handleActivityResult(requestCode, resultCode, data);
        mFacebookLoginPackage.handleActivityResult(requestCode, resultCode, data);
        mChoosersPackage.handleActivityResult(requestCode, resultCode, data);
    }
}
