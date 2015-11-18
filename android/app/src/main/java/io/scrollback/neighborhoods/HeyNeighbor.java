package io.scrollback.neighborhoods;

import android.app.Application;

import com.crashlytics.android.Crashlytics;

import io.fabric.sdk.android.Fabric;

public class HeyNeighbor extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        Fabric.with(this, new Crashlytics());

        AppState.init(this);

        FontsOverride.setDefaultFont(this, "DEFAULT", "Fonts/Lato-Regular.ttf");
        FontsOverride.setDefaultFont(this, "SANS_SERIF", "Fonts/Lato-Regular.ttf");
    }
}
