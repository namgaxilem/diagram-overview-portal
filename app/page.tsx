import Header from "./components/Header";
import Hero from "./components/Hero";
import SystemArchitecture from "./components/SystemArchitecture";
import Features from "./components/Features";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <SystemArchitecture />
      <Features />
      <Footer />
    </main>
  );
}
