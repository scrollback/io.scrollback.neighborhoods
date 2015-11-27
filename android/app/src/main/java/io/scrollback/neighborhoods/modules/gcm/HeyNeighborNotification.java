package io.scrollback.neighborhoods.modules.gcm;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.os.Bundle;
import android.util.Log;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

import io.scrollback.neighborhoods.R;

public class HeyNeighborNotification {

    private static final String TAG = "HeyNeighborNotification";

    private final Context mContext;

    private String mTitle;
    private String mText;
    private String mPath;
    private String mGroup;
    private String mPicture;

    HeyNeighborNotification(Context c) {
        mContext = c;
    }

    public static HeyNeighborNotification fromBundle(Context c, Bundle extras) {
        HeyNeighborNotification note = new HeyNeighborNotification(c);

        note.setTitle(extras.getString("title"));
        note.setText(extras.getString("text"));
        note.setPath(extras.getString("path"));
        note.setGroup(extras.getString("group"));
        note.setPicture(extras.getString("picture"));

        return note;
    }

    public String getTitle() {
        return mTitle;
    }

    public void setTitle(String title) {
        mTitle = title;
    }

    public String getText() {
        return mText;
    }

    public void setText(String text) {
        mText = text;
    }

    public String getPath() {
        return mPath;
    }

    public void setPath(String path) {
        mPath = path;
    }

    public String getGroup() {
        return mGroup;
    }

    public void setGroup(String group) {
        mGroup = group;
    }

    public void setPicture(String picture) {
        mPicture = picture;
    }

    private Bitmap decodeStreamToBitmap(InputStream stream, int imageSize) {
        final BufferedInputStream is = new BufferedInputStream(stream, 32 * 1024);

        try {
            final BitmapFactory.Options decodeBitmapOptions = new BitmapFactory.Options();

            // For further memory savings, you may want to consider using this option
            // decodeBitmapOptions.inPreferredConfig = Config.RGB_565; // Uses 2-bytes instead of default 4 per pixel
            if (imageSize > 0) {
                final BitmapFactory.Options decodeBoundsOptions = new BitmapFactory.Options();

                decodeBoundsOptions.inJustDecodeBounds = true;

                is.mark(32 * 1024);

                BitmapFactory.decodeStream(is, null, decodeBoundsOptions);

                is.reset();

                final int originalWidth = decodeBoundsOptions.outWidth;
                final int originalHeight = decodeBoundsOptions.outHeight;

                // inSampleSize prefers multiples of 2, but we prefer to prioritize memory savings
                decodeBitmapOptions.inSampleSize = Math.max(1, Math.min(originalWidth / imageSize, originalHeight / imageSize));
            }

            return BitmapFactory.decodeStream(is, null, decodeBitmapOptions);

        } catch (IOException e) {
            Log.e(TAG, "Failed to decode stream to bitmap", e);
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                // Ignore
            }
        }

        return null;
    }

    private Bitmap getScaledBitmap(String protocol, String host, int imageSize) {
        URL url = null;

        if (protocol == null) {
            protocol = mContext.getString(R.string.app_protocol);
        }

        if (host == null) {
            host = mContext.getString(R.string.app_host);
        }

        try {
            url = new URL(protocol + "//" + host + mPicture);
        } catch (MalformedURLException e) {
            Log.e(TAG, "Malformed URL: " + mPicture, e);
        }

        if (url != null) {
            try {
                return decodeStreamToBitmap(url.openConnection().getInputStream(), imageSize);
            } catch (IOException e) {
                Log.e(TAG, "Couldn't fetch image: " + mPicture, e);
            }
        }

        return null;
    }

    public Bitmap getBitmap(String protocol, String host) {
        final int IMAGE_SIZE = (int) (48 * (mContext.getResources().getDisplayMetrics().density));

        Bitmap bitmap = getScaledBitmap(protocol, host, IMAGE_SIZE);

        if (bitmap != null) {
            Bitmap output = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), Bitmap.Config.ARGB_8888);

            if (output == null) {
                return null;
            }

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

