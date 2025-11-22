"use client"

import Image from "next/image"
import Link from "next/link"
import {
    ArrowRight,
    Mail,
    Phone,
    ExternalLink,
    TrendingUp,
    Building2,
    Plane,
    Ship,
    Watch,
    Diamond,
    Home,
    Car,
    Lock,
} from "lucide-react"
import styles from "./investors.module.css"

export default function InvestorsPage() {
    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link href="/" className={styles.logoLink}>
                        <Image src="/chimera-logo.png" alt="Chimera Logo" width={600} height={200} className={styles.logo} />
                    </Link>
                    <div className={styles.headerLabel}>For Investors</div>
                </div>
            </header>

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.heroLabel}>Our Mission</div>
                    <h1 className={styles.heroTitle}>Revolutionize How Luxury Assets are Bought and Sold</h1>

                    <a href="/pitch-deck.pdf" target="_blank" rel="noopener noreferrer" className={styles.pitchDeckButton}>
                        <span>View Pitch Deck</span>
                        <ExternalLink className={styles.buttonIcon} />
                    </a>
                </div>
            </section>

            {/* Contact Founders Section */}
            <section className={styles.contactSection}>
                <h2 className={styles.contactTitle}>Just text the founders</h2>
                <div className={styles.contactGrid}>
                    <a href="tel:7167300312" className={styles.contactCard}>
                        <Phone className={styles.contactIcon} />
                        <div>
                            <div className={styles.contactLabel}>PJ</div>
                            <div className={styles.contactValue}>(716) 730-0312</div>
                        </div>
                    </a>
                    <a href="mailto:neil.patel@chimeraauto.com" className={styles.contactCard}>
                        <Mail className={styles.contactIcon} />
                        <div>
                            <div className={styles.contactLabel}>Neil</div>
                            <div className={styles.contactValue}>neil.patel@chimeraauto.com</div>
                        </div>
                    </a>
                </div>
            </section>

            {/* Market Vision Section */}
            <section className={styles.visionSection}>
                <div className={styles.visionHeader}>
                    <TrendingUp className={styles.visionIcon} />
                    <h2 className={styles.visionTitle}>Universal Technology, Limitless Markets</h2>
                </div>

                <div className={styles.currentFocus}>
                    <div className={styles.focusLabel}>Currently Focused On</div>
                    <div className={styles.focusBadge}>
                        <Car className={styles.focusIcon} />
                        <span className={styles.focusText}>Automotive</span>
                    </div>
                </div>

                <div className={styles.expansionSection}>
                    <div className={styles.expansionLabel}>Expanding Into</div>
                    <div className={styles.marketGrid}>
                        <div className={styles.marketCard}>
                            <Building2 className={styles.marketIcon} />
                            <span className={styles.marketName}>Commercial Real Estate</span>
                        </div>
                        <div className={styles.marketCard}>
                            <Home className={styles.marketIcon} />
                            <span className={styles.marketName}>Custom Homes</span>
                        </div>
                        <div className={styles.marketCard}>
                            <Plane className={styles.marketIcon} />
                            <span className={styles.marketName}>Private Aviation</span>
                        </div>
                        <div className={styles.marketCard}>
                            <Ship className={styles.marketIcon} />
                            <span className={styles.marketName}>Yachts</span>
                        </div>
                        <div className={styles.marketCard}>
                            <Watch className={styles.marketIcon} />
                            <span className={styles.marketName}>Watches</span>
                        </div>
                        <div className={styles.marketCard}>
                            <Diamond className={styles.marketIcon} />
                            <span className={styles.marketName}>Fine Jewelry</span>
                        </div>
                    </div>
                </div>

                <div className={styles.patentSection}>
                    <div className={styles.patentBadge}>
                        <Lock className={styles.patentIcon} />
                        <div className={styles.patentText}>
                            <div className={styles.patentTitle}>Patented Technology</div>
                            <div className={styles.patentDescription}>
                                Universal technology that can expand and scale to all luxury market verticals
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Traction Image Section */}
            <section className={styles.tractionSection}>
                <h2 className={styles.tractionTitle}>Market Traction</h2>
                <div className={styles.tractionImageContainer}>
                    <Image
                        src="/chimera-market-traction.png"
                        alt="Chimera market traction showcasing exclusive events, pilot dealerships, and key advisors"
                        width={1600}
                        height={900}
                        className={styles.tractionImage}
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>Ready to Transform Luxury Commerce?</h2>
                <div className={styles.ctaButtons}>
                    <Link href="/contact" target="_blank" className={styles.ctaPrimary}>
                        <span>Get in Touch</span>
                        <ArrowRight className={styles.buttonIcon} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerLogoContainer}>
                        <Image src="/chimera-icon.png" alt="Chimera" width={60} height={60}/>
                    </div>
                    <p className={styles.footerCopyright}>© {new Date().getFullYear()} Chimera Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
