package io.scrollback.neighborhoods.modules.appvirality;

import android.app.Activity;

import com.appvirality.AppviralityUI;
import com.appvirality.CampaignHandler;
import com.appvirality.android.AppviralityAPI;
import com.appvirality.android.CampaignDetails;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;

public class AppviralityModule extends ReactContextBaseJavaModule {

    private Activity mCurrentACtivity;
    private ArrayList<Callback> pendingRewardClaimedCallbacks = new ArrayList<>();
    private ArrayList<Callback> pendingCamapignReadyCallbacks = new ArrayList<>();
    private boolean isRewarded;

    public AppviralityModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);

        mCurrentACtivity = activity;

        AppviralityAPI.setCampaignHandler(mCurrentACtivity, AppviralityAPI.GH.Word_of_Mouth, new AppviralityAPI.CampaignReadyListner() {
            @Override
            public void onCampaignReady(CampaignDetails campaignDetails) {
                boolean status = campaignDetails != null;

                if (status) {
                    CampaignHandler.setCampaignDetails(campaignDetails);
                }

                for (Callback callback : pendingCamapignReadyCallbacks) {
                    callback.invoke(status);
                }

                pendingCamapignReadyCallbacks = null;
            }
        });

        AppviralityAPI.claimRewardOnSignUp(reactContext.getApplicationContext(), new AppviralityAPI.RewardClaimed() {
            @Override
            public void OnResponse(boolean status, String message) {
                for (Callback callback : pendingRewardClaimedCallbacks) {
                    callback.invoke(status);
                }

                isRewarded = status;
                pendingRewardClaimedCallbacks = null;
            }
        });

        AppviralityAPI.init(reactContext.getApplicationContext());
    }

    public String getName() {
        return "AppviralityModule";
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
    public void onRewardClaimed(final Callback callback) {
        if (pendingRewardClaimedCallbacks != null) {
            pendingRewardClaimedCallbacks.add(callback);
        } else {
            callback.invoke(isRewarded);
        }
    }

    @ReactMethod
    public void onCampaignReady(final Callback callback) {
        if (pendingCamapignReadyCallbacks != null) {
            pendingCamapignReadyCallbacks.add(callback);
        } else {
            callback.invoke(CampaignHandler.getCampiagnDetails() != null);
        }
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
