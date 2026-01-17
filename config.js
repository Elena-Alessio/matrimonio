window.SITE_CONFIG = {
  coupleName: "ELENA E ALESSIO",

  weddingDateISO: "2026-05-30T11:00:00+02:00",
  weddingDateDisplay: "30 MAGGIO 2026 • ORE 11:00",

  heroSubtitle: "si sposano!",

  church: {
    label: "Chiesa della Madonna del Soccorso, Corchiano (VT)",
    mapsUrl: "https://maps.app.goo.gl/k1NE3w4CULaDtjQeA",
  },

  reception: {
    coordsHuman: `42°20'13.9"N 12°24'11.6"E`,
    coordsDecimal: "42.337194,12.403222",
    mapsUrl: "https://goo.gl/maps/iZVnAFKjcZA7o4e9",
  },

  slideshowImages: [
    "assets/slideshow/slide1.jpg",
    "assets/slideshow/slide2.jpg",
    "assets/slideshow/slide3.jpg",
    "assets/slideshow/slide4.jpg",
    "assets/slideshow/slide5.jpg"
  ],

  siteUrl: "https://elena-alessio.github.io/matrimonio/",

  cloudinary: {
    cloudName: "dzshcjrcy",
    uploadPreset: "wedding_unsigned",
    folder: "matrimonio-elena-alessio-2026",
    tags: ["matrimonio", "elena-alessio-2026"],
    maxFileSizeBytes: 15 * 1024 * 1024,
  },

  iban: "IT07V0503403265000000019169",
  
  rsvp: {
    provider: "google-sheets",
    endpoint: "https://script.google.com/macros/s/AKfycbzch2A0KVjMakeZ20gNtsUTSdK8s8yyBvWqPgPTXrQbi6s8O8Tc4YFToVZ9mFqHoVY1/exec"
  }

  /*
  RSVP OPTIONS:

  1) Custom form with Formspree (recommended for GitHub Pages):
     - Create a free Formspree form, get endpoint like: https://formspree.io/f/XXXXXXX
     - Then set:

  rsvp: {
    provider: "formspree",
    endpoint: "https://formspree.io/f/XXXXXXX"
  }

  2) Google Form embed (super stable, less “custom”):
     - Create Google Form
     - Copy "Send" -> "< > Embed HTML" -> use the iframe URL
     - Then set:

  rsvp: {
    provider: "google",
    googleEmbedUrl: "https://docs.google.com/forms/d/e/....../viewform?embedded=true"
  }
  */
};
