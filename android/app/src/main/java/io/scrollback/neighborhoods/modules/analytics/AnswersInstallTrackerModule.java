package io.scrollback.neighborhoods.modules.analytics;

import android.util.NoSuchPropertyException;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class AnswersInstallTrackerModule extends ReactContextBaseJavaModule {

    public AnswersInstallTrackerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AnswersInstallTrackerModule";
    }

    @ReactMethod
    public void getReferrer(Promise promise) {
        try {
            promise.resolve(AnswersInstallTracker.getInstance(getReactApplicationContext()).getReferrer());
        } catch (NoSuchPropertyException e) {
            promise.reject(e.getMessage());
        }
    }

    @ReactMethod
    public void getCampaignName(Promise promise) {
        try {
            promise.resolve(AnswersInstallTracker.getInstance(getReactApplicationContext()).getRefferalParameter(Trackers.UTM_CAMPAIGN));
        } catch (NoSuchPropertyException e) {
            promise.reject(e.getMessage());
        }
    }

    @ReactMethod
    public void getCampaignSource(Promise promise) {
        try {
            promise.resolve(AnswersInstallTracker.getInstance(getReactApplicationContext()).getRefferalParameter(Trackers.UTM_SOURCE));
        } catch (NoSuchPropertyException e) {
            promise.reject(e.getMessage());
        }
    }

    @ReactMethod
    public void getCampaignMedium(Promise promise) {
        try {
            promise.resolve(AnswersInstallTracker.getInstance(getReactApplicationContext()).getRefferalParameter(Trackers.UTM_MEDIUM));
        } catch (NoSuchPropertyException e) {
            promise.reject(e.getMessage());
        }
    }

    @ReactMethod
    public void getCampaignTerm(Promise promise) {
        try {
            promise.resolve(AnswersInstallTracker.getInstance(getReactApplicationContext()).getRefferalParameter(Trackers.UTM_TERM));
        } catch (NoSuchPropertyException e) {
            promise.reject(e.getMessage());
        }
    }

    @ReactMethod
    public void getCampaignContent(Promise promise) {
        try {
            promise.resolve(AnswersInstallTracker.getInstance(getReactApplicationContext()).getRefferalParameter(Trackers.UTM_CONTENT));
        } catch (NoSuchPropertyException e) {
            promise.reject(e.getMessage());
        }
    }
}
