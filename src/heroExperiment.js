import { track, trackHeroExposure } from "./analytics.js";
import { HERO_FLAG } from "./heroAssignment.js";

export function runHeroExperiment() {
    const cta = document.getElementById("hero-cta");
    if (!cta) return;

    const assignment = window.__heroAssignment;
    const variant = assignment?.variant;
    if (assignment) {
        document.removeEventListener("click", assignment.recordEarlyClick);
        if (document.visibilityState === "visible") {
            trackHeroExposure(variant);
        } else {
            function onVisible() {
                if (document.visibilityState !== "visible") return;
                document.removeEventListener("visibilitychange", onVisible);
                trackHeroExposure(variant);
            }
            document.addEventListener("visibilitychange", onVisible);
        }
    }

    function trackClick() {
        track("hero_cta_clicked", {
            flag: HERO_FLAG,
            hero_variant: variant ?? "fallback",
            label: cta.innerText.trim(),
        });
    }

    for (let clicks = assignment?.earlyClicks ?? 0; clicks > 0; clicks--) {
        trackClick();
    }
    cta.addEventListener("click", trackClick);
}
