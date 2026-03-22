import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Architecture from "@/components/Architecture";
import LiveDemo from "@/components/LiveDemo";
import Dashboard from "@/components/Dashboard";
import FraudNetwork from "@/components/FraudNetwork";
import AIModels from "@/components/AIModels";
import ExplainableAI from "@/components/ExplainableAI";
import FuturePrediction from "@/components/FuturePrediction";
import Alerts from "@/components/Alerts";
import ModelMetrics from "@/components/ModelMetrics";
import About from "@/components/About";
import Team from "@/components/Team";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <Navbar />
    <Hero />
    <Features />
    <Architecture />
    <LiveDemo />
    <Dashboard />
    <FraudNetwork />
    <AIModels />
    <ExplainableAI />
    <FuturePrediction />
    <Alerts />
    <ModelMetrics />
    <About />
    <Team />
    <Footer />
  </div>
);

export default Index;

