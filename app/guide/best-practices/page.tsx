import Link from "next/link"
import {
  ArrowLeft,
  Heart,
  Shield,
  Users,
  Award,
  MessageSquare,
  Star,
  Camera,
  Battery,
  Eye,
  TrendingUp,
  ArrowRight,
  Glasses,
  Mail,
  Phone,
} from "lucide-react"
import styles from "../guide.module.css"
import Footer from "../Footer"
import NavigationFooter from "../NavigationFooter"

export default function BestPracticesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link href="/guide" className={styles.backLink}>
          <ArrowLeft className={styles.backIcon} />
          Back to Guide
        </Link>

        <div className={styles.pageHeader}>
          <nav className={styles.breadcrumb}>
            <Link href="/guide" className={styles.breadcrumbLink}>
              Guide
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>Best Practices</span>
          </nav>
          <h1 className={styles.pageTitle}>Best Practices</h1>
          <p className={styles.pageSubtitle}>
            Essential guidelines for delivering premium, seamless, and memorable Chimera experiences. Follow these
            practices to ensure every customer interaction reflects the luxury and innovation of your dealership.
          </p>
        </div>

        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>1</div>
              <h2 className={styles.stepTitle}>Device Care & Handling</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>
                Maintain the Apple Vision Pro in pristine condition to ensure optimal performance and customer
                satisfaction.
              </p>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <Eye className={styles.infoIcon} />
                  <span>
                    <strong>Lens Maintenance:</strong> Wipe the Vision Pro before and after each use; keep lenses
                    spotless and free from smudges
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <Battery className={styles.infoIcon} />
                  <span>
                    <strong>Battery Management:</strong> Always check and connect the battery before appointments; keep
                    a spare charged battery ready
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <Shield className={styles.infoIcon} />
                  <span>
                    <strong>Secure Storage:</strong> Store the device securely to avoid scratches, dust, or damage when
                    not in use
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>2</div>
              <h2 className={styles.stepTitle}>Vision-Based Needs</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>
                Accommodate customers with different vision requirements to ensure everyone can enjoy the Chimera
                experience.
              </p>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <Eye className={styles.infoIcon} />
                  <span>
                    <strong>Contact Lens Preference:</strong> Encourage customers with weak eyesight to wear contact
                    lenses for optimal experience
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <Glasses className={styles.infoIcon} />
                  <span>
                    <strong>Glasses Alternative:</strong> If glasses are the only option, invite a companion to
                    experience the headset while the customer views on the display
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <Mail className={styles.infoIcon} />
                  <span>
                    <strong>AR Configuration Access:</strong> All customers will still receive their AR configuration
                    via email regardless of headset usage
                  </span>
                </div>
              </div>

              <div className={styles.importantNote}>
                <Phone className={styles.noteIcon} />
                <div className={styles.noteContent}>
                  <h3 className={styles.noteTitle}>Vision Support Contact</h3>
                  <p className={styles.noteText}>
                    For any vision-related concerns or questions about accommodating customers with specific needs,
                    contact Chimera support at <strong>[email / phone]</strong> for personalized assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>3</div>
              <h2 className={styles.stepTitle}>Present with Excellence</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>
                Position Chimera as a world-class, exclusive experience that sets your dealership apart from the
                competition.
              </p>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <Star className={styles.infoIcon} />
                  <span>
                    <strong>Confident Introduction:</strong> Introduce Chimera confidently and with genuine enthusiasm
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <Award className={styles.infoIcon} />
                  <span>
                    <strong>Emphasize Exclusivity:</strong> Highlight that Chimera is available only at select
                    dealerships worldwide
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <MessageSquare className={styles.infoIcon} />
                  <span>
                    <strong>Engaging Communication:</strong> Use thoughtful storytelling and open questions to create
                    meaningful customer engagement
                  </span>
                </div>
              </div>

              <div className={styles.timerNote}>
                <div className={styles.timerContent}>
                  <h4 className={styles.timerTitle}>💬 Engagement Examples</h4>
                  <p className={styles.timerText}>
                    Try questions like "How does this configuration feel to you?" or "What draws you to this particular
                    design?" to spark conversation and deeper connection with the experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>4</div>
              <h2 className={styles.stepTitle}>Create a Memorable Experience</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>
                Transform each session into a personalized journey that resonates with customers and their companions.
              </p>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <Heart className={styles.infoIcon} />
                  <span>
                    <strong>Personal Touch:</strong> Personalize each session to align with the customer's unique taste
                    and preferences
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <Users className={styles.infoIcon} />
                  <span>
                    <strong>Involve Companions:</strong> Encourage photos, participation, and shared excitement among
                    family and friends
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <Camera className={styles.infoIcon} />
                  <span>
                    <strong>Social Sharing:</strong> Suggest social media sharing with tags for Chimera and your
                    dealership to amplify the experience
                  </span>
                </div>
              </div>

              <div className={styles.timerNote}>
                <div className={styles.timerContent}>
                  <h4 className={styles.timerTitle}>📸 Photo Opportunities</h4>
                  <p className={styles.timerText}>
                    Capture moments of customers experiencing their dream car in AR. These photos become powerful
                    marketing assets and cherished memories for customers to share with their network.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>5</div>
              <h2 className={styles.stepTitle}>Strengthen the Brand</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>
                Ensure every touchpoint reflects the luxury standards and reinforces your dealership's premium
                positioning.
              </p>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <Award className={styles.infoIcon} />
                  <span>
                    <strong>Luxury Alignment:</strong> Keep your presentation aligned with the dealership's luxury image
                    and brand standards
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <Star className={styles.infoIcon} />
                  <span>
                    <strong>Premium Differentiator:</strong> Position Chimera as a premium differentiator that sets your
                    dealership apart
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <Mail className={styles.infoIcon} />
                  <span>
                    <strong>Follow-Up Excellence:</strong> Remind customers of their confirmation email and AR sharing
                    link for continued engagement
                  </span>
                </div>
              </div>

              <div className={styles.timerNote}>
                <div className={styles.timerContent}>
                  <h4 className={styles.timerTitle}>✨ Brand Consistency</h4>
                  <p className={styles.timerText}>
                    Every interaction should reinforce that your dealership is at the forefront of automotive
                    innovation, offering experiences that competitors simply cannot match.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>6</div>
              <h2 className={styles.stepTitle}>Capture Insights</h2>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepDescription}>
                Actively collect observations and feedback to continuously improve the Chimera experience for future
                customers.
              </p>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <Eye className={styles.infoIcon} />
                  <span>
                    <strong>Observe Reactions:</strong> Pay attention to and note customer reactions, interests, and
                    emotional responses
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <MessageSquare className={styles.infoIcon} />
                  <span>
                    <strong>Document Feedback:</strong> Record any challenges, suggestions, or improvement opportunities
                    customers mention
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <TrendingUp className={styles.infoIcon} />
                  <span>
                    <strong>Share Insights:</strong> Submit feedback to Chimera to refine the overall experience and
                    serve customers even better
                  </span>
                </div>
              </div>

              <div className={styles.timerNote}>
                <div className={styles.timerContent}>
                  <h4 className={styles.timerTitle}>📊 Feedback Value</h4>
                  <p className={styles.timerText}>
                    Your observations are invaluable for platform improvement. Note both positive reactions and areas
                    for enhancement to help Chimera evolve and deliver even better experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.finalStep}>
          <div className={styles.finalStepContent}>
            <Award className={styles.handingOverIcon} />
            <h3 className={styles.finalStepTitle}>Excellence in Every Interaction</h3>
            <p className={styles.finalStepText}>
              By following these best practices, you ensure that every Chimera experience reflects the luxury,
              innovation, and professionalism that defines your dealership. Remember: you're not just showing a
              car—you're creating dreams and memories that last a lifetime.
            </p>
          </div>
        </div>

        <NavigationFooter currentHref="/guide/best-practices" />
      </div>

      <Footer />
    </div>
  )
}
