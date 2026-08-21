export type FontItem = {
  label: string;
  value: string;
};

export const GOOGLE_FONTS: FontItem[] = [
  { label: "Montserrat", value: "Montserrat" },
  { label: "Roboto", value: "Roboto" },
  { label: "Open Sans", value: "Open Sans" },
  { label: "Lato", value: "Lato" },
  { label: "Inter", value: "Inter" },
  { label: "Oswald", value: "Oswald" },
  { label: "Poppins", value: "Poppins" },
];

export function injectGoogleFont(fontFamily: string): void {
  if (!fontFamily) return;
  const id = `google-font-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;600;700;800&display=swap`;
  document.head.appendChild(link);
}
