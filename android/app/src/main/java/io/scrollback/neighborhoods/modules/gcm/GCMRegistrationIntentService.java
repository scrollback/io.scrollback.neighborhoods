package io.scrollback.neighborhoods.modules.gcm;

import android.app.IntentService;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.google.android.gms.gcm.GcmPubSub;
import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;

import java.io.IOException;

import io.scrollback.neighborhoods.R;

public class GCMRegistrationIntentService extends IntentService {

    private static final String TAG = "IntentService";
    private static final String[] TOPICS = {"global"};

    public GCMRegistrationIntentService() {
        super(GCMRegistrationIntentService.class.getName());
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        SharedPreferences sharedPreferences = PushNotificationPreferences.get(this);

        try {
            InstanceID instanceID = InstanceID.getInstance(this);
            String token = instanceID.getToken(getString(R.string.gcm_defaultSenderId),
                    GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);

            Log.i(TAG, "GCM Registration Token: " + token);

            subscribeTopics(token);

            sharedPreferences.edit().putString(PushNotificationPreferences.REGISTRATION_TOKEN, token).apply();
        } catch (Exception e) {
            Log.d(TAG, "Failed to complete token refresh", e);
        }

        Intent registrationComplete = new Intent(PushNotificationPreferences.REGISTRATION_COMPLETE);
        LocalBroadcastManager.getInstance(this).sendBroadcast(registrationComplete);
    }

    private void subscribeTopics(String token) throws IOException {
        GcmPubSub pubSub = GcmPubSub.getInstance(this);

        for (String topic : TOPICS) {
            pubSub.subscribe(token, "/topics/" + topic, null);
        }
    }
}
