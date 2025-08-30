import Link from "next/link";
import { ArrowLeft, CheckCircle, ArrowRight, Mail, Share2, Users, Camera } from "lucide-react";
import styles from "../guide.module.css";
import { guidePhases } from "../GuidePhases";
import Footer from "../Footer";
import NavigationFooter from "../NavigationFooter";

export default function AfterAppointment() {

    const currentIndex = guidePhases.findIndex((phase) => phase.href === "/guide/after-appointment");
    const nextPhase = currentIndex < guidePhases.length - 1 ? guidePhases[currentIndex + 1] : null;

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
                        <span className={styles.breadcrumbCurrent}>After the Appointment</span>
                    </div>
                    <h1 className={styles.pageTitle}>After the Appointment</h1>
                    <p className={styles.pageSubtitle}>
                        <b>For the dealership representative</b>
                        <br />
                        Follow-up actions to maximize the impact of your customer's Chimera experience.
                    </p>
                </div>

                <div className={styles.stepsContainer}>
                    {/* Step 1 */}
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>1</div>
                            <h2 className={styles.stepTitle}>Confirmation Email & AR Experience</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>
                                Remind customers to check their inbox for the confirmation email containing their personalized AR view
                                link.
                            </p>

                            <div className={styles.linkBox}>
                                <div className={styles.linkContent}>
                                    <Mail className={styles.linkIcon} />
                                    <div className={styles.linkText}>
                                        <span className={styles.linkUrl}>AR Experience Features:</span>
                                        <div className={styles.noteText}>
                                            The email contains a link that customers can open on their iOS devices to place their exact
                                            configured vehicle in the real world.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>
                                        <strong>Home garage</strong> — Visualize the car in their personal space
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>
                                        <strong>Driveway</strong> — See how it fits in their current parking area
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>
                                        <strong>Office parking lot</strong> — Preview their daily commute companion
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>
                                        <strong>Nearby street</strong> — Experience the vehicle in any location
                                    </span>
                                </div>
                            </div>

                            <div className={styles.importantNote}>
                                <CheckCircle className={styles.noteIcon} />
                                <div className={styles.noteContent}>
                                    <h4 className={styles.noteTitle}>Key Benefits</h4>
                                    <p className={styles.noteText}>
                                        The car dimensions are precise and accurate. No app download required — it <strong>JUST WORKS!</strong>
                                        Customers can share this AR view with friends and family, allowing children to dream about their
                                        parents' future car.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.videoEmbed}>
                                <h4 className={styles.videoTitle}>AR Experience Demonstration</h4>
                                <div className={styles.videoWrapper}>
                                    <iframe
                                        width="560"
                                        height="315"
                                        src="https://www.youtube.com/embed/HyAo-M9UpWc?si=FG8d0IhPZaNoEaF3"
                                        title="AR Experience Demonstration"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                        className={styles.videoIframe}
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>2</div>
                            <h2 className={styles.stepTitle}>Social Media Engagement</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>
                                Encourage customers to share their experience and AR vehicle views on social media platforms.
                            </p>

                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <Camera className={styles.infoIcon} />
                                    <span>
                                        Remind them to take photos of themselves wearing the Apple Vision Pro during the experience
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <Share2 className={styles.infoIcon} />
                                    <span>Encourage sharing AR vehicle photos in their real-world environments</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>Suggest tagging your dealership and @ChimeraAR to amplify reach</span>
                                </div>
                            </div>

                            <div className={styles.linkBox}>
                                <div className={styles.linkContent}>
                                    <Share2 className={styles.linkIcon} />
                                    <div className={styles.linkText}>
                                        <span className={styles.linkLabel}>Social Media Benefits:</span>
                                        <div className={styles.noteText}>
                                            User-generated content showcasing the Chimera experience helps build brand awareness and
                                            demonstrates the cutting-edge technology available at your dealership.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>3</div>
                            <h2 className={styles.stepTitle}>Share the Chimera Vision</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>
                                Engage with high-net-worth customers about the broader Chimera program and vision for the future of
                                automotive retail.
                            </p>

                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <Users className={styles.infoIcon} />
                                    <span>
                                        <strong>Network Expansion</strong> — Connect with influential customers who can introduce Chimera to
                                        other premium dealerships
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>
                                        <strong>Industry Vision</strong> — Share how Chimera is revolutionizing the automotive configuration
                                        experience
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <Share2 className={styles.infoIcon} />
                                    <span>
                                        <strong>Founder Story</strong> — Discuss the company's mission and leadership for interested
                                        investors or industry connections
                                    </span>
                                </div>
                            </div>

                            <div className={styles.importantNote}>
                                <Users className={styles.noteIcon} />
                                <div className={styles.noteContent}>
                                    <h4 className={styles.noteTitle}>Strategic Opportunity</h4>
                                    <p className={styles.noteText}>
                                        Your customers represent valuable networking opportunities. Their connections in luxury markets,
                                        automotive industry, and investment circles can help expand Chimera's reach to the right partners
                                        and stakeholders.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>4</div>
                            <h2 className={styles.stepTitle}>Document the Experience</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>
                                Capture photos and feedback from the session to help improve the Chimera experience and support
                                marketing efforts.
                            </p>

                            <div className={styles.linkBox}>
                                <div className={styles.linkContent}>
                                    <Camera className={styles.linkIcon} />
                                    <div className={styles.linkText}>
                                        <span className={styles.linkLabel}>Photo Submission:</span>
                                        <a
                                            href="https://docs.google.com/forms/d/e/1FAIpQLSci4MQ8ih9eEekg3v6YEaniuenGM8Zm2poU8CUKuazxe0ol9A/viewform?usp=dialog"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.linkUrl}
                                        >
                                            Upload customer photos and feedback here
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <Camera className={styles.infoIcon} />
                                    <span>Take photos of customers using the Apple Vision Pro (with permission)</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>Capture candid moments of excitement and engagement during the experience</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <Share2 className={styles.infoIcon} />
                                    <span>Document any notable customer feedback or suggestions for improvement</span>
                                </div>
                            </div>

                            <div className={styles.finalStep}>
                                <div className={styles.finalStepContent}>
                                    <CheckCircle className={styles.handingOverIcon} />
                                    <h4 className={styles.finalStepTitle}>Experience Complete</h4>
                                    <p className={styles.finalStepText}>
                                        You've successfully delivered a premium Chimera experience. The customer now has access to their
                                        personalized AR vehicle view and can continue exploring their configuration at home.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NavigationFooter currentHref="/guide/after-appointment" />
            </div>

            <Footer />
        </div>
    );
}
