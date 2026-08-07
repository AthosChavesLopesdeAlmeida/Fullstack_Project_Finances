import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={cn("font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col min-w-full">{children}</body>
    </html>
  );
}
