import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import TanstackProvider from "~/providers/TanstackProvider";
import { ThemeProvider } from "~/providers/ThemeProvider";
import { UserProvider } from "~/providers/user-provider";

export const metadata = {
  title: "ReceBee",
  description: "ReceBee is a finance manangement plataform.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <TanstackProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["light", "dark", "system"]}
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <body>{children}</body>
          </UserProvider>
        </ThemeProvider>
      </TanstackProvider>
    </html>
  );
}
