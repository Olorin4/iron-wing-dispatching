// PostHog product analytics: page views, clicks, form conversions and errors.
//
// BaseLayout loads this module on every page; page scripts import `track`,
// `identifyVisitor` and `trackError` from it. Without POSTHOG_PROJECT_TOKEN
// every function here does nothing, so the site works the same with
// analytics off. Google Tag Manager runs alongside and is not affected.
import posthog from "posthog-js";
import { POSTHOG_HOST, POSTHOG_PROJECT_TOKEN } from "astro:env/client";

const enabled = Boolean(POSTHOG_PROJECT_TOKEN);

// Outreach emails link here with `ref=<12 chars of base32>`. The ref is kept as
// an `outreach_ref` event property and then removed from the address bar, so
// a copied or shared URL does not carry one person's ref.
const OUTREACH_REF = /^[a-z2-7]{12}$/;

/** Removes only `ref` from the address bar, keeping other params and the hash. */
function stripRefFromUrl() {
    const url = new URL(location.href);
    if (!url.searchParams.has("ref")) return;
    url.searchParams.delete("ref");
    history.replaceState(history.state, "", url);
}

/** Registers a valid ref, then drops `ref` from the URL once $pageview is captured. */
function keepOutreachRef() {
    const params = new URLSearchParams(location.search);
    if (!params.has("ref")) return;
    const ref = params.get("ref");
    // Registering sets an event property only; it does not create a person profile.
    if (OUTREACH_REF.test(ref)) posthog.register({ outreach_ref: ref });

    // posthog-js captures the first $pageview on a timer after init, reading the
    // URL at that moment, so the URL has to stay as it is until then.
    let done = false;
    let stopListening = () => {};
    const strip = () => {
        if (done) return;
        done = true;
        stopListening();
        stripRefFromUrl();
    };
    stopListening = posthog.on("eventCaptured", (data) => {
        if (data?.event === "$pageview") setTimeout(strip);
    });
    // The $pageview is not captured for bots, so do not wait for it forever. A
    // hidden tab (prerender) defers the $pageview until it becomes visible.
    setTimeout(() => {
        if (document.visibilityState === "visible") strip();
    }, 2000);
}

// Opening any page with `?internal=1` marks this browser as the team's own, so
// the project's test-account filter (and the A/B test) leaves its visits out;
// `?internal=0` removes the mark. The mark is a PostHog super property, kept in
// PostHog's own cookie, and the parameter is removed from the address bar.
function markInternalTraffic() {
    const url = new URL(location.href);
    const value = url.searchParams.get("internal");
    if (value === "1") posthog.register({ internal_traffic: true });
    else if (value === "0") posthog.unregister("internal_traffic");
    else return;
    url.searchParams.delete("internal");
    history.replaceState(history.state, "", url);
}

if (enabled) {
    posthog.init(POSTHOG_PROJECT_TOKEN, {
        api_host: POSTHOG_HOST,
        // The PostHog app, for links such as the toolbar, when api_host is a proxy.
        ui_host: "https://us.posthog.com",
        defaults: "2026-05-30",
        // Only visitors who submit a form get a person profile.
        person_profiles: "identified_only",
        // The hero A/B test gives up waiting after 2.5 s anyway; a longer
        // request timeout (default 3 s) lets slow flag answers still arrive,
        // so `hero_ab_flags_late` records how late they were.
        feature_flag_request_timeout_ms: 10000,
        // Click and scroll heatmaps (the PostHog toolbar shows them on the page).
        enable_heatmaps: true,
        // Session replay, when it is on in the PostHog project settings. Every
        // form field and its typed text are masked; recordings show the page
        // and the clicks, never what a visitor enters.
        session_recording: {
            maskAllInputs: true,
            maskTextSelector: "input, textarea, select, [data-ph-mask]",
        },
    });
    keepOutreachRef();
    markInternalTraffic();
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
 * have no account ID, so the lowercased email is the identity. A registered
 * outreach ref also becomes the person's `first_outreach_ref`.
 */
export function identifyVisitor(email, properties = {}) {
    const id = email.trim().toLowerCase();
    if (!enabled || !id) return;
    // $set_once keeps the first ref that reached this person.
    const ref = posthog.get_property("outreach_ref");
    posthog.identify(
        id,
        { email: id, ...properties },
        ref ? { first_outreach_ref: ref } : undefined
    );
}

/**
 * The two values the API stores with a form submission so a lead can be tied
 * back to the outreach email and the PostHog visitor: `outreachRef` (the
 * registered `ref`, or null) and `posthogDistinctId`. Both are null with
 * analytics off. Never throws, so a PostHog problem cannot block a form.
 */
export function attributionFields() {
    const fields = { outreachRef: null, posthogDistinctId: null };
    if (!enabled) return fields;
    try {
        const ref = posthog.get_property("outreach_ref");
        if (typeof ref === "string") fields.outreachRef = ref;
    } catch {
        // Leave outreachRef null.
    }
    try {
        const id = posthog.get_distinct_id();
        if (typeof id === "string" && id) fields.posthogDistinctId = id;
    } catch {
        // Leave posthogDistinctId null.
    }
    return fields;
}

/**
 * Calls `callback` once PostHog's feature flags are loaded, with a function that
 * reads one flag's variant. Reading a flag is what records the experiment
 * exposure, so callers read it only when they will actually show that variant.
 * With analytics off the callback runs at once with a reader that returns
 * undefined (everyone gets the default experience).
 */
export function whenFeatureFlagsReady(callback) {
    const noFlags = () => undefined;
    if (!enabled) return callback(noFlags);
    let called = false;
    try {
        posthog.onFeatureFlags(() => {
            if (called) return;
            called = true;
            callback((key) => posthog.getFeatureFlag(key));
        });
    } catch {
        if (!called) {
            called = true;
            callback(noFlags);
        }
    }
}

/** Sends an unexpected error to PostHog error tracking. */
export function trackError(error, properties = {}) {
    if (enabled) posthog.captureException(error, properties);
}
