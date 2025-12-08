import "./globals.css";
import { AppProviders } from "./providers";

export const metadata = {
  title: "Jurilingo",
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
