import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink, Mail, Phone, Play } from "lucide-react"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image src="/chimera-logo.png" alt="Chimera Logo" width={600} height={200} className={styles.logo} priority />
        </div>
        <nav className={styles.nav}>
          <Link href="/book_appointment" className={styles.navLink}>
            Book Appointment
          </Link>
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSfb2TknAi6i4pGRdb4w_kinUkgvPdKfKfAhqSRJ4V4YmXUugg/viewform?usp=dialog"
            className={styles.navLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Become Partner <ExternalLink className={styles.icon} />
          </Link>
          <Link href="/configuration" className={styles.navLink}>
            See Configurations
          </Link>
          <Link href="/gallery" className={styles.navLink}>
            Gallery
          </Link>
          <Link href="/contact" className={styles.navLink}>
            Contact
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Hyper-Realistic AR/VR Car Configurator for Luxury Dealerships, Manufacturers & Dreamers
        </h1>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallerySection}>
        <div className={styles.galleryGrid}>
          <div className={styles.galleryItem} style={{ gridRow: "span 2" }}>
            <Image
              src="/gallery/4.jpg"
              alt="Luxury car configuration"
              width={600}
              height={800}
              className={styles.galleryImage}
            />
          </div>
          <div className={styles.galleryItem}>
            <Image
              src="/gallery/1.png"
              alt="AR/VR car experience"
              width={800}
              height={600}
              className={styles.galleryImage}
            />
          </div>
          <div className={styles.galleryItem}>
            <Image
              src="/gallery/2.png"
              alt="Dealership showcase"
              width={700}
              height={700}
              className={styles.galleryImage}
            />
          </div>
          {/* <div className={styles.galleryItem} style={{ gridRow: "span 2" }}>
            <Image
              src="/gallery/8.jpg"
              alt="Vision Pro experience"
              width={600}
              height={800}
              className={styles.galleryImage}
            />
          </div>
          <div className={styles.galleryItem}>
            <Image
              src="/gallery/3.png"
              alt="Luxury car interior"
              width={960}
              height={540}
              className={styles.galleryImage}
            />
          </div>
          <div className={styles.galleryItem}>
            <Image
              src="/gallery/5.jpg"
              alt="Configuration process"
              width={800}
              height={600}
              className={styles.galleryImage}
            />
          </div> */}
        </div>

        <div className={styles.partnerButton}>
          <Link href="/gallery" className={styles.button}>
            View Full Gallery
            <ArrowRight className={styles.buttonIcon} />
          </Link>
        </div>
      </section>

      {/* Quote Section */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteContainer}>
          <blockquote className={styles.quote}>"Everything you can imagine is real."</blockquote>
          <cite className={styles.quoteAuthor}>— Pablo Picasso</cite>
          <div className={styles.quoteUnderline}></div>
        </div>
      </section>

      {/* Video Section */}
      <section className={styles.videoSection}>
        <Link
          href="https://youtu.be/VcQD7ZR7XGA?si=nP-T6DL5UY57tBXZ"
          target="_blank"
          rel="noopener noreferrer">
          <div className={styles.videoContainer}>
            <div className={styles.videoWrapper}>
              <div className={styles.videoPlaceholder}>
                <div className={styles.playButton}>
                  <Play className={styles.playIcon} />
                </div>
                <p className={styles.videoText}>Experience Chimera</p>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Partners Section */}
      <section className={styles.partnersSection}>
        <h2 className={styles.sectionTitle}>Our Partners</h2>
        <div className={styles.partnersContainer}>
          <a
            href="https://www.boardwalklotus.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.partnerLink}
          >
            <div className={styles.partner}>
              <div className={styles.partnerLogoContainer}>
                <Image
                  src="/lotus-logo.png"
                  alt="Boardwalk Lotus Redwood City Logo"
                  width={250}
                  height={250}
                  className={styles.partnerLogo}
                />
              </div>
              <h3 className={styles.partnerName}>Boardwalk Lotus Redwood City</h3>
            </div>
          </a>
          <a
            href="https://www.losgatosluxcars.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.partnerLink}
          >
            <div className={styles.partner}>
              <div className={styles.partnerLogoContainer}>
                <Image
                  src="/lamborghini-logo.png"
                  alt="Lamborghini - Luxury Collection Los Gatos Logo"
                  width={200}
                  height={100}
                  className={styles.partnerLogo}
                />
              </div>
              <h3 className={styles.partnerName}>Lamborghini - Luxury Collection Los Gatos</h3>
            </div>
          </a>
        </div>
        <div className={styles.partnerButton}>
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLSfb2TknAi6i4pGRdb4w_kinUkgvPdKfKfAhqSRJ4V4YmXUugg/viewform?usp=dialog" target="_blank" className={styles.button}>
            Become a Partner
            <ArrowRight className={styles.buttonIcon} />
          </Link>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className={styles.problemSolutionSection}>
        <div className={styles.problemSolutionGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>The Problem</h2>
            <div className={styles.cardContent}>
              <p>
                Even in 2025, dealerships rely on 2D configurators on outdated monitor screens with low-resolution
                displays and poor color accuracy to configure cars that fall short of capturing real-world aesthetics,
                leading to frustration, decision fatigue, inaccurate configurations, repeated dealership visits, and
                costly order changes.
              </p>
              <p>
                There are over ~792,720 high-end car sales every year in US alone. 85-98% of high-end car buyers
                personalize their cars. 38-45% of these car buyers back-out, reconfigure, or cancel their orders due to
                under-confidence in their configuration choices.
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Our Solution</h2>
            <div className={styles.cardContent}>
              <p>
                Chimera solves these issues by delivering a fully immersive configurator with true-to-life colors,
                lighting, materials, and environments—accessible through the standardized Apple Vision Pro AR/VR headset
                before manufacturing even begins (often years in advance).
              </p>
              <p>
                Buyers can experience their dream cars in life-size scale, eliminating guesswork and increasing
                confidence in final orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerCopyright}>
            <p>© {new Date().getFullYear()} Chimera Inc. All rights reserved.</p>
          </div>
          <div className={styles.footerContact}>
            <a href="mailto:chimera.autos@gmail.com" className={styles.footerLink}>
              <Mail className={styles.footerIcon} />
              chimera.autos@gmail.com
            </a>
            <a href="tel:7167300312" className={styles.footerLink}>
              <Phone className={styles.footerIcon} />
              (716) 730-0312
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

