import "./globals.css";

export const metadata = {
  title: "AgentMarketer — your business, found everywhere",
  description:
    "We build your website, answer your visitors with an AI receptionist, and keep you active on Google. You do nothing."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
