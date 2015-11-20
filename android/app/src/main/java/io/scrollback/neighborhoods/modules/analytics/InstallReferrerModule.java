package io.scrollback.neighborhoods.modules.analytics;

import android.util.NoSuchPropertyException;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class InstallReferrerModule extends ReactContextBaseJavaModule {

    ReactApplicationContext mReactContext;

    public InstallReferrerModule(ReactApplicationContext reactContext) {
        super(reactContext);

        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "InstallReferrerModule";
    }

    @ReactMethod
    public void getReferrer(Promise promise) {
        try {
            promise.resolve(InstallReferrerTools.getInstance(mReactContext).getReferrer());
        } catch (NoSuchPropertyException e) {
            promise.reject(e.getMessage());
        }
    }

    @ReactMethod
    public void getCampaignName(Promise promise) {
        try {
            promise.resolve(InstallReferrerTools.getInstance(mReactContext).getRefferalParameter(Trackers.UTM_CAMPAIGN));
        } catch (NoSuchPropertyException e) {
            promise.reject(e.getMessage());
        }
    }

    @ReactMethod
    public void getCampaignSource(Promise promise) {
        try {
            promise.resolve(InstallReferrerTools.getInstance(mReactContext).getRefferalParameter(Trackers.UTM_SOURCE));
        } catch (NoSuchPropertyException e) {
            promise.reject(e.getMessage());
        }
    }

    @ReactMethod
    public void getCampaignMedium(Promise promise) {
        try {
            promise.resolve(InstallReferrerTools.getInstance(mReactContext).getRefferalParameter(Trackers.UTM_MEDIUM));
        } catch (NoSuchPropertyException e) {
            promise.reject(e.getMessage());
        }
    }

    @ReactMethod
    public void getCampaignTerm(Promise promise) {
        try {
            promise.resolve(InstallReferrerTools.getInstance(mReactContext).getRefferalParameter(Trackers.UTM_TERM));
        } catch (NoSuchPropertyException e) {
            promise.reject(e.getMessage());
        }
    }

    @ReactMethod
    public void getCampaignContent(Promise promise) {
        try {
            promise.resolve(InstallReferrerTools.getInstance(mReactContext).getRefferalParameter(Trackers.UTM_CONTENT));
        } catch (NoSuchPropertyException e) {
            promise.reject(e.getMessage());
        }
    }
}
