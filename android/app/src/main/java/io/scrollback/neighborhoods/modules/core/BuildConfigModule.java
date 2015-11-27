package io.scrollback.neighborhoods.modules.core;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Map;

import io.scrollback.neighborhoods.BuildConfig;

public class BuildConfigModule extends ReactContextBaseJavaModule {

    public BuildConfigModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "BuildConfigModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();

        constants.put("APPLICATION_ID", BuildConfig.APPLICATION_ID);
        constants.put("BUILD_TYPE", BuildConfig.BUILD_TYPE);
        constants.put("DEBUG", BuildConfig.DEBUG);
        constants.put("FLAVOR", BuildConfig.FLAVOR);
        constants.put("VERSION_CODE", BuildConfig.VERSION_CODE);
        constants.put("VERSION_NAME", BuildConfig.VERSION_NAME);

        return constants;
    }
}
