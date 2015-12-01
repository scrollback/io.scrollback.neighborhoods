package io.scrollback.neighborhoods;

import android.app.Application;

import com.crashlytics.android.Crashlytics;

import io.fabric.sdk.android.Fabric;
import io.scrollback.neighborhoods.modules.analytics.LifeCycleTracker;

public class HeyNeighbor extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        Fabric.with(this, new Crashlytics());

        AppState.init(this);
        LifeCycleTracker.init(this);
    }
}
