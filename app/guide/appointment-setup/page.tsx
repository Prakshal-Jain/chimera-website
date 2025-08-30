import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import styles from "../guide.module.css"
import { guidePhases } from "../GuidePhases"
import Footer from "../Footer";
import NavigationFooter from "../NavigationFooter";

export default function AppointmentSetup() {
    const currentIndex = guidePhases.findIndex((phase) => phase.href === "/guide/appointment-setup")
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
                        <span className={styles.breadcrumbCurrent}>Appointment Setup</span>
                    </div>
                    <h1 className={styles.pageTitle}>Appointment Setup</h1>
                    <p className={styles.pageSubtitle}>
                        Learn how to properly set up customer appointments and manage the booking process for Chimera experiences.
                    </p>
                </div>

                <div className={styles.stepsContainer}>
                    {/* Step 1 */}
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>1</div>
                            <h2 className={styles.stepTitle}>Open the Appointment Page</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>
                                Navigate to the Chimera appointment booking page to begin the process.
                            </p>
                            <div className={styles.linkBox}>
                                <div className={styles.linkContent}>
                                    <ExternalLink className={styles.linkIcon} />
                                    <div className={styles.linkText}>
                                        <span className={styles.linkLabel}>Go to:</span>
                                        <a
                                            href="https://chimeraauto.com/book_appointment"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.linkUrl}
                                        >
                                            https://chimeraauto.com/book_appointment
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.screenshotPlaceholder}>
                                <div className={styles.placeholderContent}>
                                    <Image
                                        src="/appointment-booking-form.png"
                                        alt="Appointment booking form screenshot"
                                        width={500}
                                        height={300}
                                        className={styles.placeholderImage}
                                    />
                                    <p className={styles.placeholderText}>Screenshot of the appointment form</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>2</div>
                            <h2 className={styles.stepTitle}>Fill Out the Form Accurately</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>
                                Enter all customer details precisely to ensure a smooth configuration experience.
                            </p>

                            <div className={styles.importantNote}>
                                <AlertCircle className={styles.noteIcon} />
                                <div className={styles.noteContent}>
                                    <h4 className={styles.noteTitle}>Important</h4>
                                    <p className={styles.noteText}>The customer's email address and password must be valid and active.</p>
                                </div>
                            </div>

                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>The confirmation code to begin their Apple Vision Pro configuration will be sent here.</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>
                                        A copy of their personalized configuration (spec sheet) will also be delivered to their email after
                                        completion.
                                    </span>
                                </div>
                            </div>

                            <div className={styles.screenshotPlaceholder}>
                                <div className={styles.placeholderContent}>
                                    <Image
                                        src="/email_confirmation_customer.png"
                                        alt="Email confirmation screenshot for the customer"
                                        width={500}
                                        height={300}
                                        className={styles.placeholderImage}
                                    />
                                    <p className={styles.placeholderText}>Screenshot of the appointment form</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>3</div>
                            <h2 className={styles.stepTitle}>Verify Email Confirmation</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>
                                Ensure both the customer and dealership receive the necessary confirmation emails.
                            </p>

                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>Ask the customer to confirm they received the email.</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>
                                        As the dealership representative, you will also receive a copy of the confirmation email containing
                                        the configuration code.
                                    </span>
                                </div>
                            </div>

                            <div className={styles.screenshotPlaceholder}>
                                <div className={styles.placeholderContent}>
                                    <Image
                                        src="/email_confirmation_dealership.png"
                                        alt="Email confirmation screenshot for the dealership representative"
                                        width={500}
                                        height={300}
                                        className={styles.placeholderImage}
                                    />
                                    <p className={styles.placeholderText}>Screenshot of the appointment form</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>4</div>
                            <h2 className={styles.stepTitle}>Start the Configuration</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>
                                Launch the immersive Chimera experience using the provided confirmation code.
                            </p>

                            <div className={styles.finalStep}>
                                <div className={styles.finalStepContent}>
                                    <h4 className={styles.finalStepTitle}>Ready to Begin</h4>
                                    <p className={styles.finalStepText}>
                                        Use the provided confirmation code to launch and start the Chimera configuration experience on the
                                        Apple Vision Pro.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.screenshotPlaceholder}>
                                <div className={styles.placeholderContent}>
                                    <Image
                                        src="/chimera_app_enter_confirmation_code.png"
                                        alt="Chimera App Enter Confirmation Code Screen"
                                        width={500}
                                        height={300}
                                        className={styles.placeholderImage}
                                    />
                                    <p className={styles.placeholderText}>Screenshot of the appointment form</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NavigationFooter currentHref="/guide/appointment-setup" />
            </div>

            <Footer />
        </div>
    )
}
