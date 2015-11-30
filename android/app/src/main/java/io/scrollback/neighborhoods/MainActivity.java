package io.scrollback.neighborhoods;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.view.KeyEvent;

import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import io.scrollback.neighborhoods.modules.analytics.AnalyticsPackage;
import io.scrollback.neighborhoods.bundle.JSBundleManager;
import io.scrollback.neighborhoods.modules.appvirality.AppviralityPackage;
import io.scrollback.neighborhoods.modules.choosers.ChoosersPackage;
import io.scrollback.neighborhoods.modules.core.CorePackage;
import io.scrollback.neighborhoods.modules.facebook.FacebookLoginPackage;
import io.scrollback.neighborhoods.modules.google.GoogleLoginPackage;

public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {

    private ReactInstanceManager mReactInstanceManager;

    private GoogleLoginPackage mGoogleLoginPackage = new GoogleLoginPackage(this);
    private FacebookLoginPackage mFacebookLoginPackage = new FacebookLoginPackage(this);
    private ChoosersPackage mChoosersPackage = new ChoosersPackage(this);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        ReactRootView mReactRootView = new ReactRootView(this);

        String requestPath = getString(R.string.app_protocol) + "//" + getString(R.string.app_host) +
                "/s/bundles/android/" + BuildConfig.VERSION_NAME;

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setJSBundleFile(new JSBundleManager.Builder()
                                .setBundleAssetName("index.android.bundle")
                                .setMetadataName("metadata.json")
                                .setRequestPath(requestPath)
                                .setCacheDir(getCacheDir())
                                .setAssetManager(getAssets())
                                .setEnabled(!BuildConfig.DEBUG)
                                .build()
                                .checkUpdate()
                                .getJSBundleFile())
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new VectorIconsPackage())
                .addPackage(new CorePackage(this))
                .addPackage(new AppviralityPackage(this))
                .addPackage(new AnalyticsPackage())
                .addPackage(mGoogleLoginPackage)
                .addPackage(mFacebookLoginPackage)
                .addPackage(mChoosersPackage)
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        mReactRootView.startReactApplication(mReactInstanceManager, "HeyNeighbor", null);

        setContentView(mReactRootView);
    }

    @Override
    public boolean onKeyUp(int keyCode, @NonNull KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();

            return true;
        }

        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    public void onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onPause();
        }

        AppEventsLogger.deactivateApp(this);
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onResume(this, this);
        }

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
