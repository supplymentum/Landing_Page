import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
            <Header />

            <main className="flex-1 w-full">
                {children}
            </main>

            <Footer />
        </div>
    );
}