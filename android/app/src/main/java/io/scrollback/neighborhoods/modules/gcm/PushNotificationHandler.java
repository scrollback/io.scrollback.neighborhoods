package io.scrollback.neighborhoods.modules.gcm;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;

import io.scrollback.neighborhoods.AppState;
import io.scrollback.neighborhoods.MainActivity;
import io.scrollback.neighborhoods.R;

public class PushNotificationHandler {

    private static final String TAG = "PushNotificationHandler";

    private Context mContext;

    PushNotificationHandler(Context c) {
        mContext = c;
    }

    public void handleNotification(int id, HeyNeighborNotification note) {
        // If Push Notifications are disabled, do nothing
        if (mContext.getSharedPreferences(PushNotificationModule.STORAGE_KEY, 0).getString("enabled", "").equals("false")) {
            Log.d(TAG, "Push notifications are disabled");

            return;
        }

        // If app is in foreground, do nothing
        if (AppState.isForeground()) {
            Log.d(TAG, "Application is in foreground");

            return;
        }

        Log.d(TAG, "Presenting notification");

        NotificationManager mNotificationManager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);

        Intent i = new Intent(mContext, MainActivity.class);

        i.setAction(Intent.ACTION_VIEW);

        String path = note.getPath();

        if (path != null) {
            i.setData(Uri.parse(path));
        }

        PendingIntent contentIntent = PendingIntent.getActivity(mContext, 0, i, PendingIntent.FLAG_CANCEL_CURRENT);

        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(mContext)
                        .setSmallIcon(R.mipmap.ic_status)
                        .setColor(ContextCompat.getColor(mContext, R.color.primary))
                        .setContentTitle(note.getTitle())
                        .setGroup(note.getGroup())
                        .setContentText(note.getText())
                        .setStyle(new NotificationCompat.BigTextStyle())
                        .setPriority(NotificationCompat.PRIORITY_HIGH)
                        .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                        .setGroupSummary(true)
                        .setAutoCancel(true);

        Bitmap largeIcon = note.getBitmap(mContext.getString(R.string.app_protocol), mContext.getString(R.string.app_host));

        if (largeIcon != null) {
            mBuilder.setLargeIcon(largeIcon);
        }

        mBuilder.setContentIntent(contentIntent);

        mNotificationManager.notify(id, mBuilder.build());
    }
}
