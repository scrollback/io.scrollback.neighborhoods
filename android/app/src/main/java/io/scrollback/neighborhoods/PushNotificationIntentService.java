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
import android.text.Spannable;
import android.text.SpannableString;
import android.text.style.StyleSpan;
import android.util.Log;

import com.google.android.gms.gcm.GoogleCloudMessaging;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;

public class PushNotificationIntentService extends IntentService {

    private ArrayList<Notification> pendingNotifications = new ArrayList<>();

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
                Log.d(TAG, "Payload received: " + extras.toString());

                // If Push Notifications are disabled, do nothing
                if (getSharedPreferences(PushNotificationModule.STORAGE_KEY, 0).getString("enabled", "").equals("false")) {
                    Log.d(TAG, "Push notifications are disabled");

                    return;
                }

                // If app is in foreground, do nothing
                if (AppState.isForeground()) {
                    Log.d(TAG, "Application is in foreground");

                    return;
                }

                Notification note = new Notification(getBaseContext());

                note.setTitle(extras.getString("title"));
                note.setText(extras.getString("text"));
                note.setPath(extras.getString("path"));
                note.setGroup(extras.getString("group"));
                note.setPicture(extras.getString("picture"));

                sendNotification(note);
            }
        }

        // Release the wake lock provided by the WakefulBroadcastReceiver.
        PushNotificationBroadcastReceiver.completeWakefulIntent(intent);
    }

    private SpannableString buildTicker(Notification note) {
        String title = note.getTitle();

        SpannableString sb = new SpannableString(title + " " + note.getText());

        sb.setSpan(new StyleSpan(android.graphics.Typeface.BOLD), 0, title.length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

        return sb;
    }

    public void sendNotification(Notification note) {
        NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        Log.d(Constants.TAG, "Sending notification");

        Intent i = new Intent(this, MainActivity.class);

        i.setAction(Intent.ACTION_VIEW);

        String path = note.getPath();

        if (path != null) {
            i.setData(Uri.parse(path));
        }

        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, i, PendingIntent.FLAG_CANCEL_CURRENT);

        ArrayList<Notification> currentNotifications = new ArrayList<>();

        // Ignore previous notifications with same group key
        for (Notification n : pendingNotifications) {
            if (n.getGroup().equals(note.getGroup())) {
                continue;
            }

            currentNotifications.add(0, n);
        }

        currentNotifications.add(note);

        pendingNotifications = currentNotifications;

        NotificationCompat.Style noteStyle;

        if (pendingNotifications.size() > 1) {
            NotificationCompat.InboxStyle style = new NotificationCompat.InboxStyle()
                    .setBigContentTitle(pendingNotifications.size() + " new notifications")
                    .setSummaryText(getString(R.string.app_name));

            for (Notification n : pendingNotifications) {
                style.addLine(buildTicker(n));
            }

            noteStyle = style;
        } else {
            noteStyle = new NotificationCompat.BigTextStyle();
        }

        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(this)
                        .setSmallIcon(R.mipmap.ic_status)
                        .setColor(ContextCompat.getColor(this, R.color.primary))
                        .setNumber(pendingNotifications.size())
                        .setTicker(buildTicker(note))
                        .setContentTitle(note.getTitle())
                        .setGroup(note.getGroup())
                        .setContentText(note.getText())
                        .setStyle(noteStyle)
                        .setPriority(NotificationCompat.PRIORITY_HIGH)
                        .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                        .setGroupSummary(true)
                        .setAutoCancel(true);

        Bitmap largeIcon = note.getBitmap(getString(R.string.app_protocol), getString(R.string.app_host));

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
        private String group;
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

        public void setGroup(String group) {
            this.group = group;
        }

        public String getGroup() {
            return group;
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
                Log.e(TAG, "Malformed URL: " + picture, e);
            }

            if (url != null) {
                try {
                    return BitmapFactory.decodeStream(url.openConnection().getInputStream());
                } catch (IOException e) {
                    Log.e(TAG, "Couldn't fetch image: " + picture, e);
                }
            }

            return null;
        }

        public Bitmap getBitmap(String protocol, String host) {
            final int ICON_SIZE = (int) (48 * (mContext.getResources().getDisplayMetrics().density));

            Bitmap bitmap = getOriginalBitmap(protocol, host);

            if (bitmap != null) {
                bitmap = Bitmap.createScaledBitmap(bitmap, ICON_SIZE, ICON_SIZE, false);

                Bitmap output = Bitmap.createBitmap(ICON_SIZE, ICON_SIZE, Bitmap.Config.ARGB_8888);

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
