import type {Metadata} from "next";
import {Poppins, Playfair_Display} from "next/font/google";
import "./globals.css";
import {Provider} from "@/Context/ApiContext";
import Header from "./_elements/Header";
// import {UserProvider} from "@/Context/UserContext";



const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // add whichever weights you want
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // choose weights you need
});

export const metadata: Metadata = {
  title: "Kama Bistro",
  description: "Kama - description",
  icons: {
    icon: "/favicon.png", // path from /public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${poppins.variable} antialiased p-0`}
      >
        <Provider>
          {/* <UserProvider> */}
            {children}
            {/* </UserProvider> */}
        </Provider>
      </body>
    </html>
  );
}
