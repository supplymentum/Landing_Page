import type { Metadata } from "next";
import AdminShell from "@/components/cms/AdminShell";

export const metadata: Metadata = {
    title: "CMS | SupplyMentum UNI",
    description: "Panel administrativo de SupplyMentum UNI.",
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <AdminShell>{children}</AdminShell>;
}