package io.scrollback.neighborhoods.modules.analytics;

import com.crashlytics.android.answers.AddToCartEvent;
import com.crashlytics.android.answers.Answers;
import com.crashlytics.android.answers.ContentViewEvent;
import com.crashlytics.android.answers.CustomEvent;
import com.crashlytics.android.answers.InviteEvent;
import com.crashlytics.android.answers.LevelEndEvent;
import com.crashlytics.android.answers.LevelStartEvent;
import com.crashlytics.android.answers.LoginEvent;
import com.crashlytics.android.answers.PurchaseEvent;
import com.crashlytics.android.answers.RatingEvent;
import com.crashlytics.android.answers.SearchEvent;
import com.crashlytics.android.answers.ShareEvent;
import com.crashlytics.android.answers.SignUpEvent;
import com.crashlytics.android.answers.StartCheckoutEvent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.UnexpectedNativeTypeException;

import java.math.BigDecimal;
import java.util.Currency;

public class AnswersModule extends ReactContextBaseJavaModule {

    public AnswersModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public String getName() {
        return "AnswersModule";
    }

    @ReactMethod
    public static void logCustom(final String eventName, final ReadableMap attributes) {
        CustomEvent event = new CustomEvent(eventName);

        ReadableMapKeySetIterator keyIterator = attributes.keySetIterator();

        while (keyIterator.hasNextKey()) {
            String key = keyIterator.nextKey();

            try {
                int value = attributes.getInt(key);

                event.putCustomAttribute(key, value);
            } catch (UnexpectedNativeTypeException e) {
                String value = attributes.getString(key);

                event.putCustomAttribute(key, value);
            }
        }

        Answers.getInstance().logCustom(event);
    }

    // E-Commerce
    @ReactMethod
    public static void logPurchase(
            final double itemPrice, final String currency,
            final String itemName, final String itemType, final String itemId,
            final boolean purchaseSucceeded) {
        Answers.getInstance().logPurchase(new PurchaseEvent()
                .putItemPrice(BigDecimal.valueOf(itemPrice))
                .putCurrency(Currency.getInstance(currency))
                .putItemName(itemName)
                .putItemType(itemType)
                .putItemId(itemId)
                .putSuccess(purchaseSucceeded));
    }

    @ReactMethod
    public static void logAddToCart(
            final double itemPrice, final String currency,
            final String itemName, final String itemType, final String itemId) {
        Answers.getInstance().logAddToCart(new AddToCartEvent()
                .putItemPrice(BigDecimal.valueOf(itemPrice))
                .putCurrency(Currency.getInstance(currency))
                .putItemName(itemName)
                .putItemType(itemType)
                .putItemId(itemId));
    }

    @ReactMethod
    public static void logStartCheckout(final double totalPrice, final String currency, final int itemCount) {
        Answers.getInstance().logStartCheckout(new StartCheckoutEvent()
                .putTotalPrice(BigDecimal.valueOf(totalPrice))
                .putCurrency(Currency.getInstance(currency))
                .putItemCount(itemCount));
    }

    // Content
    @ReactMethod
    public static void logContentView(final String contentName, final String contentType, final String contentId) {
        Answers.getInstance().logContentView(new ContentViewEvent()
                .putContentName(contentName)
                .putContentType(contentType)
                .putContentId(contentId));
    }

    @ReactMethod
    public static void logSearch(final String query) {
        Answers.getInstance().logSearch(new SearchEvent()
                .putQuery(query));
    }

    @ReactMethod
    public static void logShare(final String contentName, final String contentType, final String contentId) {
        Answers.getInstance().logShare(new ShareEvent()
                .putContentName(contentName)
                .putContentType(contentType)
                .putContentId(contentId));
    }

    @ReactMethod
    public static void logRating(final int rating, final String contentName, final String contentType, final String contentId) {
        Answers.getInstance().logRating(new RatingEvent()
                .putRating(rating)
                .putContentName(contentName)
                .putContentType(contentType)
                .putContentId(contentId));
    }

    // Users
    @ReactMethod
    public static void logSignup(final String signupMethod, final boolean signupSucceeded) {
        Answers.getInstance().logSignUp(new SignUpEvent()
                        .putMethod(signupMethod)
                        .putSuccess(signupSucceeded)
        );
    }

    @ReactMethod
    public static void logLogin(final String loginMethod, final boolean loginSucceeded) {
        Answers.getInstance().logLogin(new LoginEvent()
                .putMethod(loginMethod)
                .putSuccess(loginSucceeded));
    }

    @ReactMethod
    public static void logInvite(final String inviteMethod) {
        Answers.getInstance().logInvite(new InviteEvent()
                .putMethod(inviteMethod));
    }

    // Gaming
    @ReactMethod
    public static void logLevelStart(final String levelName) {
        Answers.getInstance().logLevelStart(new LevelStartEvent()
                .putLevelName(levelName));
    }

    @ReactMethod
    public static void logLevelEnd(final String levelName, final int score, final boolean success) {
        Answers.getInstance().logLevelEnd(new LevelEndEvent()
                .putLevelName(levelName)
                .putScore(score)
                .putSuccess(success));
    }
}
