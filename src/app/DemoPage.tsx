import styles from "./demopage.module.css";
import Image from "next/image";

export default function DemoPage() {
    return (
        <div className={styles.sectionContainer}>
            <h1>Increasing your Profits</h1>
            <div className={styles.demoView}>
                <div className={styles.demoText}>
                    <h2>The Chimera Experience</h2>
                    <p>
                        Every customer at your dealership should have a <b>memorable experience</b>. When they encounter Chimera, they&apos;ll share it with friends and colleagues, giving your dealership a <b>competitive advantage</b>. This <b>word-of-mouth</b> generates <b>higher sales</b>, and customers are willing to pay a premium for a more exotic car-buying experience.
                    </p>
                </div>
                <a className={styles.demoVideoContainer} target="_blank" href="#">
                    <Image
                        alt="Chimera Logo"
                        src='chimera_clip.png'
                        width={0}
                        height={0}
                        layout='responsive'
                        className={styles.demoImage}
                    />
                    <p>Click to watch the demo video</p>
                </a>
            </div>
        </div>
    )
}