package io.scrollback.neighborhoods.modules.core;

import android.app.Activity;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class CorePackage implements ReactPackage {

    private Activity mCurrentActivity;

    public CorePackage(Activity activity) {
        mCurrentActivity = activity;
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(
                new ClipboardModule(reactContext),
                new BuildConfigModule(reactContext),
                new VersionCodesModule(reactContext),
                new URLResolverModule(reactContext),
                new GeolocationModule(reactContext, mCurrentActivity),
                new AlertDialogModule(reactContext, mCurrentActivity),
                new ShareModule(reactContext, mCurrentActivity),
                new IntentModule(reactContext, mCurrentActivity)
        );
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.asList();
    }
}
