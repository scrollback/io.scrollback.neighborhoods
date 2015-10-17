package io.scrollback.neighborhoods;

import android.app.IntentService;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;

import com.google.android.gms.gcm.GoogleCloudMessaging;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

public class PushNotificationIntentService extends IntentService {

    public static final int NOTIFICATION_ID = 1;
    private static final String TAG = "GCM";

    public PushNotificationIntentService() {
        super("PushNotificationIntentService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        // If app is in foreground, do nothing
        if (AppState.isForeground()) {
            return;
        }

        Bundle extras = intent.getExtras();
        GoogleCloudMessaging gcm = GoogleCloudMessaging.getInstance(this);

        // The getMessageType() intent parameter must be the intent you received
        // in your BroadcastReceiver.
        String messageType = gcm.getMessageType(intent);

        if (!extras.isEmpty()) {  // has effect of unparcelling Bundle
            /*
             * Filter messages based on message type. Since it is likely that GCM
             * will be extended in the future with new message types, just ignore
             * any message types you're not interested in, or that you don't
             * recognize.
             */
            if (GoogleCloudMessaging.MESSAGE_TYPE_SEND_ERROR.equals(messageType)) {
                Log.e(TAG, "Error in sending message: " + extras.toString());
            } else if (GoogleCloudMessaging.MESSAGE_TYPE_DELETED.equals(messageType)) {
                Log.e(TAG, "Messages deleted on server: " + extras.toString());
            } else if (GoogleCloudMessaging.MESSAGE_TYPE_MESSAGE.equals(messageType)) {
                // If it's a regular GCM message, do some work
                Log.d(TAG, "payload: " + extras.toString());
                Log.d(TAG, "title: " + extras.getString("title"));
                Log.d(TAG, "subtitle: " + extras.getString("text"));
                Log.d(TAG, "path: " + extras.getString("path"));
                Log.d(TAG, "picture: " + extras.getString("picture"));

                Notification notif = new Notification(getBaseContext());

                notif.setTitle(extras.getString("title"));
                notif.setText(extras.getString("text"));
                notif.setPath(extras.getString("path"));
                notif.setPicture(extras.getString("picture"));

                sendNotification(notif);
            }
        }

        // Release the wake lock provided by the WakefulBroadcastReceiver.
        PushNotificationBroadcastReceiver.completeWakefulIntent(intent);
    }

    public void sendNotification(Notification n) {
        NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        Log.d(Constants.TAG, "Sending notification");

        Intent i = new Intent(this, MainActivity.class);

        i.setAction(Intent.ACTION_VIEW);

        String path = n.getPath();

        if (path != null) {
            i.setData(Uri.parse(path));
        }

        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, i, PendingIntent.FLAG_CANCEL_CURRENT);

        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(this)
                        .setSmallIcon(R.mipmap.ic_status)
                        .setColor(ContextCompat.getColor(this, R.color.primary))
                        .setTicker(n.getTitle())
                        .setContentTitle(n.getTitle())
                        .setStyle(new NotificationCompat.BigTextStyle().bigText(n.getText()))
                        .setContentText(n.getText())
                        .setPriority(NotificationCompat.PRIORITY_HIGH)
                        .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                        .setAutoCancel(true);

        Bitmap largeIcon = n.getBitmap(getString(R.string.app_protocol), getString(R.string.app_host));

        if (largeIcon != null) {
            mBuilder.setLargeIcon(largeIcon);
        }

        mBuilder.setContentIntent(contentIntent);

        mNotificationManager.notify(NOTIFICATION_ID, mBuilder.build());
    }

    private static class Notification {

        private final Context mContext;

        private String title;
        private String text;
        private String path;
        private String picture;

        Notification(Context c) {
            mContext = c;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public String getPicture() {
            return picture;
        }

        public void setPicture(String picture) {
            this.picture = picture;
        }

        public Bitmap getOriginalBitmap(String protocol, String host) {
            URL url = null;

            if (protocol == null) {
                protocol = mContext.getString(R.string.app_protocol);
            }

            if (host == null) {
                host = mContext.getString(R.string.app_host);
            }

            try {
                url = new URL(protocol + "//" + host + picture);
            } catch (MalformedURLException e) {
                Log.e(TAG, "Malformed URL " + picture, e);
            }

            if (url != null) {
                try {
                    return BitmapFactory.decodeStream(url.openConnection().getInputStream());
                } catch (IOException e) {
                    Log.e(TAG, "Couldn't fetch image from " + picture, e);
                }
            }

            return null;
        }

        public Bitmap getBitmap(String protocol, String host) {
            Bitmap bitmap = getOriginalBitmap(protocol, host);

            if (bitmap != null) {
                Bitmap output = Bitmap.createBitmap(bitmap.getWidth(),
                        bitmap.getHeight(), Bitmap.Config.ARGB_8888);

                Canvas canvas = new Canvas(output);

                final Paint paint = new Paint();
                final Rect rect = new Rect(0, 0, bitmap.getWidth(),
                        bitmap.getHeight());

                paint.setAntiAlias(true);

                canvas.drawARGB(0, 0, 0, 0);
                canvas.drawCircle(bitmap.getWidth() / 2, bitmap.getHeight() / 2,
                        bitmap.getWidth() / 2, paint);

                paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));

                canvas.drawBitmap(bitmap, rect, rect, paint);

                return output;
            }

            return null;
        }
    }
}
