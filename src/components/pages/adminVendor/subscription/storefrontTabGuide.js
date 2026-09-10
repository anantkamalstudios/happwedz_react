/**
 * What each storefront section is for, in a vendor's terms.
 *
 * Shown in the "Know more about what you'll get" modal on the plan cards, so a vendor
 * can see what a plan actually lets them do before paying for it. Each line was written
 * against what the tab really edits, not guessed from its name.
 *
 * Keyed by the tab ids in happywedz-backend/src/config/storefrontTabs.js. A tab missing
 * here still appears in the modal under its label, just without a description, so adding
 * a tab on the server can never break this screen.
 */
const STOREFRONT_TAB_GUIDE = {
  "vendor-basic":
    "Your business name, tagline and About Us - the first thing couples read on your profile.",
  faq: "Answer the questions couples ask most, like travel, booking and what is included, before they need to message you.",
  "vendor-contact":
    "The contact name, phone number and email couples use to reach you directly.",
  "vendor-location":
    "Your address and the areas you serve, so you appear when couples search in those places.",
  photos: "Your portfolio - usually the first thing couples look at when comparing vendors.",
  "vendor-360-view":
    "Panoramic photos and 360° videos that let couples look around your venue or studio as if they were there.",
  videos: "Showreels, highlight films and walkthroughs, played right on your profile.",
  "preferred-vendors":
    "Recommend other HappyWedz vendors you like working with, shown on your profile.",
  social:
    "Links to your Instagram, Facebook, Pinterest, X and website, so couples can see more of your work.",
  "vendor-facilities":
    "Practical details such as delivery time, travel coverage, the events you cover and when you started. Venues list their amenities here.",
  "vendor-menus":
    "Your food menus with veg and non-veg prices per plate. Only shown for caterers and venues.",
  promotions:
    "Offers and discounts, highlighted on your listing to turn interest into bookings.",
  "vendor-policies":
    "Your terms and conditions, cancellation and refund policies, set out up front so there are no surprises.",
  "vendor-availability":
    "The dates and slots you are free, so couples only enquire when you can take the booking.",
  "vendor-pricing":
    "Your starting price and price range, so enquiries come from couples whose budget fits.",
};

export default STOREFRONT_TAB_GUIDE;
