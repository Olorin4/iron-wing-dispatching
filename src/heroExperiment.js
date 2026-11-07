// Homepage hero A/B test, PostHog experiment "Homepage hero message" (flag
// `homepage-hero-message`, variants `control` / `test`, bucketed by device).
//
// An inline script in index.astro hides the hero heading, subheading and
// button while the flag loads and reveals them after 2.5 s whatever happens.
// If the flag answers in time, the visitor sees their variant. If it answers
// late, or never (an ad blocker, PostHog down), the visitor keeps today's
// text and the flag is never read, so nobody is counted as seeing a variant
// they did not see. Two events make those misses visible in PostHog:
// - `hero_ab_fallback` when the visitor keeps today's text without being
//   enrolled: `reason` "timeout" (no flag by the cutoff) or "no_flag" (the
//   flag request failed outright), and
// - `hero_ab_flags_late` if the flag still arrives after a timeout (how late).
import { track, whenFeatureFlagsReady } from "./analytics.js";

const FLAG = "homepage-hero-message";

function reveal() {
    document.documentElement.classList.remove("hero-ab-pending");
}

function showTestVariant() {
    const title = document.getElementById("hero-title");
    const subtitle = document.getElementById("hero-subtitle");
    const cta = document.getElementById("hero-cta");
    const titleTemplate = document.getElementById("hero-test-title");
    const subtitleTemplate = document.getElementById("hero-test-subtitle");
    if (!title || !subtitle || !cta || !titleTemplate || !subtitleTemplate)
        return;
    title.replaceChildren(titleTemplate.content.cloneNode(true));
    subtitle.replaceChildren(subtitleTemplate.content.cloneNode(true));
    // Same destination (#pricing), different label.
    cta.textContent = cta.dataset.testText;
}

function elapsedMs() {
    return Math.round(performance.now() - window.__heroAbStart);
}

export function runHeroExperiment() {
    // Crawlers are never hidden and never enrolled (see index.astro): the
    // inline script returns before it records a start time for them.
    if (typeof window.__heroAbStart !== "number") return;
    const cutoffMs = window.__heroAbCutoffMs;
    let flagsArrived = false;

    // Runs at the cutoff alongside the inline script's own timer. Whichever
    // runs first marks the wait as over; JavaScript runs one at a time, so
    // the flag callback below sees either "in time" or "timed out", never both.
    setTimeout(
        () => {
            if (flagsArrived) return;
            window.__heroAbTimedOut = true;
            reveal();
            track("hero_ab_fallback", {
                flag: FLAG,
                reason: "timeout",
                cutoff_ms: cutoffMs,
            });
        },
        Math.max(0, cutoffMs - elapsedMs())
    );

    whenFeatureFlagsReady((getVariant) => {
        flagsArrived = true;
        try {
            if (window.__heroAbTimedOut) {
                track("hero_ab_flags_late", {
                    flag: FLAG,
                    flags_ms: elapsedMs(),
                    cutoff_ms: cutoffMs,
                });
                return;
            }
            const variant = getVariant(FLAG);
            if (variant === "test") showTestVariant();
            else if (variant !== "control") {
                // The flag request failed fast (blocked or errored), so
                // today's text stays without the visitor being enrolled.
                track("hero_ab_fallback", {
                    flag: FLAG,
                    reason: "no_flag",
                    cutoff_ms: cutoffMs,
                });
            }
        } finally {
            reveal();
        }
    });
}
