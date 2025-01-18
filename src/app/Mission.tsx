import styles from "./home.module.css";
import Image from "next/image";
import OnboardDealershipButton from "./OnboardDealershipButton";

export default function Mission() {
    return (
        <div className={styles.content}>
            <h1>What Are You Missing Out On?</h1>

            <div className={styles.horizontalLayout}>
                <div className={styles.leftTextAlighn}>
                    <p>
                        While nearly all supercar buyers seek personalization, <b>outdated and inaccurate customization tools</b> create significant challenges.
                    </p>

                    <div>
                        <h2>Impact on Customers</h2>
                        <p>
                            Customers find it difficult to visualize their ideal cars, resulting in <b>indecision, mismatched expectations, and cancellations</b>.
                        </p>
                    </div>

                    <div>
                        <h2>Loss for Dealerships</h2>
                        <p>
                            For dealerships, these inefficiencies lead to <b>financial losses, unsold inventory, and strained relationships</b>, highlighting the urgent need for advanced, immersive visualization solutions.
                        </p>
                    </div>
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

            <OnboardDealershipButton />


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