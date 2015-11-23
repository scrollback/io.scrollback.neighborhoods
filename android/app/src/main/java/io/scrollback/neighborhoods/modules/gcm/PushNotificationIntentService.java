package io.scrollback.neighborhoods.modules.gcm;

import android.app.IntentService;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.gcm.GoogleCloudMessaging;

public class PushNotificationIntentService extends IntentService {

    private static final String TAG = "GCM";
    private static final int NOTIFICATION_ID = 1;

    public PushNotificationIntentService() {
        super("PushNotificationIntentService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        Bundle extras = intent.getExtras();
        GoogleCloudMessaging gcm = GoogleCloudMessaging.getInstance(this);

        // The getMessageType() intent parameter must be the intent you received
        // in your BroadcastReceiver.
        String messageType = gcm.getMessageType(intent);

        if (!extras.isEmpty()) {
            if (GoogleCloudMessaging.MESSAGE_TYPE_SEND_ERROR.equals(messageType)) {
                Log.e(TAG, "Error in sending message: " + extras.toString());
            } else if (GoogleCloudMessaging.MESSAGE_TYPE_DELETED.equals(messageType)) {
                Log.e(TAG, "Messages deleted on server: " + extras.toString());
            } else if (GoogleCloudMessaging.MESSAGE_TYPE_MESSAGE.equals(messageType)) {
                // If it's a regular GCM message, do some work
                Log.d(TAG, "Payload received: " + extras.toString());

                new PushNotificationHandler(this).handleNotification(NOTIFICATION_ID, HeyNeighborNotification.fromBundle(this, extras));
            }
        }

        // Release the wake lock provided by the WakefulBroadcastReceiver.
        PushNotificationBroadcastReceiver.completeWakefulIntent(intent);
    }

}
