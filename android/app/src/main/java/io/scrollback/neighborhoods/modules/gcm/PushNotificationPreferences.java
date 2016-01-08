package io.scrollback.neighborhoods.modules.gcm;

import android.content.Context;
import android.content.SharedPreferences;

public class PushNotificationPreferences {

    private static final String STORAGE_KEY = "push_notifications_shared_preferences";

    public static final String REGISTRATION_TOKEN = "registration_token";
    public static final String REGISTRATION_COMPLETE = "registration_complete";

    public static SharedPreferences get(Context context) {
        return context.getSharedPreferences(STORAGE_KEY, Context.MODE_PRIVATE);
    }
}
