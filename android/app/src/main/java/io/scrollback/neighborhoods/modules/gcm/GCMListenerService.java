package io.scrollback.neighborhoods.modules.gcm;

import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.gcm.GcmListenerService;

public class GCMListenerService extends GcmListenerService {

    private static final String TAG = "GCM";
    private static final int NOTIFICATION_ID = 0;

    @Override
    public void onMessageReceived(String from, Bundle data) {
        String message = data.getString("message");

        Log.d(TAG, "From: " + from);
        Log.d(TAG, "Message: " + message);

        PushNotificationHandler.send(this, NOTIFICATION_ID, HeyNeighborNotification.fromBundle(this, data));
    }
}
