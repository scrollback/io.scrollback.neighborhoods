package io.scrollback.neighborhoods;

import android.app.Application;

public class HeyNeighbor extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        FontsOverride.setDefaultFont(this, "DEFAULT", "fonts/Lato-Regular.ttf");
        FontsOverride.setDefaultFont(this, "SANS_SERIF", "fonts/Lato-Regular.ttf");
    }
}
