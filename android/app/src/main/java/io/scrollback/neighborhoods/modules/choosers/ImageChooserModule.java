package io.scrollback.neighborhoods.modules.choosers;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.support.v4.content.CursorLoader;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.File;


public class ImageChooserModule extends ReactContextBaseJavaModule {

    private static final int PICK_IMAGE = 3500;

    private Context mActivityContext;
    private Promise mPickerPromise;

    public ImageChooserModule(ReactApplicationContext reactContext, Context activityContext) {
        super(reactContext);

        mActivityContext = activityContext;
    }

    @Override
    public String getName() {
        return "ImageChooserModule";
    }

    private void resolvePromise(WritableMap map) {
        if (mPickerPromise != null) {
            mPickerPromise.resolve(map);
            mPickerPromise = null;
        }
    }

    private void rejectPromise(String reason) {
        if (mPickerPromise != null) {
            mPickerPromise.reject(reason);
            mPickerPromise = null;
        }
    }

    private String getPathFromUri(Uri contentUri) {
        if (contentUri.getScheme().equals("file")) {
            return contentUri.getPath();
        }

        String[] projection = {MediaStore.Images.Media.DATA};

        CursorLoader loader = new CursorLoader(mActivityContext, contentUri, projection, null, null, null);
        Cursor cursor = loader.loadInBackground();

        try {
            int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);

            cursor.moveToFirst();

            return cursor.getString(column_index);
        } catch (RuntimeException e) {
            return null;
        } finally {
            cursor.close();
        }
    }

    private String getNameFromUri(Uri contentUri) {
        if (contentUri.getScheme().equals("file")) {
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

    private long getSizeFromUri(Uri contentUri) {
        if (contentUri.getScheme().equals("file")) {
            return new File(contentUri.getPath()).length();
        }

        Cursor cursor = mActivityContext.getContentResolver().query(contentUri, null, null, null, null);

        if (cursor != null) {
            cursor.moveToFirst();

            long size = cursor.getLong(cursor.getColumnIndex(OpenableColumns.SIZE));

            cursor.close();

            return size;
        }

        return 0;
    }

    @ReactMethod
    public void pickImage(final Promise promise) {
        final Intent galleryIntent = new Intent(Intent.ACTION_PICK);

        galleryIntent.setType("image/*");

        final Intent chooserIntent = Intent.createChooser(galleryIntent, "Pick an image");

        ((Activity) mActivityContext).startActivityForResult(chooserIntent, PICK_IMAGE);

        mPickerPromise = promise;
    }

    public boolean handleActivityResult(final int requestCode, final int resultCode, final Intent intent) {
        if (requestCode == PICK_IMAGE) {
            if (mPickerPromise != null) {
                if (resultCode == Activity.RESULT_CANCELED) {
                    rejectPromise("Image picker was cancelled");
                } else if (resultCode == Activity.RESULT_OK) {
                    Uri uri = intent.getData();

                    if (uri != null) {
                        BitmapFactory.Options options = new BitmapFactory.Options();

                        options.inJustDecodeBounds = true;

                        String path = getPathFromUri(uri);

                        if (path != null) {
                            BitmapFactory.decodeFile(path, options);

                            WritableMap map = Arguments.createMap();

                            map.putInt("height", options.outHeight);
                            map.putInt("width", options.outWidth);
                            map.putDouble("size", getSizeFromUri(uri));
                            map.putString("name", getNameFromUri(uri));
                            map.putString("uri", uri.toString());

                            resolvePromise(map);
                        } else {
                            rejectPromise("Failed resolve image path");
                        }
                    } else {
                        rejectPromise("Failed to pick image");
                    }
                }
            }

            return true;
        }

        return false;
    }
}
