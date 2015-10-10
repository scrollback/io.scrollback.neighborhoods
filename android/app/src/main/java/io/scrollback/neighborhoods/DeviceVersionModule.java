package io.scrollback.neighborhoods;

import android.os.Build;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Map;

public class DeviceVersionModule extends ReactContextBaseJavaModule {

    public DeviceVersionModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "DeviceVersionModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();

        constants.put("VERSION_CODENAME", Build.VERSION.CODENAME);
        constants.put("VERSION_RELEASE", Build.VERSION.RELEASE);
        constants.put("VERSION_SDK_INT", Build.VERSION.SDK_INT);
        constants.put("VERSION_CODES_KITKAT", Build.VERSION_CODES.KITKAT);

        return constants;
    }
}
