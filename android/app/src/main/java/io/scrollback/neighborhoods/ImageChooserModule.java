package io.scrollback.neighborhoods;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.v4.content.CursorLoader;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;


public class ImageChooserModule extends ReactContextBaseJavaModule {

    public final int PICK_IMAGE = 3500;

    private final String CALLBACK_TYPE_SUCCESS = "success";
    private final String CALLBACK_TYPE_ERROR = "error";
    private final String CALLBACK_TYPE_CANCEL = "cancel";

    private Context mActivityContext;
    private Callback mPickerCallback;

    public ImageChooserModule(ReactApplicationContext reactContext, Context activityContext) {
        super(reactContext);

        mActivityContext = activityContext;
    }

    @Override
    public String getName() {
        return "ImageChooserModule";
    }

    private void consumeCallback(String type, WritableMap map) {
        if (mPickerCallback != null) {
            map.putString("type", type);

            mPickerCallback.invoke(map);
            mPickerCallback = null;
        }
    }

    private String getPathFromUri(Uri contentUri) {
        if (!contentUri.getScheme().equals("content")) {
            return contentUri.getPath();
        }

        String[] projection = {MediaStore.Images.Media.DATA};

        CursorLoader loader = new CursorLoader(mActivityContext, contentUri, projection, null, null, null);
        Cursor cursor = loader.loadInBackground();

        int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);

        cursor.moveToFirst();

        String result = cursor.getString(column_index);

        cursor.close();

        return result;
    }

    private String getNameFromUri(Uri contentUri) {
        if (!contentUri.getScheme().equals("content")) {
            return contentUri.getLastPathSegment();
        }

        String[] projection = {MediaStore.MediaColumns.DISPLAY_NAME};

        Cursor metaCursor = mActivityContext.getContentResolver().query(contentUri, projection, null, null, null);

        if (metaCursor != null) {
            try {
                if (metaCursor.moveToFirst()) {
                    return metaCursor.getString(0);
                }
            } finally {
                metaCursor.close();
            }
        }

        return contentUri.getLastPathSegment();
    }

    @ReactMethod
    public void pickImage(final Callback callback) {
        final Intent galleryIntent = new Intent(Intent.ACTION_PICK);

        galleryIntent.setType("image/*");

        final Intent chooserIntent = Intent.createChooser(galleryIntent, "Pick an image");

        ((Activity) mActivityContext).startActivityForResult(chooserIntent, PICK_IMAGE);

        mPickerCallback = callback;
    }

    public boolean handleActivityResult(final int requestCode, final int resultCode, final Intent intent) {
        if (requestCode == PICK_IMAGE) {
            if (mPickerCallback != null) {
                WritableMap map = Arguments.createMap();

                if (resultCode == Activity.RESULT_CANCELED) {
                    consumeCallback(CALLBACK_TYPE_CANCEL, map);
                } else if (resultCode == Activity.RESULT_OK) {
                    Uri uri = intent.getData();

                    if (uri != null) {
                        BitmapFactory.Options options = new BitmapFactory.Options();

                        options.inJustDecodeBounds = true;

                        BitmapFactory.decodeFile(getPathFromUri(uri), options);

                        map.putInt("height", options.outHeight);
                        map.putInt("width", options.outWidth);
                        map.putString("uri", uri.toString());
                        map.putString("name", getNameFromUri(uri));

                        consumeCallback(CALLBACK_TYPE_SUCCESS, map);
                    } else {
                        consumeCallback(CALLBACK_TYPE_ERROR, map);
                    }
                }
            }

            return true;
        }

        return false;
    }
}
