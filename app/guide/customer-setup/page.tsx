import Link from "next/link"
import {
    ArrowLeft,
    ExternalLink,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Eye,
    HandHeart,
    Star,
    Camera,
    MessageSquare,
    Users,
} from "lucide-react"
import styles from "../guide.module.css"
import { guidePhases } from "../GuidePhases"
import Image from "next/image"
import Footer from "../Footer";
import NavigationFooter from "../NavigationFooter";

export default function CustomerSetup() {
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
                        <span className={styles.breadcrumbCurrent}>Customer Setup</span>
                    </div>
                    <h1 className={styles.pageTitle}>Customer Setup</h1>
                    <p className={styles.pageSubtitle}>
                        <b>For the dealership representative</b>
                        <br />
                        Guide your customer through the initial setup and create an exceptional experience.
                    </p>
                </div>

                {/* Goals Section */}
                <div className={styles.goalsSection}>
                    <h2 className={styles.sectionTitle}>Your Three Key Objectives</h2>
                    <div className={styles.goalsGrid}>
                        <div className={styles.goalCard}>
                            <div className={styles.goalIcon}>
                                <Star className={styles.goalIconSvg} />
                            </div>
                            <h3 className={styles.goalTitle}>Deliver Excellence</h3>
                            <p className={styles.goalDescription}>
                                Create a best-in-class experience by showing enthusiasm and curiosity about the product. Use your sales
                                skills with Chimera's magical technology to create an unforgettable moment.
                            </p>
                        </div>
                        <div className={styles.goalCard}>
                            <div className={styles.goalIcon}>
                                <Camera className={styles.goalIconSvg} />
                            </div>
                            <h3 className={styles.goalTitle}>Build the Brand</h3>
                            <p className={styles.goalDescription}>
                                Encourage customers and their companions to take photos wearing the Vision Pro and share on social
                                media. Emphasize the exclusivity of this experience available only at select dealerships worldwide.
                            </p>
                        </div>
                        <div className={styles.goalCard}>
                            <div className={styles.goalIcon}>
                                <MessageSquare className={styles.goalIconSvg} />
                            </div>
                            <h3 className={styles.goalTitle}>Gather Insights</h3>
                            <p className={styles.goalDescription}>
                                Observe customer behaviors, note pain points, and submit feedback after each configuration session. This
                                helps us continuously improve the experience for future customers.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.stepsContainer}>
                    {/* Step 1 */}
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>1</div>
                            <h2 className={styles.stepTitle}>Initial Alignment</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>
                                Help the customer complete the initial alignment process when prompted.
                            </p>
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>When prompted, instruct the customer to "Press and Hold to Align."</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>
                                        Guide them to locate the <strong>Digital Crown</strong> (top-right dial). Have them press and hold
                                        until a checkmark appears, then release.
                                    </span>
                                </div>
                            </div>

                            <div className={styles.videoEmbed}>
                                <h4 className={styles.videoTitle}>Apple Vision Pro Initial Alignment Process</h4>
                                <div className={styles.videoWrapper}>
                                    <iframe
                                        width="560"
                                        height="315"
                                        src="https://www.youtube.com/embed/dPEUqc7h0Ok?si=RocB_7HSfBEaI7Kq"
                                        title="Apple Vision Pro Initial Alignment Process"
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
                            <h2 className={styles.stepTitle}>Introduce Basic Gestures</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>
                                Ask the customer to watch the intro video on how to use Apple Vision Pro. If they skip it, explain these
                                essential gestures:
                            </p>

                            <div className={styles.gesturesList}>
                                <div className={styles.gestureItem}>
                                    <Eye className={styles.gestureIcon} />
                                    <div className={styles.gestureText}>
                                        <strong>Look to browse</strong> — Your eyes guide the system, like moving a mouse on a computer.
                                    </div>
                                </div>
                                <div className={styles.gestureItem}>
                                    <HandHeart className={styles.gestureIcon} />
                                    <div className={styles.gestureText}>
                                        <strong>Pinch to select</strong> — Bring your thumb and index finger together, like clicking a
                                        mouse.
                                    </div>
                                </div>
                                <div className={styles.gestureItem}>
                                    <ArrowRight className={styles.gestureIcon} />
                                    <div className={styles.gestureText}>
                                        <strong>Flick to scroll</strong> — Use a quick flicking motion to navigate through content.
                                    </div>
                                </div>
                            </div>

                            <div className={styles.linkBox}>
                                <div className={styles.linkContent}>
                                    <ExternalLink className={styles.linkIcon} />
                                    <div className={styles.linkText}>
                                        <span className={styles.linkLabel}>Complete gesture guide:</span>
                                        <a
                                            href="https://support.apple.com/guide/apple-vision-pro/basic-gestures-and-controls-tan1e2a29e00/visionos"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.linkUrl}
                                        >
                                            Apple Vision Pro Basic Gestures and Controls
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>3</div>
                            <h2 className={styles.stepTitle}>Eye and Hand Calibration</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>
                                After the intro video, Vision Pro will guide the customer through eye and hand calibration.
                            </p>

                            <div className={styles.videoEmbed}>
                                <h4 className={styles.videoTitle}>Apple Vision Pro Eye and Hand Calibration</h4>
                                <div className={styles.videoWrapper}>
                                    <iframe
                                        width="560"
                                        height="315"
                                        src="https://www.youtube.com/embed/gBjnRxCGG1g?si=OnnF0Lh9ZRdRRT4Z"
                                        title="Apple Vision Pro Eye and Hand Calibration"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                        className={styles.videoIframe}
                                    ></iframe>
                                </div>
                            </div>

                            <div className={styles.calibrationSteps}>
                                <div className={styles.calibrationStep}>
                                    <h4 className={styles.calibrationTitle}>Hand Calibration</h4>
                                    <div className={styles.infoList}>
                                        <div className={styles.infoItem}>
                                            <CheckCircle className={styles.infoIcon} />
                                            <span>
                                                Instruct the customer to place their hands briefly in front of them as directed by the system.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.calibrationStep}>
                                    <h4 className={styles.calibrationTitle}>Eye Calibration</h4>
                                    <div className={styles.infoList}>
                                        <div className={styles.infoItem}>
                                            <CheckCircle className={styles.infoIcon} />
                                            <span>Guide them to look at each circle that appears and pinch their fingers to confirm.</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <CheckCircle className={styles.infoIcon} />
                                            <span>This is a 3-step process that ensures accurate eye tracking.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>4</div>
                            <h2 className={styles.stepTitle}>Skip Profile Saving</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>
                                After calibration is complete, help the customer skip the profile saving step.
                            </p>
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>
                                        Instruct them to look at <strong>"Continue without saving"</strong> and pinch their fingers.
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>
                                        Then have them select <strong>"Continue"</strong> to proceed.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className={styles.step}>
                        <div className={styles.stepHeader}>
                            <div className={styles.stepNumber}>5</div>
                            <h2 className={styles.stepTitle}>Launch Chimera App</h2>
                        </div>
                        <div className={styles.stepContent}>
                            <p className={styles.stepDescription}>Guide the customer to access and launch the Chimera application.</p>
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>The customer should now see the Vision Pro home screen with all apps.</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <AlertCircle className={styles.infoIcon} />
                                    <span>
                                        <strong>Note:</strong> If the home screen isn't visible, have them press the{" "}
                                        <strong>Digital Crown</strong> once to display the app icons.
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <CheckCircle className={styles.infoIcon} />
                                    <span>
                                        Instruct them to look at the <strong>Chimera app</strong> and pinch their fingers to launch it.
                                    </span>
                                </div>
                            </div>

                            <div className={styles.screenshotPlaceholder}>
                                <div className={styles.placeholderContent}>
                                    <Image
                                        src="/vision-pro-customer-home-screen.png"
                                        alt="The customer will see the Vision Pro home screen with various app icons. Guide them to locate and
                  select the Chimera app."
                                        width={500}
                                        height={300}
                                        className={styles.placeholderImage}
                                    />
                                    <p className={styles.placeholderText}>The customer will see the Vision Pro home screen with various app icons. Guide them to locate and
                                    select the Chimera app.</p>
                                </div>
                            </div>

                            <div className={styles.finalStep}>
                                <div className={styles.finalStepContent}>
                                    <Users className={styles.handingOverIcon} />
                                    <h4 className={styles.finalStepTitle}>Ready to Begin Configuration</h4>
                                    <p className={styles.finalStepText}>
                                        The Chimera app will now start, and the customer is ready to begin their immersive vehicle
                                        configuration experience. You can monitor their progress through the mirrored display.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NavigationFooter currentHref="/guide/customer-setup" />
            </div>

            <Footer />
        </div>
    )
}
