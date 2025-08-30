import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink, CheckCircle, AlertCircle, ArrowRight, Eye, HandHeart, Monitor } from "lucide-react"
import styles from "../guide.module.css"
import Footer from "../Footer"
import NavigationFooter from "../NavigationFooter"

export default function CustomerOnboarding() {
  // Define the guide phases to determine next page
  const guidePhases = [
    { title: "Appointment Setup", href: "/guide/appointment-setup" },
    { title: "Customer Onboarding", href: "/guide/customer-onboarding" },
    { title: "Customer Setup", href: "/guide/customer-setup" },
    { title: "Configuration Process", href: "/guide/configuration-process" },
    { title: "Troubleshooting", href: "/guide/troubleshooting" },
    { title: "Best Practices", href: "/guide/best-practices" },
  ]

  const currentIndex = guidePhases.findIndex((phase) => phase.href === "/guide/customer-onboarding")
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
            <span className={styles.breadcrumbCurrent}>Preparing Apple Vision Pro for the Customer</span>
          </div>
          <h1 className={styles.pageTitle}>Preparing Apple Vision Pro for the Customer</h1>
          <p className={styles.pageSubtitle}>
            <b>For the dealership representative</b>
            <br />
            Follow these steps to prepare the Apple Vision Pro for your customer's Chimera experience.
          </p>
        </div>

        <div className={styles.stepsContainer}>
          {/* Step 1 */}
          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>1</div>
              <h2 className={styles.stepTitle}>Connect the Battery</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>Attach the battery pack to the Apple Vision Pro.</p>

              <div className={styles.videoEmbed}>
                <h4 className={styles.videoTitle}>How to attach the power cable and turn on your Apple Vision Pro</h4>
                <div className={styles.videoWrapper}>
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/7NUZg2cQ3rg?si=k4yYOZcW-ifQoQ7q"
                    title="Battery Connection Guide"
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
              <h2 className={styles.stepTitle}>Power On & Wear the Device</h2>
            </div>
            <div className={styles.stepContent}>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <CheckCircle className={styles.infoIcon} />
                  <span>Wait 1–2 minutes for the system to boot.</span>
                </div>
                <div className={styles.infoItem}>
                  <CheckCircle className={styles.infoIcon} />
                  <span>Put on the headset and adjust the headband for a secure fit.</span>
                </div>
              </div>

              <div className={styles.linkBox}>
                <div className={styles.linkContent}>
                  <ExternalLink className={styles.linkIcon} />
                  <div className={styles.linkText}>
                    <span className={styles.linkLabel}>Learn more:</span>
                    <a
                      href="https://support.apple.com/en-us/117730#put_on"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkUrl}
                    >
                      How to put on Apple Vision Pro
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
              <h2 className={styles.stepTitle}>[Optional] Initial Alignment</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>If prompted, complete the initial alignment process.</p>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <CheckCircle className={styles.infoIcon} />
                  <span>If prompted, "Press and Hold to Align."</span>
                </div>
                <div className={styles.infoItem}>
                  <CheckCircle className={styles.infoIcon} />
                  <span>
                    Locate the <strong>Digital Crown</strong> (top-right dial). Press and hold until a checkmark
                    appears, then release.
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <CheckCircle className={styles.infoIcon} />
                  <span>If not prompted, continue to the next step.</span>
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

          {/* Step 4 */}
          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>4</div>
              <h2 className={styles.stepTitle}>Enter Passcode</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>Enter the device passcode to unlock the Apple Vision Pro.</p>
              <div className={styles.passcodeBox}>
                <div className={styles.passcodeContent}>
                  <span className={styles.passcodeLabel}>Passcode:</span>
                  <span className={styles.passcodeValue}>123456</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>5</div>
              <h2 className={styles.stepTitle}>Quit Chimera App (from last session)</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>Force quit any previous Chimera session to ensure a fresh start.</p>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <CheckCircle className={styles.infoIcon} />
                  <span>
                    Press and hold <strong>Digital Crown + Top Button</strong> together.
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <CheckCircle className={styles.infoIcon} />
                  <span>
                    In the "Force Quit" menu, select <strong>Chimera</strong> → <strong>Force Quit</strong> → Confirm.
                  </span>
                </div>
              </div>

              <div className={styles.videoEmbed}>
                <h4 className={styles.videoTitle}>How to Force Quit Apps on Apple Vision Pro</h4>
                <div className={styles.videoWrapper}>
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/EKKuf6N_ScE?si=z9cB1hU16wJJrKU3"
                    title="How to Force Quit Apps on Apple Vision Pro"
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

          {/* Step 6 */}
          <div className={styles.step} id="step-6">
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>6</div>
              <h2 className={styles.stepTitle}>Enable Guest User Mode</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>
                Set up Guest User mode to allow the customer to use the device safely.
              </p>

              <div className={styles.videoEmbed}>
                <h4 className={styles.videoTitle}>How to Set Up Guest User on Apple Vision Pro</h4>
                <div className={styles.videoWrapper}>
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/6SqAOWk4K7Y?si=T1hv4KTe4FbkGrb8"
                    title="How to Set Up Guest User on Apple Vision Pro"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className={styles.videoIframe}
                  ></iframe>
                </div>
              </div>

              <div className={styles.subSteps}>
                <div className={styles.subStep}>
                  <h4 className={styles.subStepTitle}>Open Control Center</h4>
                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <Eye className={styles.infoIcon} />
                      <span>Look at your palm → Flip hand over → Tap to open Control Center.</span>
                    </div>
                  </div>

                  <div className={styles.linkBox}>
                    <div className={styles.linkContent}>
                      <ExternalLink className={styles.linkIcon} />
                      <div className={styles.linkText}>
                        <span className={styles.linkLabel}>Additional Resource:</span>
                        <a
                          href="https://support.apple.com/guide/apple-vision-pro/open-control-center-tand3233e05b/visionos"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.linkUrl}
                        >
                          Apple's Official Control Center Guide
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.subStep}>
                  <h4 className={styles.subStepTitle}>Access Guest User</h4>
                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>
                        Tap <strong>Control Center button</strong>{" "}
                        <Image
                          src="https://cdsassets.apple.com/live/7WUAS350/images/macos/big-sur/macos-big-sur-control-center-icon.png"
                          alt="Control Center button icon"
                          width={20}
                          height={20}
                          className={styles.buttonIcon}
                        />
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>
                        Tap <strong>Guest User button</strong>{" "}
                        <Image
                          src="https://cdsassets.apple.com/live/7WUAS350/images/inline-icons/vision-pro-person-cropped-dashed-circle-icon.png"
                          alt="Guest User button icon"
                          width={20}
                          height={20}
                          className={styles.buttonIcon}
                        />
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.subStep}>
                  <h4 className={styles.subStepTitle}>Configure App Access</h4>
                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>
                        <strong>App Access:</strong> Select <strong>Chimera</strong> only.
                      </span>
                    </div>
                  </div>

                  <div className={styles.importantNote}>
                    <AlertCircle className={styles.noteIcon} />
                    <div className={styles.noteContent}>
                      <h4 className={styles.noteTitle}>Important</h4>
                      <p className={styles.noteText}>
                        Do not select <em>All Apps</em> (this gives access to the full system).
                      </p>
                    </div>
                  </div>

                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>
                        Tap <strong>Start</strong>.
                      </span>
                    </div>
                  </div>

                  <div className={styles.timerNote}>
                    <div className={styles.timerContent}>
                      <h4 className={styles.timerTitle}>⏱️ 5-Minute Timer</h4>
                      <p className={styles.timerText}>
                        A notification confirms you have <strong>5 minutes</strong> to hand the device to the customer.
                        If not worn within 5 minutes, Guest User turns off and Vision Pro locks.
                      </p>
                    </div>
                  </div>

                  <div className={styles.linkBox}>
                    <div className={styles.linkContent}>
                      <ExternalLink className={styles.linkIcon} />
                      <div className={styles.linkText}>
                        <span className={styles.linkLabel}>Learn more:</span>
                        <a
                          href="https://support.apple.com/en-us/117742#wearing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.linkUrl}
                        >
                          Guest User Documentation
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 7 - New Mirror Display Step */}
          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>7</div>
              <h2 className={styles.stepTitle}>Mirror your Apple Vision Pro to another Apple device</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>
                Set up screen mirroring to see what the customer is experiencing and provide guidance during their
                Chimera configuration session. Supported on iPhone, iPad, Mac, Apple TV.
              </p>

              <div className={styles.linkBox}>
                <div className={styles.linkContent}>
                  <AlertCircle className={styles.linkIcon} />
                  <div className={styles.linkText}>
                    <span className={styles.linkUrl}>System Requirements:</span>
                    <span className={styles.noteText}>
                      To mirror your view on Apple Vision Pro, you need an iPhone with iOS 17.2 or later, an iPad with
                      iPadOS 17.2 or later, a supported Mac with macOS Monterey or later, an Apple TV (2nd generation or
                      later), or an AirPlay-compatible smart TV.
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.importantNote}>
                <Monitor className={styles.noteIcon} />
                <div className={styles.noteContent}>
                  <h4 className={styles.noteTitle}>Why Mirror?</h4>
                  <p className={styles.noteText}>
                    Mirroring allows you to see exactly what the customer sees, enabling you to provide real-time
                    assistance and ensure a smooth configuration experience.
                  </p>
                </div>
              </div>

              <div className={styles.subSteps}>
                <div className={styles.subStep}>
                  <h4 className={styles.subStepTitle}>Option 1: Mirror to iPhone/iPad</h4>
                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>
                        On your iPhone/iPad, open <strong>Control Center</strong>.
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>
                        Tap <strong>Screen Mirroring</strong>.
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>
                        Select your <strong>Apple Vision Pro</strong> from the list.
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>Enter the AirPlay code that appears on Vision Pro if prompted.</span>
                    </div>
                  </div>
                </div>

                <div className={styles.subStep}>
                  <h4 className={styles.subStepTitle}>Option 2: Mirror to Mac</h4>
                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>
                        On your Mac, click the <strong>Control Center</strong> icon in the menu bar.
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>
                        Click <strong>Screen Mirroring</strong>.
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>
                        Select your <strong>Apple Vision Pro</strong>.
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>Enter the AirPlay code if requested.</span>
                    </div>
                  </div>
                </div>

                <div className={styles.subStep}>
                  <h4 className={styles.subStepTitle}>Option 3: Mirror to Apple TV</h4>
                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>Ensure Apple TV and Vision Pro are on the same Wi-Fi network.</span>
                    </div>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>
                        On Vision Pro, open <strong>Control Center</strong>.
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <CheckCircle className={styles.infoIcon} />
                      <span>
                        Tap <strong>Screen Mirroring</strong> and select your <strong>Apple TV</strong>.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.linkBox}>
                <div className={styles.linkContent}>
                  <ExternalLink className={styles.linkIcon} />
                  <div className={styles.linkText}>
                    <span className={styles.linkLabel}>Complete guide:</span>
                    <a
                      href="https://support.apple.com/en-us/119944"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkUrl}
                    >
                      Mirror Apple Vision Pro to another device
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 8 - Updated from Step 7 */}
          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>8</div>
              <h2 className={styles.stepTitle}>Hand the Device to the Customer</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>
                Transfer the Apple Vision Pro to the customer to begin their Chimera experience.
              </p>

              <div className={styles.finalStep}>
                <div className={styles.finalStepContent}>
                  <HandHeart className={styles.handingOverIcon} />
                  <h4 className={styles.finalStepTitle}>Ready for Customer</h4>
                  <p className={styles.finalStepText}>
                    Remove the Vision Pro and give it to the customer to begin their immersive configuration experience.
                    You can now monitor their session through the mirrored display.
                  </p>
                  <div className={styles.importantNote}>
                    <AlertCircle className={styles.noteIcon} />
                    <div className={styles.noteContent}>
                      <h4 className={styles.noteTitle}>Important Warning</h4>
                      <p className={styles.noteText}>
                        Once you remove the headset after enabling Guest User mode, do not put it back on yourself.
                        Wearing the device again will automatically disable Guest User mode and require you to set it up
                        again.
                      </p>
                      <p className={styles.noteText}>
                        If you accidentally wear the headset after enabling Guest User mode, you must repeat the{" "}
                        <a href="#step-6" className={styles.linkUrl}>
                          Enable Guest User Mode
                        </a>{" "}
                        process before handing it to the customer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources Section */}
        <div className={styles.additionalResources}>
          <h3 className={styles.resourcesTitle}>Additional Resources</h3>
          <div className={styles.videoEmbed}>
            <h4 className={styles.videoTitle}>How To Use Apple Vision Pro! (Complete Beginners Guide)</h4>
            <div className={styles.videoWrapper}>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/bQb3nJidSkc?si=RzGztk7AnoiqPmMY"
                title="How To Use Apple Vision Pro! (Complete Beginners Guide)"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className={styles.videoIframe}
              ></iframe>
            </div>
          </div>
        </div>

        <NavigationFooter currentHref="/guide/customer-onboarding" />
      </div>

      <Footer />
    </div>
  )
}
