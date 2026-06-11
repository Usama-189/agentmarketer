import "./globals.css";

export const metadata = {
  title: "AgentMarketer — your AI team that gets you found everywhere",
  description:
    "A team of AI agents that get your business found on Google and AI search, answer customers 24/7, and bring you new leads — automatically."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body bg-paper text-ink">{children}</body>
    </html>
  );
}
