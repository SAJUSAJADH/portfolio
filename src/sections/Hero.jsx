import HeroText from "../components/HeroText";
import Background from "../components/ParallaxBackground";

const Hero = () => {
  return (
    <section className="flex items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space">
      <HeroText />
      <Background />
    </section>
  );
};


export default Hero;
