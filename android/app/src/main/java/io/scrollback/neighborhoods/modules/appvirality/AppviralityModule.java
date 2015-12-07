package io.scrollback.neighborhoods.modules.appvirality;

import android.app.Activity;
import android.support.annotation.Nullable;

import com.appvirality.AppviralityUI;
import com.appvirality.android.AppviralityAPI;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class AppviralityModule extends ReactContextBaseJavaModule {

    private Activity mCurrentACtivity;

    public AppviralityModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);

        mCurrentACtivity = activity;

        AppviralityAPI.init(reactContext.getApplicationContext());

        AppviralityAPI.claimRewardOnSignUp(reactContext.getApplicationContext(), new AppviralityAPI.RewardClaimed() {
            @Override
            public void OnResponse(boolean isRewarded, String message) {
                WritableMap map = Arguments.createMap();

                map.putBoolean("isRewarded", isRewarded);

                sendEvent("appViralityClaimRewardsOnSignUp", map);
            }
        });
    }

    public String getName() {
        return "AppviralityModule";
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void setUserDetails(final ReadableMap options, final Promise promise) {

        AppviralityAPI.UserDetails details = AppviralityAPI.UserDetails.setInstance(mCurrentACtivity.getApplicationContext());

        if (options.hasKey("email")) {
            details.setUserEmail(options.getString("email"));
        }

        if (options.hasKey("name")) {
            details.setCountry(options.getString("name"));
        }

        if (options.hasKey("storeId")) {
            details.setCountry(options.getString("storeId"));
        }

        if (options.hasKey("profileImage")) {
            details.setCountry(options.getString("profileImage"));
        }

        if (options.hasKey("country")) {
            details.setCountry(options.getString("country"));
        }

        if (options.hasKey("state")) {
            details.setState(options.getString("state"));
        }

        if (options.hasKey("city")) {
            details.setCity(options.getString("city"));
        }

        if (options.hasKey("isExisting")) {
            details.isExistingUser(options.getBoolean("isExisting"));
        }

        if (options.hasKey("pushRegId")) {
            details.setPushRegID(options.getString("pushRegId"));
        }

        details.Update(new AppviralityAPI.UpdateUserDetailsListner() {
            @Override
            public void onSuccess(boolean isSuccess) {
                promise.resolve(isSuccess);
            }
        });
    }

    @ReactMethod
    public void showWelcomeScreen() {
        AppviralityUI.showWelcomeScreen(mCurrentACtivity);
    }

    @ReactMethod
    public void showGrowthHack() {
        AppviralityUI.showGrowthHack(mCurrentACtivity, AppviralityUI.GH.Word_of_Mouth);
    }

    @ReactMethod
    public void showLaunchBar() {
        AppviralityUI.showLaunchBar(mCurrentACtivity, AppviralityUI.GH.Word_of_Mouth);
    }

    @ReactMethod
    public void showLaunchPopup() {
        AppviralityUI.showLaunchPopup(mCurrentACtivity, AppviralityUI.GH.Word_of_Mouth);
    }

    @ReactMethod
    public void saveConversionEvent(String event) {
        AppviralityAPI.saveConversionEvent(event, null, null);
    }
}
