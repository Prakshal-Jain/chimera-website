import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Phone, Mail } from "lucide-react"
import styles from "./guide.module.css"
import { guidePhases } from "./GuidePhases"

export default function Guide() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft className={styles.backIcon} />
                    Back to Home
                </Link>

                <div className={styles.header}>
                    <div className={styles.logoContainer}>
                        <Image src="/chimera-logo.png" alt="Chimera Logo" width={200} height={67} className={styles.logo} />
                    </div>
                    <h1 className={styles.title}>Dealership Guide</h1>
                    <p className={styles.subtitle}>
                        Please read this guide to onboard new representatives and refer back to it as needed.
                    </p>
                </div>

                <div className={styles.timeline}>
                    {guidePhases.map((phase, index) => (
                        <div key={phase.id} className={styles.timelineItem}>
                            <div className={styles.timelineMarker}>
                                <div className={styles.markerDot}>
                                    <span className={styles.phaseNumber}>{phase.id}</span>
                                </div>
                                {index < guidePhases.length - 1 && <div className={styles.timelineLine} />}
                            </div>

                            <div className={styles.timelineContent}>
                                <Link href={phase.href} className={styles.phaseLink}>
                                    <div className={styles.phaseCard}>
                                        <div className={styles.phaseHeader}>
                                            <h3 className={styles.phaseTitle}>{phase.title}</h3>
                                            <ArrowRight className={styles.arrowIcon} />
                                        </div>
                                        <p className={styles.phaseDescription}>{phase.description}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.helpSection}>
                    <div className={styles.helpCard}>
                        <h3 className={styles.helpTitle}>Need Help?</h3>
                        <div className={styles.contactOptions}>
                            <a href="mailto:prakshaljain422@gmail.com" className={styles.contactButton}>
                                <Mail className={styles.contactIcon} />
                                Email Founder
                            </a>
                            <a href="tel:7167300312" className={styles.contactButtonPassive}>
                                <Phone className={styles.contactIcon} />
                                Call Founder: (716) 730-0312
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <footer className={styles.footer}>
                <p className={styles.footerText}>© {new Date().getFullYear()} Chimera Inc. All rights reserved.</p>
            </footer>
        </div>
    )
}
