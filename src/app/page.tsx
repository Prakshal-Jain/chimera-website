import Image from "next/image";
import styles from "./home.module.css";
import Mission from "./Mission";
import OnboardDealershipButton from "./OnboardDealershipButton";

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

        <h2 className={styles.tagline}>We make the buying experience as exceptional as your car</h2>

        <OnboardDealershipButton />
      </main>

      <Mission />
    </div>
  );
}
