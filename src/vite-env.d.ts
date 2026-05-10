/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script Web App URL that receives RSVP POSTs. See apps-script/README.md. */
  readonly VITE_RSVP_ENDPOINT?: string;
  /** When set to '1', useWishes returns sample wishes so the overlay can be previewed without a live backend. */
  readonly VITE_RSVP_MOCK?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
