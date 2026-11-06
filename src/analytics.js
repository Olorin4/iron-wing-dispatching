// PostHog product analytics: page views, clicks, form conversions and errors.
//
// BaseLayout loads this module on every page; page scripts import `track`,
// `identifyVisitor` and `trackError` from it. Without POSTHOG_PROJECT_TOKEN
// every function here does nothing, so the site works the same with
// analytics off. Google Tag Manager runs alongside and is not affected.
import posthog from "posthog-js";
import { POSTHOG_HOST, POSTHOG_PROJECT_TOKEN } from "astro:env/client";

const enabled = Boolean(POSTHOG_PROJECT_TOKEN);

if (enabled) {
    posthog.init(POSTHOG_PROJECT_TOKEN, {
        api_host: POSTHOG_HOST,
        // The PostHog app, for links such as the toolbar, when api_host is a proxy.
        ui_host: "https://us.posthog.com",
        defaults: "2026-05-30",
        // Only visitors who submit a form get a person profile.
        person_profiles: "identified_only",
    });
    // Lets local test traffic be filtered out of the live numbers.
    posthog.register({
        deployment_environment: import.meta.env.DEV
            ? "development"
            : "production",
    });
} else if (import.meta.env.DEV) {
    console.error(
        "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured"
    );
}

/** Records a named event with optional properties. */
export function track(event, properties = {}) {
    if (enabled) posthog.capture(event, properties);
}

/**
 * Links this browser's visits to the person who submitted a form. The forms
 * have no account ID, so the lowercased email is the identity.
 */
export function identifyVisitor(email, properties = {}) {
    const id = email.trim().toLowerCase();
    if (enabled && id) posthog.identify(id, { email: id, ...properties });
}

/** Sends an unexpected error to PostHog error tracking. */
export function trackError(error, properties = {}) {
    if (enabled) posthog.captureException(error, properties);
}
