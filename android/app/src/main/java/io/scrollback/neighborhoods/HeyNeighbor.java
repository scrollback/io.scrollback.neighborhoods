package io.scrollback.neighborhoods;

import android.app.Application;

public class HeyNeighbor extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        FontsOverride.setDefaultFont(this, "DEFAULT", "Fonts/Lato-Regular.ttf");
        FontsOverride.setDefaultFont(this, "SANS_SERIF", "Fonts/Lato-Regular.ttf");
    }
}
