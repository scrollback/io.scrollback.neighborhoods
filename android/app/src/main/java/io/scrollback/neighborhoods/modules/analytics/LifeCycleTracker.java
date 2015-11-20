package io.scrollback.neighborhoods.modules.analytics;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;

import java.util.Date;

public class LifeCycleTracker implements Application.ActivityLifecycleCallbacks {

    private final static String EVENT_NAME = "App Usage";

    private static LifeCycleTracker instance;
    private Date startTime;

    public static void init(Application app) {
        if (instance == null) {
            instance = new LifeCycleTracker();

            app.registerActivityLifecycleCallbacks(instance);
        }
    }

    @Override
    public void onActivityPaused(Activity activity) {
        Trackers.logTiming(EVENT_NAME, startTime, new Date());
    }

    @Override
    public void onActivityResumed(Activity activity) {
        startTime = new Date();
    }

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
    }

    @Override
    public void onActivityStarted(Activity activity) {
    }

    @Override
    public void onActivityStopped(Activity activity) {
    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
    }

    @Override
    public void onActivityDestroyed(Activity activity) {
    }
}
