# Android speaker routing for the Audio Room

The React app calls `window.AddaLoveAudio.setSpeakerphoneOn(true | false)` whenever the Audio Room speaker button is pressed. A normal browser cannot select the Android speaker or earpiece; this small Android WebView bridge performs that native action.

Add the bridge before loading the site in your Android WebView:

```java
import android.content.Context;
import android.media.AudioManager;
import android.webkit.JavascriptInterface;

public final class AddaLoveAudioBridge {
    private final AudioManager audioManager;

    public AddaLoveAudioBridge(Context context) {
        audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
    }

    @JavascriptInterface
    public void setSpeakerphoneOn(boolean enabled) {
        audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
        audioManager.setSpeakerphoneOn(enabled);
    }
}
```

```java
webView.getSettings().setJavaScriptEnabled(true);
webView.addJavascriptInterface(new AddaLoveAudioBridge(this), "AddaLoveAudio");
```

Also declare microphone permission and request it at runtime:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

When the room/call ends, restore the phone audio mode in native Android code:

```java
audioManager.setSpeakerphoneOn(false);
audioManager.setMode(AudioManager.MODE_NORMAL);
```
