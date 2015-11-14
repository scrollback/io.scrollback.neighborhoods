package io.scrollback.neighborhoods.modules.core;

import android.os.Build;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Map;

public class VersionCodesModule extends ReactContextBaseJavaModule {

    public VersionCodesModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "VersionCodesModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();

        constants.put("BASE", Build.VERSION_CODES.BASE);
        constants.put("BASE_1_1", Build.VERSION_CODES.BASE_1_1);
        constants.put("CUPCAKE", Build.VERSION_CODES.CUPCAKE);
        constants.put("CUR_DEVELOPMENT", Build.VERSION_CODES.CUR_DEVELOPMENT);
        constants.put("DONUT", Build.VERSION_CODES.DONUT);
        constants.put("ECLAIR", Build.VERSION_CODES.ECLAIR);
        constants.put("ECLAIR_0_1", Build.VERSION_CODES.ECLAIR_0_1);
        constants.put("ECLAIR_MR1", Build.VERSION_CODES.ECLAIR_MR1);
        constants.put("FROYO", Build.VERSION_CODES.FROYO);
        constants.put("GINGERBREAD", Build.VERSION_CODES.GINGERBREAD);
        constants.put("GINGERBREAD_MR1", Build.VERSION_CODES.GINGERBREAD_MR1);
        constants.put("HONEYCOMB", Build.VERSION_CODES.HONEYCOMB);
        constants.put("HONEYCOMB_MR1", Build.VERSION_CODES.HONEYCOMB_MR1);
        constants.put("HONEYCOMB_MR2", Build.VERSION_CODES.HONEYCOMB_MR2);
        constants.put("ICE_CREAM_SANDWICH", Build.VERSION_CODES.ICE_CREAM_SANDWICH);
        constants.put("ICE_CREAM_SANDWICH_MR1", Build.VERSION_CODES.ICE_CREAM_SANDWICH_MR1);
        constants.put("JELLY_BEAN", Build.VERSION_CODES.JELLY_BEAN);
        constants.put("JELLY_BEAN_MR1", Build.VERSION_CODES.JELLY_BEAN_MR1);
        constants.put("JELLY_BEAN_MR2", Build.VERSION_CODES.JELLY_BEAN_MR2);
        constants.put("KITKAT", Build.VERSION_CODES.KITKAT);
        constants.put("KITKAT_WATCH", Build.VERSION_CODES.KITKAT_WATCH);
        constants.put("LOLLIPOP", Build.VERSION_CODES.LOLLIPOP);
        constants.put("LOLLIPOP_MR1", Build.VERSION_CODES.LOLLIPOP_MR1);
        constants.put("M", Build.VERSION_CODES.M);

        return constants;
    }
}
