import Header from "../components/Header";

export default function Layout({ children, title, showBackButton }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title={title} showBackButton={showBackButton} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-80px)]">
        {children}
      </main>
    </div>
  );
}
