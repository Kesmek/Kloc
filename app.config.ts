import type { ExpoConfig, ConfigContext } from "expo/config";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default ({ config }: ConfigContext): ExpoConfig => {
  const tursoUrl = process.env.TURSO_DB_URL ?? null; // Use null or a default dev URL if not set
  const tursoAuthToken = process.env.TURSO_DB_AUTH_TOKEN ?? null; // Use null or a dev token if not set

  console.log("tursoUrl", tursoUrl);
  console.log("tursoAuthToken", tursoAuthToken);

  if (!tursoUrl || !tursoAuthToken) {
    // You might want to throw an error during the build if these are missing for a release build
    // Or rely on runtime checks in your app code
    console.warn(
      "[app.config.js] WARNING: Turso configuration variables are missing!",
    );
  }

  return {
    ...config,
    slug: config.slug ?? "shiftly",
    name: config.name ?? "Shiftly",
    extra: {
      ...config.extra, // Preserve any existing 'extra' config
      // Add your runtime configuration here
      tursoUrl: tursoUrl,
      tursoAuthToken: tursoAuthToken,
      // Add other config variables as needed
    },
  };
};
