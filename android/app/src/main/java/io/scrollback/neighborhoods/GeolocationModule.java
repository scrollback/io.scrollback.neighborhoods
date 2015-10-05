package io.scrollback.neighborhoods;

import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class GeolocationModule extends ReactContextBaseJavaModule {

    final int LOCATION_REFRESH_TIME = 0;
    final int LOCATION_REFRESH_DISTANCE = 0;

    private final ReactApplicationContext mReactContext;

    private final LocationManager mLocationManager;
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
    private boolean isWatching = false;

    public GeolocationModule(ReactApplicationContext ctx) {
        super(ctx);

        mReactContext = ctx;

        mLocationManager = (LocationManager) mReactContext.getSystemService(mReactContext.LOCATION_SERVICE);
        mCurrentlocation = mLocationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
    }

    private WritableMap getMapFromLocation(Location loc) {
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
    public void getCurrentPosition(final Callback callback) {
        if (mCurrentlocation != null) {
            callback.invoke(getMapFromLocation(mCurrentlocation));
        } else {
            callback.invoke();
        }
    }

    @ReactMethod
    public void startWatching() {
        if (!isWatching) {
            isWatching = true;

            mLocationManager.requestLocationUpdates(
                    LocationManager.NETWORK_PROVIDER,
                    LOCATION_REFRESH_TIME,
                    LOCATION_REFRESH_DISTANCE,
                    mLocationListener
            );
        }
    }

    @ReactMethod
    public void stopWatching() {
        if (isWatching) {
            isWatching = false;

            mLocationManager.removeUpdates(mLocationListener);
        }
    }

    @ReactMethod
    public void isWatching(final Callback callback) {
        callback.invoke(isWatching);
    }
}
