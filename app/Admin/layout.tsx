import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className="flex min-h-screen bg-gray-100">
      <div className="flex-1">
        <main className="">{children}</main>
      </div>
    </body>
  );
}
