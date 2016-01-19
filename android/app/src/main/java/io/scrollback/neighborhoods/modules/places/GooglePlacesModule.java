package io.scrollback.neighborhoods.modules.places;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.common.GooglePlayServicesNotAvailableException;
import com.google.android.gms.common.GooglePlayServicesRepairableException;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.places.Place;
import com.google.android.gms.location.places.Places;
import com.google.android.gms.location.places.ui.PlaceAutocomplete;
import com.google.android.gms.maps.model.LatLng;

import java.util.List;
import java.util.Locale;


public class GooglePlacesModule extends ReactContextBaseJavaModule implements ActivityEventListener, LifecycleEventListener {

    private static final String ACTIVITY_DOES_NOT_EXIST_ERROR = "Activity doesn't exist";
    private static final String GOOGLE_API_NOT_INITIALIZED_ERROR = "Google API client not initialized";
    private static final String PICKER_CANCELLED_ERROR = "Places picker was cancelled";

    private static final int PLACE_AUTOCOMPLETE_REQUEST_CODE = 1090;

    private Promise mRetrievePromise;
    private GoogleApiClient mGoogleApiClient;

    public GooglePlacesModule(ReactApplicationContext reactContext) {
        super(reactContext);

        reactContext.addActivityEventListener(this);
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return "GooglePlacesModule";
    }

    private void resolvePromise(WritableMap map) {
        if (mRetrievePromise != null) {
            mRetrievePromise.resolve(map);
            mRetrievePromise = null;
        }
    }

    private void rejectPromise(Exception reason) {
        if (mRetrievePromise != null) {
            mRetrievePromise.reject(reason);
            mRetrievePromise = null;
        }
    }

    private void rejectPromise(String reason) {
        if (mRetrievePromise != null) {
            mRetrievePromise.reject(reason);
            mRetrievePromise = null;
        }
    }

    @ReactMethod
    public void findPlace(final Promise promise) {
        if (mGoogleApiClient == null) {
            promise.reject(GOOGLE_API_NOT_INITIALIZED_ERROR);
            return;
        }

        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject(ACTIVITY_DOES_NOT_EXIST_ERROR);
            return;
        }

        mRetrievePromise = promise;

        try {
            Intent intent =
                    new PlaceAutocomplete.IntentBuilder(PlaceAutocomplete.MODE_OVERLAY)
                            .build(currentActivity);

            currentActivity.startActivityForResult(intent, PLACE_AUTOCOMPLETE_REQUEST_CODE);
        } catch (GooglePlayServicesRepairableException | GooglePlayServicesNotAvailableException e) {
            rejectPromise(e);
        }
    }

    private WritableMap buildPlacesMap(Place place) {
        CharSequence address = place.getAddress();
        CharSequence attributions = place.getAttributions();
        CharSequence name = place.getName();
        CharSequence phoneNumber = place.getPhoneNumber();
        Locale locale = place.getLocale();
        Uri websiteUri = place.getWebsiteUri();

        WritableMap map = Arguments.createMap();

        if (address != null) {
            map.putString("address", address.toString());
        }

        if (attributions != null) {
            map.putString("attributions", attributions.toString());
        }

        if (name != null) {
            map.putString("name", name.toString());
        }

        if (phoneNumber != null) {
            map.putString("phoneNumber", phoneNumber.toString());
        }

        if (locale != null) {
            map.putString("locale", locale.toString());
        }

        if (websiteUri != null) {
            map.putString("websiteUrl", websiteUri.toString());
        }

        map.putString("id", place.getId());
        map.putInt("priceLevel", place.getPriceLevel());
        map.putDouble("rating", place.getRating());

        WritableMap latLngMap = Arguments.createMap();
        LatLng latLng = place.getLatLng();

        latLngMap.putDouble("latitude", latLng.latitude);
        latLngMap.putDouble("longitude", latLng.longitude);

        map.putMap("latLng", latLngMap);

        WritableArray placeTypesArray = Arguments.createArray();
        List<Integer> placeTypes = place.getPlaceTypes();

        for (int item : placeTypes) {
            placeTypesArray.pushInt(item);
        }

        map.putArray("placeTypes", placeTypesArray);

        return map;
    }

    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        if (requestCode == PLACE_AUTOCOMPLETE_REQUEST_CODE) {
            if (resultCode == Activity.RESULT_CANCELED) {
                rejectPromise(PICKER_CANCELLED_ERROR);
            } else if (resultCode == PlaceAutocomplete.RESULT_ERROR) {
                Activity currentActivity = getCurrentActivity();

                if (currentActivity != null) {
                    Status status = PlaceAutocomplete.getStatus(currentActivity, data);
                    rejectPromise(status.getStatusMessage());
                } else {
                    rejectPromise(ACTIVITY_DOES_NOT_EXIST_ERROR);
                }
            } else if (resultCode == Activity.RESULT_OK) {
                Activity currentActivity = getCurrentActivity();

                if (currentActivity != null) {
                    resolvePromise(buildPlacesMap(PlaceAutocomplete.getPlace(currentActivity, data)));
                } else {
                    rejectPromise(ACTIVITY_DOES_NOT_EXIST_ERROR);
                }

            }
        }
    }

    private void initializeGoogleApi() {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity != null) {
            mGoogleApiClient = new GoogleApiClient
                    .Builder(currentActivity)
                    .addApi(Places.GEO_DATA_API)
                    .addApi(Places.PLACE_DETECTION_API)
                    .build();
        }
    }

    @Override
    public void onHostResume() {
        if (mGoogleApiClient == null) {
            initializeGoogleApi();
        }

        mGoogleApiClient.connect();
    }

    @Override
    public void onHostPause() {
        mGoogleApiClient.disconnect();
    }

    @Override
    public void onHostDestroy() {
    }
}
