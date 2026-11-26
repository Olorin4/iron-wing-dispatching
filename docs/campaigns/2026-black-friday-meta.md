# Black Friday Meta Leads campaign

Status: prepared for review. Enrollment is disabled pending owner confirmation of the launch time and proposed November 30 deadline. The creative uses those proposed dates.

## Creative

Use [the 1080 × 1350 image](2026-black-friday-meta.png) for Facebook and Instagram feeds. Truck photograph by Caleb Ruiter, reused from the Iron Wing homepage.

**Primary text**

> Keep driving. We’ll find your next load. Tell us your equipment and where you want to run. Your dispatcher finds loads, compares total miles and negotiates with the broker.
>
> New carriers on Dispatch Essentials can request our 3% Black Friday rate by Monday, November 30, 2026 at 11:59 p.m. Central. The 3% fee applies to the agreed rate confirmation total on eligible loads we book through December 31, 2026, Central time. Loads booked January 1, 2027 onward are 5%.
>
> A $2,400 rate confirmation including $400 in fuel costs $72 at 3%, $120 at 5%, or $240 on Dispatch + Back Office at 10%. Request your rate now and send documents later.

**Headline**

> Request 3% Dispatch Essentials

**Description**

> Apply by Nov 30 at 11:59 p.m. Central. Eligible bookings through Dec 31.

## Ads Manager

| Level    | Setting                      | Value                                                                                                                              |
| -------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Campaign | Name                         | IWD · Black Friday 2026 · Website Leads                                                                                            |
| Campaign | Objective                    | Leads                                                                                                                              |
| Ad set   | Name                         | US · Dispatch Essentials · Website Lead                                                                                            |
| Ad set   | Conversion location          | Website                                                                                                                            |
| Ad set   | Performance goal             | Maximize number of conversions                                                                                                     |
| Ad set   | Dataset and conversion event | Existing Iron Wing website dataset, standard event **Lead**                                                                        |
| Ad set   | Location                     | United States                                                                                                                      |
| Ad set   | Placements                   | Facebook Feed and Instagram Feed for this 4:5 asset                                                                                |
| Ad set   | Budget                       | Enter the owner-approved cap before launch                                                                                         |
| Ad set   | Schedule                     | Start after approval and review. End December 1, 2026 at 00:00 America/Chicago (06:00 UTC). Convert to the ad account’s time zone. |
| Ad       | Name                         | Black Friday · 3% Essentials · Rate confirmation                                                                                   |
| Ad       | Identity                     | Iron Wing Dispatching Facebook Page and its linked Instagram account                                                               |
| Ad       | Format                       | Single image                                                                                                                       |
| Ad       | Destination                  | Website                                                                                                                            |
| Ad       | Website URL                  | `https://iron-wing-dispatching.com/sign-up.html?offer=black-friday-2026&plan=ESSENTIAL`                                            |
| Ad       | URL parameters               | `utm_source={{campaign.id}}&utm_medium={{adset.id}}&utm_campaign={{ad.id}}`                                                        |
| Ad       | Call to action               | Apply Now                                                                                                                          |
| Ad       | Browser add-ons              | Leave off. The destination already offers a call and question form.                                                                |
| Delivery | Status                       | Keep campaign, ad set and ad paused during preparation.                                                                            |

Open the Facebook and Instagram mobile previews and verify the offer and date text fits in each. Test the destination from the preview and check the live call route against the saved Jack profile before activation. Keep the evergreen traffic ad linked to standard pricing.

Meta’s setup reference describes [website lead forms and conversions](https://secure.facebook.com/business/ads/ad-objectives/lead-generation/lead-ads-with-forms).

## Event verification

Keep PostHog as the reporting source. The website sends a server-side `lead_signed_up` for a durably accepted application after the Outreach delivery succeeds. It uses the same `event_id` and PostHog UUID on retry. The PostHog destination has a staged mapping for the production server event to `Lead`. Check the dataset and set the outer event filter to match the draft guard in the [release record](../plans/2026-11-26-dispatch-offer-release.md) before publishing at cutover.

Use Meta Events Manager Test Events with a permitted synthetic application. Send it twice with the same request ID and fresh Turnstile tokens. Confirm one saved lead, one PostHog application event and one deduplicated Meta `Lead`. Check that a homepage view, hero click, application view, attempted submission, accepted question and phone tap produce zero Meta `Lead` events. Check that the three legacy Meta tags and `fbclid` from the landing URL reach the accepted event. Keep `phone_tapped` separate from a call with a confirmed offer callback request.
