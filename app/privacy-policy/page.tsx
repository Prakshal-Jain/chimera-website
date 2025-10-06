"use client"

import Link from "next/link"
import styles from "./privacy-policy.module.css"

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <Link href="/" className={styles.logoLink}>
                    <img src="/chimera-logo.png" alt="Chimera" className={styles.logo} />
                </Link>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.content}>
                    <h1 className={styles.title}>Privacy Policy</h1>
                    <p className={styles.lastUpdated}>Last updated: December 28, 2024</p>

                    <div className={styles.section}>
                        <p className={styles.intro}>
                            At Chimera, we are committed to protecting your privacy and ensuring the security of your personal
                            information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our
                            immersive automotive visualization platform and related services.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
                        <p className={styles.text}>
                            We only collect vehicle configuration choices (eg. color options, rims, interior, etc.) that you make during the configuration session in the app. No personal information is collected.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>3. Information Sharing and Disclosure</h2>
                        <p className={styles.text}>
                            We do not sell, trade, or rent your information to third parties.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>4. Data Security</h2>
                        <p className={styles.text}>
                            We implement industry-standard security measures to protect your information:
                        </p>
                        <ul className={styles.list}>
                            <li>Encryption of data in transit and at rest</li>
                            <li>Secure server infrastructure and regular security audits</li>
                            <li>Access controls and authentication protocols</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>6. Your Rights and Choices</h2>
                        <p className={styles.text}>You have the following rights regarding your information:</p>
                        <ul className={styles.list}>
                            <li>
                                <strong>Access:</strong> Request a copy of the information we hold about you
                            </li>
                            <li>
                                <strong>Correction:</strong> Request correction of inaccurate or incomplete information
                            </li>
                            <li>
                                <strong>Deletion:</strong> Request deletion of your information.
                            </li>
                            <li>
                                <strong>Portability:</strong> Request transfer of your data to another service provider
                            </li>
                            <li>
                                <strong>Opt-out:</strong> Unsubscribe from marketing communications at any time
                            </li>
                            <li>
                                <strong>Restriction:</strong> Request limitation of processing in certain circumstances
                            </li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>9. Children's Privacy</h2>
                        <p className={styles.text}>
                            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
                            information from children. If we become aware that we have collected information from a child, we will
                            take steps to delete such information promptly.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>10. Changes to This Privacy Policy</h2>
                        <p className={styles.text}>
                            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable
                            laws. We will notify you of any material changes by posting the updated policy on our website and updating
                            the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of
                            the updated policy.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>11. Contact Us</h2>
                        <p className={styles.text}>
                            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices,
                            please contact us:
                        </p>
                        <div className={styles.contactInfo}>
                            <p>
                                <strong>Chimera</strong>
                            </p>
                            <p>
                                Email:{" "}
                                <a href="mailto:privacy@chimera.com" className={styles.link}>
                                    privacy@chimera.com
                                </a>
                            </p>
                            <p>
                                Phone:{" "}
                                <a href="tel:+17167300312" className={styles.link}>
                                    +1 (716) 730-0312
                                </a>
                            </p>
                            <p>Address: 710 Lakeway Drive, Suite 200, Sunnyvale, CA 94085
                            </p>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>12. Governing Law</h2>
                        <p className={styles.text}>
                            This Privacy Policy is governed by and construed in accordance with the laws of the State of California, United States, without
                            regard to its conflict of law principles. Any disputes arising under this policy shall be subject to the
                            exclusive jurisdiction of the courts in Santa Clara County, California, United States.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <Link href="/" className={styles.footerLogo}>
                        <img src="/chimera-logo.png" alt="Chimera" className={styles.footerLogoImg} />
                    </Link>
                    <div className={styles.footerLinks}>
                        <Link href="/contact" className={styles.footerLink}>
                            Contact
                        </Link>
                        <Link href="/privacy-policy" className={styles.footerLink}>
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className={styles.footerLink}>
                            Terms of Service
                        </Link>
                    </div>
                    <p className={styles.copyright}>© 2025 Chimera. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
