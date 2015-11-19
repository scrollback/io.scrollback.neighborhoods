package io.scrollback.neighborhoods.modules.analytics;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.NoSuchPropertyException;

import com.crashlytics.android.answers.Answers;
import com.crashlytics.android.answers.CustomEvent;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

public class InstallReferrerTools {

    public final static String UTM_CAMPAIGN = "utm_campaign";
    public final static String UTM_SOURCE = "utm_source";
    public final static String UTM_MEDIUM = "utm_medium";
    public final static String UTM_TERM = "utm_term";
    public final static String UTM_CONTENT = "utm_content";

    private final static String PREFERENCES_FILE = "google_play_install_receiver";
    private final static String PROPERTY_INSTALL_REFERRER = "install_referrer";

    private final static String ERROR_NO_REFERRER = "No install referrer found";
    private final static String ERROR_NO_SUCH_PARAM = "No such parameter found";

    private Map<String, String> referralParams;
    private String referrer;
    private Context mContext;

    private static InstallReferrerTools mInstance;

    InstallReferrerTools(Context context) {
        mContext = context;

        referrer = context.getSharedPreferences(PREFERENCES_FILE, Context.MODE_PRIVATE).getString(PROPERTY_INSTALL_REFERRER, null);
    }

    public static InstallReferrerTools getInstance(Context context) {
        if (mInstance == null) {
            mInstance = new InstallReferrerTools(context);
        }

        return mInstance;
    }

    public void setReferrer(final String ref) {
        referrer = ref;

        // Extract params
        referralParams = new HashMap<>();

        try {
            String[] params = URLDecoder.decode(referrer, "UTF-8").split("&");

            for (String p : params) {
                String[] pair = p.split("=");

                if (pair.length == 2) {
                    referralParams.put(pair[0], pair[1]);
                }
            }
        } catch (UnsupportedEncodingException err) {
            referralParams = null;
        }

        SharedPreferences.Editor e = mContext.getSharedPreferences(PREFERENCES_FILE, Context.MODE_PRIVATE).edit();

        e.putString(PROPERTY_INSTALL_REFERRER, referrer);
        e.apply();

        // Log installation
        logInstall();
    }

    public String getReferrer() throws NoSuchPropertyException {
        if (referrer == null) {
            throw new NoSuchPropertyException(ERROR_NO_REFERRER);
        } else {
            return referrer;
        }
    }

    public String getRefferalParameter(final String param) throws NoSuchPropertyException {
        if (referralParams == null) {
            throw new NoSuchPropertyException(ERROR_NO_REFERRER);
        }

        if (referralParams.containsKey(param)) {
            return referralParams.get(param);
        } else {
            throw new NoSuchPropertyException(ERROR_NO_SUCH_PARAM + ": " + param);
        }
    }

    private void logInstall() {
        if (referralParams == null || referralParams.isEmpty()) {
            if (referrer != null) {
                Answers.getInstance().logCustom(new CustomEvent("Install")
                    .putCustomAttribute("Referrer", referrer));
            }

            return;
        }

        CustomEvent event = new CustomEvent("Install");

        for (Map.Entry<String, String> entry : referralParams.entrySet()) {
            String name;

            switch (entry.getKey()) {
                case UTM_CAMPAIGN:
                    name = "Campaign Name";
                    break;
                case UTM_SOURCE:
                    name = "Campaign Source";
                    break;
                case UTM_MEDIUM:
                    name = "Campaign Medium";
                    break;
                case UTM_TERM:
                    name = "Campaign Term";
                    break;
                case UTM_CONTENT:
                    name = "Campaign Content";
                    break;
                default:
                    name = entry.getKey();
            }

            event.putCustomAttribute(name, entry.getValue());
        }

        Answers.getInstance().logCustom(event);
    }
}
