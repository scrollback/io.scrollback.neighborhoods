package io.scrollback.neighborhoods.modules.analytics;

import com.crashlytics.android.answers.Answers;
import com.crashlytics.android.answers.CustomEvent;

import java.util.Date;
import java.util.Map;

public class Trackers {

    public static final String UTM_CAMPAIGN = "utm_campaign";
    public static final String UTM_SOURCE = "utm_source";
    public static final String UTM_MEDIUM = "utm_medium";
    public static final String UTM_TERM = "utm_term";
    public static final String UTM_CONTENT = "utm_content";

    public static void logTiming(String actionName, Date startTime, Date endTime) {
        Answers.getInstance().logCustom(new CustomEvent("Timing")
                .putCustomAttribute("Name", actionName)
                .putCustomAttribute("Time Spent", (endTime.getTime() - startTime.getTime() / 1000)));
    }

    public static void logInstall(String referrer, Map<String, String> params) {
        if (params == null || params.isEmpty()) {
            if (referrer != null) {
                Answers.getInstance().logCustom(new CustomEvent("Install")
                        .putCustomAttribute("Referrer", referrer));
            }

            return;
        }

        CustomEvent event = new CustomEvent("Install");

        for (Map.Entry<String, String> entry : params.entrySet()) {
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
