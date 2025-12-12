import "./globals.css";
import { AppProviders } from "./providers";

export const metadata = {
  title: "JuriLingo",
  description: "JuriLingo is a legal learning platform for law students.",
  icons: {
    icon: "/logonav.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
