import Image from "next/image";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div>
      <main className={styles.heroImage}>
        <div className={styles.logo}>
          <Image
            alt="Chimera Logo"
            src='chimera-logo-2.png'
            width={0}
            height={0}
            layout='responsive'
          />
        </div>

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

        <div className={styles.comparisonView}>
          <a href="https://youtu.be/2nMCMTNaC5w?si=DsMDX8lr9oFGH8Tm" target="_blank">
              <Image
                alt="Chimera Logo"
                src='present.png'
                width={0}
                height={0}
                layout='responsive'
                className={styles.comparisonImage}
              />
              <h3 className={styles.comparisonDetail}>
                How it&apos;s done today
              </h3>
          </a>

          <a href="https://youtu.be/LGS8Ls_4rTg?si=QwAF5IR0vGNHiRVp" target="_blank">
            <Image
              alt="Chimera Logo"
              src='future.png'
              width={0}
              height={0}
              layout='responsive'
              className={styles.comparisonImage}
            />
            <h3 className={styles.comparisonDetail}>
              How it should be
            </h3>
          </a>
        </div>
      </main>
      <div className={styles.content}>
      </div>
    </div>
  );
}
