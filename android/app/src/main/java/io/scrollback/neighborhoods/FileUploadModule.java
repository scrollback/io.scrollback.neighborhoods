package io.scrollback.neighborhoods;

import android.net.Uri;
import android.os.AsyncTask;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySeyIterator;
import com.facebook.react.bridge.WritableMap;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.MultipartBuilder;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;
import com.squareup.okhttp.internal.Util;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import okio.BufferedSink;
import okio.Okio;
import okio.Source;

public class FileUploadModule extends ReactContextBaseJavaModule {

    private final String CALLBACK_TYPE_SUCCESS = "success";
    private final String CALLBACK_TYPE_ERROR = "error";
    private final String OKHTTP_REQUEST_TAG = "file_upload";

    private Map<Integer, OkHttpClient> mCurrentUploads = new HashMap<>();
    private ReactApplicationContext mReactContext;

    public FileUploadModule(ReactApplicationContext reactContext) {
        super(reactContext);

        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "FileUploadModule";
    }

    private static class RequestBodyUtil {
        public static RequestBody create(final MediaType mediaType, final InputStream inputStream) {
            return new RequestBody() {
                @Override
                public MediaType contentType() {
                    return mediaType;
                }

                @Override
                public long contentLength() {
                    try {
                        return inputStream.available();
                    } catch (IOException e) {
                        return 0;
                    }
                }

                @Override
                public void writeTo(BufferedSink sink) throws IOException {
                    Source source = null;
                    try {
                        source = Okio.source(inputStream);
                        sink.writeAll(source);
                    } finally {
                        Util.closeQuietly(source);
                    }
                }
            };
        }
    }

    @ReactMethod
    public void uploadFile(final int id, final String baseUrl, final String uriString, final ReadableMap formData, final Callback callback) {
        final WritableMap map = Arguments.createMap();
        final OkHttpClient client = new OkHttpClient();

        map.putInt("id", id);
        mCurrentUploads.put(id, client);

        AsyncTask.execute(new Runnable() {
            @Override
            public void run() {
                Uri uri = Uri.parse(uriString);
                MediaType mediaType = MediaType.parse(MimeTypes.get(uriString.substring(uriString.lastIndexOf(".") + 1)) + "; charset=utf-8");

                try {
                    InputStream inputStream = mReactContext.getContentResolver().openInputStream(uri);

                    MultipartBuilder builder = new MultipartBuilder()
                            .type(MultipartBuilder.FORM)
                            .addPart(RequestBodyUtil.create(mediaType, inputStream));

                    ReadableMapKeySeyIterator it = formData.keySetIterator();

                    while (it.hasNextKey()) {
                        String key = it.nextKey();

                        builder.addFormDataPart(key, formData.getString(key));
                    }

                    Request request = new Request.Builder()
                            .tag(OKHTTP_REQUEST_TAG)
                            .url(baseUrl)
                            .post(builder.build())
                            .build();

                    Response response = client.newCall(request).execute();

                    if (response.isSuccessful()) {
                        map.putString("type", CALLBACK_TYPE_SUCCESS);

                        callback.invoke(map);
                    } else {
                        throw new IOException("Unexpected response code " + response);
                    }
                } catch (Exception e) {
                    map.putString("type", CALLBACK_TYPE_ERROR);
                    map.putString("message", e.getMessage());

                    callback.invoke(map);
                }

                mCurrentUploads.remove(id);
            }
        });
    }

    @ReactMethod
    public void cancelUpload(final int id) {
        OkHttpClient client = mCurrentUploads.get(id);

        if (client != null) {
            client.cancel(OKHTTP_REQUEST_TAG);
        }
    }
}
