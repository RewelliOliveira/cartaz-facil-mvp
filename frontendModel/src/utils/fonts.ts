export type GoogleFont = {
  label: string;
  value: string;
};

export const GOOGLE_FONTS: GoogleFont[] = [
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Oswald",
  "Inter",
  "Nunito",
  "Merriweather",
  "Playfair Display",
  "Roboto Condensed",
  "Bebas Neue",
  "Ubuntu",
  "DM Sans",
].map((font) => ({ label: font, value: font }));

const GOOGLE_FONT_LINK_ID = "cartaz-facil-google-font";

export function injectGoogleFont(fontFamily: string): void {
  if (typeof document === "undefined" || !fontFamily) return;

  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    fontFamily,
  ).replace(/%20/g, "+")}:wght@400;500;600;700&display=swap`;
  let link = document.getElementById(
    GOOGLE_FONT_LINK_ID,
  ) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.id = GOOGLE_FONT_LINK_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  if (link.href !== href) link.href = href;
}
