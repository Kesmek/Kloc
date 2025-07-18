# Shiftly: Privacy Policy

Welcome to the Shiftly app!

This is an open-source application developed for people who want a straightforward way to track their work hours. The source code is available on GitHub.

This policy outlines what data Shiftly stores and why it requests certain permissions.

### Data Collected by the App

I hereby state, to the best of my knowledge and belief, that Shiftly has not been programmed to collect any personally identifiable information for tracking or advertising purposes.

All data you create (including jobs, pay cycles, and shifts) is stored **locally on your device only**. This data can be completely erased by clearing the app's data in your device settings or by uninstalling the application.

No third-party analytics software is present in the app.

### Explanation of Permissions Requested in the App

The list of permissions required by the app can be found in its `AndroidManifest.xml` file. The following is a breakdown of why these permissions are necessary for the app to function correctly.

| Permission | Why it is required |
| :---: | --- |
| `android.permission.INTERNET` | This permission is required **only** if you choose to enable the optional Cloud Sync feature (coming soon) to back up and sync your data with your private Turso database. The app does not use the internet for any other purpose. |
| `android.permission.READ_EXTERNAL_STORAGE` | This permission is needed to allow you to import data into the app, such as restoring a backup file from your device's storage. |
| `android.permission.WRITE_EXTERNAL_STORAGE` | This permission is required to enable you to export your shift data, for example, saving your work history as a CSV or backup file to your device's storage. |
| `android.permission.SYSTEM_ALERT_WINDOW` | Allows the app to display information over other applications. This could be used for features like a floating timer widget that shows your ongoing shift duration even when you are using another app. |
| `android.permission.VIBRATE` | Required to provide haptic feedback, such as vibrating the device to confirm that a shift has started or ended. This permission is automatically granted by the system. |

If you find any security vulnerability that has been inadvertently caused, please refer to our Security Policy and report it to justin.scopelleti.dev@gmail.com.
For any other questions regarding how the app protects your privacy, please send an email or post a discussion on our GitHub repository.
