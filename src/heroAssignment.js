export const HERO_FLAG = "homepage-hero-dispatch-copy-2026-11";

// Inlined in the homepage head. Keep this function independent of module scope.
export function assignHero(storageKey, flag, sha1) {
    if (
        navigator.webdriver ||
        /bot|crawl|spider|slurp|preview|lighthouse|facebookexternal/i.test(
            navigator.userAgent
        )
    )
        return;

    function readSnapshot(read) {
        try {
            return JSON.parse(read()) || {};
        } catch {
            return {};
        }
    }

    const cookie = readSnapshot(() => {
        const prefix = storageKey + "=";
        const entry = document.cookie
            .split(";")
            .map((part) => part.trim())
            .find((part) => part.startsWith(prefix));
        return entry && decodeURIComponent(entry.slice(prefix.length));
    });
    const local = readSnapshot(() => localStorage.getItem(storageKey));
    const internal = new URLSearchParams(location.search).get("internal");
    if (
        internal === "1" ||
        (internal !== "0" &&
            (cookie.internal_traffic || local.internal_traffic))
    )
        return;

    const existingId = cookie.$device_id || local.$device_id;
    const deviceId = existingId || window.crypto?.randomUUID?.();
    if (typeof deviceId !== "string") return;

    // Mirrors the active PostHog flag's device-based 50/50 split. Update this
    // split and rebuild if the PostHog rollout changes. Set the build variable
    // HERO_EXPERIMENT_ENABLED=false to serve control to all visitors.
    const variant =
        parseInt(sha1(flag + "." + deviceId + "variant").slice(0, 15), 16) <
        0x800000000000000
            ? "control"
            : "test";
    document.documentElement.dataset.heroVariant = variant;
    const assignment = {
        variant,
        newDeviceId: existingId ? undefined : deviceId,
        earlyClicks: 0,
        recordEarlyClick(event) {
            if (event.target.closest?.("#hero-cta")) assignment.earlyClicks++;
        },
    };
    window.__heroAssignment = assignment;
    // The CTA is usable before the analytics module has loaded.
    document.addEventListener("click", assignment.recordEarlyClick);
}
