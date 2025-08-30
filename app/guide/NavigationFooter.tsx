import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./guide.module.css";
import { guidePhases } from "./GuidePhases";

export default function NavigationFooter({ currentHref }: { currentHref: string }) {
    const currentIndex = guidePhases.findIndex((phase) => phase.href === currentHref);
    const nextPhase = currentIndex < guidePhases.length - 1 ? guidePhases[currentIndex + 1] : null;
    const prevPhase = currentIndex > 0 ? guidePhases[currentIndex - 1] : null;

    return (
        <div className={styles.navigationFooter}>
            {prevPhase && (
                <Link href={prevPhase.href} className={styles.navButton}>
                    <ArrowLeft className={styles.navIcon} />
                    Previous: {prevPhase.title}
                </Link>
            )}
            {nextPhase && (
                <Link href={nextPhase.href} className={styles.nextButton}>
                    <div className={styles.nextSection}>
                        <span className={styles.nextLabel}>Next:</span>
                        <span className={styles.nextTitle}>{nextPhase.title}</span>
                    </div>
                    <ArrowRight className={styles.navIcon} />
                </Link>
            )}
        </div>
    );
}
