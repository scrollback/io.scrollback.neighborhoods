package io.scrollback.neighborhoods;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;

class AppState implements Application.ActivityLifecycleCallbacks {

    private static AppState instance;

    public static void init(Application app){
        if (instance == null){
            instance = new AppState();

            app.registerActivityLifecycleCallbacks(instance);
        }
    }

    private static boolean foreground;

    public static boolean isForeground(){
        return foreground;
    }

    @Override
    public void onActivityPaused(Activity activity){
        foreground = false;
    }

    @Override
    public void onActivityResumed(Activity activity){
        foreground = true;
    }

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {}

    @Override
    public void onActivityStarted(Activity activity) {}

    @Override
    public void onActivityStopped(Activity activity) {}

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {}

    @Override
    public void onActivityDestroyed(Activity activity) {}
}