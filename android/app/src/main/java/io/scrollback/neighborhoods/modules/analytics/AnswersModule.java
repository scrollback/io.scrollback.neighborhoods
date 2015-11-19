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
    public void logCustom(final String eventName, final ReadableMap attributes) {
        CustomEvent event = new CustomEvent(eventName);

        ReadableMapKeySetIterator keyIterator = attributes.keySetIterator();

        while (keyIterator.hasNextKey()) {
            String key = keyIterator.nextKey();

            event.putCustomAttribute(key, attributes.getString(key));
        }

        Answers.getInstance().logCustom(event);
    }

    // E-Commerce
    @ReactMethod
    public void logPurchase(
            final double itemPrice, final String currency,
            final String itemName, final String itemType, final String itemId,
            final Boolean purchaseSucceeded) {
        Answers.getInstance().logPurchase(new PurchaseEvent()
                .putItemPrice(BigDecimal.valueOf(itemPrice))
                .putCurrency(Currency.getInstance(currency))
                .putItemName(itemName)
                .putItemType(itemType)
                .putItemId(itemId)
                .putSuccess(purchaseSucceeded));
    }

    @ReactMethod
    public void logAddToCart(
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
    public void logStartCheckout(final double totalPrice, final String currency, final int itemCount) {
        Answers.getInstance().logStartCheckout(new StartCheckoutEvent()
                .putTotalPrice(BigDecimal.valueOf(totalPrice))
                .putCurrency(Currency.getInstance(currency))
                .putItemCount(itemCount));
    }

    // Content
    @ReactMethod
    public void logContentView(final String contentName, final String contentType, final String contentId) {
        Answers.getInstance().logContentView(new ContentViewEvent()
                .putContentName(contentName)
                .putContentType(contentType)
                .putContentId(contentId));
    }

    @ReactMethod
    public void logSearch(final String query) {
        Answers.getInstance().logSearch(new SearchEvent()
                .putQuery(query));
    }

    @ReactMethod
    public void logShare(final String contentName, final String contentType, final String contentId) {
        Answers.getInstance().logShare(new ShareEvent()
                .putContentName(contentName)
                .putContentType(contentType)
                .putContentId(contentId));
    }

    @ReactMethod
    public void logRating(final int rating, final String contentName, final String contentType, final String contentId) {
        Answers.getInstance().logRating(new RatingEvent()
                .putRating(rating)
                .putContentName(contentName)
                .putContentType(contentType)
                .putContentId(contentId));
    }

    // Users
    @ReactMethod
    public void logSignup(final String signupMethod, final Boolean signupSucceeded) {
        Answers.getInstance().logSignUp(new SignUpEvent()
                        .putMethod(signupMethod)
                        .putSuccess(signupSucceeded)
        );
    }

    @ReactMethod
    public void logLogin(final String loginMethod, final Boolean loginSucceeded) {
        Answers.getInstance().logLogin(new LoginEvent()
                .putMethod(loginMethod)
                .putSuccess(loginSucceeded));
    }

    @ReactMethod
    public void logInvite(final String inviteMethod) {
        Answers.getInstance().logInvite(new InviteEvent()
                .putMethod(inviteMethod));
    }

    // Gaming
    @ReactMethod
    public void logLevelStart(final String levelName) {
        Answers.getInstance().logLevelStart(new LevelStartEvent()
                .putLevelName(levelName));
    }

    @ReactMethod
    public void logLevelEnd(final String levelName, int score, boolean success) {
        Answers.getInstance().logLevelEnd(new LevelEndEvent()
                .putLevelName(levelName)
                .putScore(score)
                .putSuccess(success));
    }
}
