import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dry Matter Analysis Calculator",
  description:
    "Convert guaranteed analysis of cat and dog food to dry matter basis and find the protein, fat, fiber, ash, and carbohydrate percentages.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
