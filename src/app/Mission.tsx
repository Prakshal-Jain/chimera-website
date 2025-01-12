import styles from "./home.module.css";
import Image from "next/image";

export default function Mission() {
    return (
        <div className={styles.content}>
            <h2>Our Mission</h2>
            <div>
                After interviewing over 10+ dealerships and intensive research, we realized that the experience of buying a supercar isn&apos;t luxurious and the customers deserves better.
            </div>
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
        </div>
    )
}