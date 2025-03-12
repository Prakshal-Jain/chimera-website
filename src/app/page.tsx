import Image from "next/image";
import styles from "./home.module.css";
import Mission from "./Mission";
import DemoPage from "./DemoPage";
import GlassButton from "./GlassButton";
import Partners from "./Partners";
import Footer from "./Footer";

export default function Home() {
  return (
    <div>
      <main className={styles.heroImage}>
        <div className={styles.chimera}>
          <Image
            alt="Chimera Name"
            src='chimera-logo.png'
            width={0}
            height={0}
            layout='responsive'
          />
        </div>
        
        <h1 className={styles.tagline}>Hyper-Realistic AR/VR Car Configurator for Luxury Dealerships & Manufacturers</h1>
        <h2 className={styles.tagline}>We make the buying experience as exceptional as your car</h2>

        <div className={styles.horizontalLayout}>
          <GlassButton label="Onboard your Dealership" href="https://docs.google.com/forms/d/e/1FAIpQLSfb2TknAi6i4pGRdb4w_kinUkgvPdKfKfAhqSRJ4V4YmXUugg/viewform?usp=dialog" />
          <GlassButton label="Experience on Vision Pro" href="/book_appointment" target='_self' />
        </div>
      </main>

      <Mission />

      <Partners />

      <DemoPage />

      <Footer />
    </div>
  );
}
