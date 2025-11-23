import "./globals.css";

export const metadata = {
    title: "DAV Career Match",
    description: "Find your perfect career path",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
