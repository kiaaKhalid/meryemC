import Navbar from "@/components/Navbar";
import HighTechHero from "@/components/home/hero"; // Assurez-vous que le composant de la V14 soit bien dans ce fichier
import Footer from "@/components/Footer";
import RiskSection from "@/components/home/RiskCard";
import AIAnalysisSection from "@/components/home/AIAnalysisSection";
import EnvironmentalVeille from "@/components/home/EnvironmentalVeille";
import WhyUsSection from "@/components/home/WhyUsSection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-bg-main">
      <Navbar />

      <div className="flex-grow">
        <HighTechHero />
        <RiskSection />
        <AIAnalysisSection />
        <EnvironmentalVeille />
        <WhyUsSection />
      </div>

      <Footer />
    </main>
  );
}