import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Provider } from "@/Context/ApiContext";

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

// export const metadata: Metadata = {
//   title: "Kama Bistro | Modern Indian Restaurant",
//   description: `Discover bold, fresh modern Indian cuisine and restaurant at Kama Bistro in downtown La Grange, Wicker Park and West Loop IL. Enjoy authentic flavors, unique dishes, and a memorable dining experience.`,
//   icons: {
//     icon: "/favicon.png",
//   },
// };
export const metadata: Metadata = {
  title: "Kama Bistro | Modern Indian Restaurant in Chicago, IL",
  description:
    "Discover bold, fresh modern Indian cuisine at Kama Bistro, with locations in La Grange, Wicker Park, and West Loop. Enjoy authentic flavors, unique dishes, and a memorable dining experience.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Kama Bistro | Modern Indian Restaurant in Chicago, IL",
    description:
      "Bold, fresh modern Indian cuisine in La Grange, Wicker Park, and West Loop. Join us for authentic flavors and a memorable dining experience.",
    url: "https://kamabistro.com",
    siteName: "Kama Bistro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kama Bistro modern Indian cuisine",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kama Bistro | Modern Indian Restaurant",
    description:
      "Discover fresh, bold Indian cuisine in La Grange, Wicker Park, and West Loop. Experience authentic flavors and unique dishes.",
    images: ["/og-image.jpg"],
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
        className={`${playfair.variable} ${poppins.variable} antialiased p-0 overflow-x-hidden overflow-y-auto scroll-one`}
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
