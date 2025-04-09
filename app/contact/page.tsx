import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, ArrowLeft, ExternalLink } from "lucide-react"
import styles from "./contact.module.css"
import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle"

export default function Contact() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <HeaderBackButtonTitle title="Contact" />

        <div className={styles.contactCard}>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <div className={styles.contactLabel}>
                <Mail className={styles.contactIcon} />
                <span>Email:</span>
              </div>
              <a href="mailto:chimera.autos@gmail.com" className={styles.contactValue}>
                chimera.autos@gmail.com
              </a>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactLabel}>
                <Phone className={styles.contactIcon} />
                <span>Phone:</span>
              </div>
              <a href="tel:7167300312" className={styles.contactValue}>
                (716) 730-0312
              </a>
            </div>
          </div>

          <div className={styles.ctaSection}>
            <p className={styles.ctaText}>Interested in learning more about our AR/VR car configurator solutions?</p>
            <div className={styles.ctaButtons}>
              <Link href="/book_appointment" className={styles.primaryButton}>
                Book an Appointment
              </Link>
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSfb2TknAi6i4pGRdb4w_kinUkgvPdKfKfAhqSRJ4V4YmXUugg/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryButton}
              >
                Onboard Your Dealership
                <ExternalLink className={styles.buttonIcon} />
              </Link>
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

