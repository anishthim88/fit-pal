import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fit Pal — workouts that fit your week",
  description: "A simple, personal place to plan and keep track of your workouts.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
