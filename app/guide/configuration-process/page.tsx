import Link from "next/link";
import styles from "../guide.module.css";
import { ArrowLeft } from "lucide-react";
import { guidePhases } from "../GuidePhases"
import Footer from "../Footer";
import NavigationFooter from "../NavigationFooter";

export default function GuidingTheExperience() {
    const currentIndex = guidePhases.findIndex((phase) => phase.href === "/guide/customer-setup")
    const nextPhase = currentIndex < guidePhases.length - 1 ? guidePhases[currentIndex + 1] : null

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Link href="/guide" className={styles.backLink}>
                    <ArrowLeft className={styles.backIcon} />
                    Back to Guide
                </Link>

                <div className={styles.pageHeader}>
                    <div className={styles.breadcrumb}>
                        <Link href="/guide" className={styles.breadcrumbLink}>
                            Guide
                        </Link>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbCurrent}>Guiding the Experience</span>
                    </div>
                    <h1 className={styles.pageTitle}>Guiding the Experience</h1>
                    <p className={styles.pageSubtitle}>
                        <b>For the dealership representative</b>
                        <br />
                        Guide your customer through the configuration process.
                    </p>
                </div>

                <h2 className={styles.stepTitle}>Coming Soon</h2>
                
                <NavigationFooter currentHref="/guide/configuration-process" />
            </div>

            <Footer />
        </div>
    )
}
