// Homepage hero A/B test, PostHog experiment "Homepage hero message" (flag
// `homepage-hero-message`, variants `control` / `test`, bucketed by device).
//
// An inline script in index.astro hides the hero heading, subheading and
// button while the flag loads and reveals them after 2.5 s whatever happens.
// If the flag answers in time, the visitor sees their variant. If it answers
// late, or PostHog is blocked or off, the visitor keeps today's text and the
// flag is never read, so nobody is counted as seeing a variant they did not
// see. A late answer is recorded as `hero_ab_fallback`, so the miss rate and
// how late flags arrive can be watched in PostHog.
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

export function runHeroExperiment() {
    // Crawlers are never hidden and never enrolled (see index.astro): the
    // inline script returns before it records a start time for them.
    if (typeof window.__heroAbStart !== "number") return;
    whenFeatureFlagsReady((getVariant) => {
        try {
            if (window.__heroAbTimedOut) {
                track("hero_ab_fallback", {
                    flag: FLAG,
                    flags_ms: Math.round(
                        performance.now() - window.__heroAbStart
                    ),
                    cutoff_ms: window.__heroAbCutoffMs,
                });
                return;
            }
            if (getVariant(FLAG) === "test") showTestVariant();
        } finally {
            reveal();
        }
    });
}
