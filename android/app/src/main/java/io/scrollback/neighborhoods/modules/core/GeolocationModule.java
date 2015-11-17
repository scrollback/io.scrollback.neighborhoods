package io.scrollback.neighborhoods.modules.core;

import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import io.scrollback.neighborhoods.Constants;

public class GeolocationModule extends ReactContextBaseJavaModule {

    final int LOCATION_REFRESH_TIME = 0;
    final int LOCATION_REFRESH_DISTANCE = 0;

    final String LOCATION_PROVIDER = LocationManager.NETWORK_PROVIDER;

    private final ReactApplicationContext mReactContext;
    private final Context mActiviyContext;

    private Location mCurrentlocation;
    private final LocationListener mLocationListener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
            mCurrentlocation = location;

            mReactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("geolocationChange", getMapFromLocation(location));
        }

        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {
        }

        @Override
        public void onProviderEnabled(String provider) {
        }

        @Override
        public void onProviderDisabled(String provider) {
        }
    };
    private LocationManager mLocationManager = null;
    private boolean isWatching = false;

    public GeolocationModule(ReactApplicationContext reactContext, Context activityContext) {
        super(reactContext);

        mReactContext = reactContext;
        mActiviyContext = activityContext;

        try {
            mLocationManager = (LocationManager) mReactContext.getSystemService(Application.LOCATION_SERVICE);
            mCurrentlocation = mLocationManager.getLastKnownLocation(LOCATION_PROVIDER);
        } catch (SecurityException e) {
            // Permission may be rejected starting from Marshmallow
            Log.e(Constants.TAG, "Failed to create location manager", e);
        }
    }

    private WritableMap getMapFromLocation(final Location loc) {
        WritableMap coords = Arguments.createMap();

        coords.putDouble("latitude", loc.getLatitude());
        coords.putDouble("longitude", loc.getLongitude());
        coords.putDouble("altitude", loc.getAltitude());
        coords.putDouble("accuracy", loc.getAccuracy());
        coords.putDouble("speed", loc.getSpeed());

        WritableMap map = Arguments.createMap();

        map.putMap("coords", coords);
        map.putDouble("timestamp", loc.getTime());

        return map;
    }

    @Override
    public String getName() {
        return "GeolocationModule";
    }

    @ReactMethod
    public void isGPSEnabled(final Promise promise) {
        if (mLocationManager != null) {
            promise.resolve(mLocationManager.isProviderEnabled(LOCATION_PROVIDER));
        } else {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void showGPSSettings() {
        mActiviyContext.startActivity(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS));
    }

    @ReactMethod
    public void getCurrentPosition(final Promise promise) {
        if (mCurrentlocation != null) {
            promise.resolve(getMapFromLocation(mCurrentlocation));
        } else {
            promise.reject("Failed to get current position");
        }
    }

    @ReactMethod
    public void startWatching() {
        if (!isWatching && mLocationManager != null) {
            try {
                mLocationManager.requestLocationUpdates(
                        LOCATION_PROVIDER,
                        LOCATION_REFRESH_TIME,
                        LOCATION_REFRESH_DISTANCE,
                        mLocationListener
                );

                isWatching = true;
            } catch (SecurityException e) {
                // Permission may be rejected starting from Marshmallow
                Log.e(Constants.TAG, "Failed to watch for location updates", e);
            }
        }
    }

    @ReactMethod
    public void stopWatching() {
        if (isWatching && mLocationManager != null) {
            try {
                mLocationManager.removeUpdates(mLocationListener);

                isWatching = false;
            } catch (SecurityException e) {
                // Permission may be rejected starting from Marshmallow
                Log.e(Constants.TAG, "Failed to stop watching for location updates", e);
            }
        }
    }

    @ReactMethod
    public void isWatching(final Promise promise) {
        promise.resolve(isWatching);
    }
}
