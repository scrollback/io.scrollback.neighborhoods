package io.scrollback.neighborhoods.modules.analytics;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.NoSuchPropertyException;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

public class InstallReferrerTools {

    private static final String PREFERENCES_FILE = "google_play_install_receiver";
    private static final String PROPERTY_INSTALL_REFERRER = "install_referrer";

    private static final String ERROR_NO_REFERRER = "No install referrer found";
    private static final String ERROR_NO_SUCH_PARAM = "No such parameter found";

    private static InstallReferrerTools mInstance;
    private Map<String, String> referralParams;
    private String referrer;
    private Context mContext;

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

    public String getReferrer() throws NoSuchPropertyException {
        if (referrer == null) {
            throw new NoSuchPropertyException(ERROR_NO_REFERRER);
        } else {
            return referrer;
        }
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
        Trackers.logInstall(referrer, referralParams);
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
}
