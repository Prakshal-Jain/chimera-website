import styles from "./home.module.css";
import Image from "next/image";
import GlassButton from "./GlassButton";

export default function Mission() {
    return (
        <div className={styles.content}>
            <h1>What Are You Missing Out On?</h1>

            <div className={styles.horizontalLayout}>
                <div className={styles.leftTextAlighn}>
                    <p>
                        Even in 2025, dealerships rely on 2D configurators on outdated monitor screens with low-resolution displays and poor color accuracy to configure cars that fall short of capturing real-world aesthetics, leading to frustration, decision fatigue, inaccurate configurations, repeated dealership visits, and costly order changes. There are over ~792,720 high-end car sales every year in US alone. 85-98% of high-end car buyers personalize their cars. 38-45% of these car buyers back-out, reconfigure, or cancel their orders due to under-confidence in their configuration choices.
                    </p>
                    <p>
                    Chimera solves these issues by delivering a fully immersive configurator with true-to-life colors, lighting, materials, and environments—accessible through the standardized Apple Vision Pro AR/VR headset before manufacturing even begins (often years in advance). Buyers can experience their dream cars in life-size scale, eliminating guesswork and increasing confidence in final orders.
                    </p>
                </div>

                <div className={styles.videoImageContainer}>
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
                            Market Research Podcast explaining dealership operational financial losses.
                        </h3>
                    </a>
                </div>
            </div>

            <GlassButton label="Onboard your Dealership" href="https://docs.google.com/forms/d/e/1FAIpQLSfb2TknAi6i4pGRdb4w_kinUkgvPdKfKfAhqSRJ4V4YmXUugg/viewform?usp=dialog" />


            {/* <div className={styles.comparisonView}>
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
            </div> */}


        </div>
    )
}