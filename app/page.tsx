"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink, Mail, Phone, CheckCircle, Sparkles, TrendingUp, Award, Play, ChevronDown } from "lucide-react"
import styles from "./page.module.css"

export default function Home() {
  const [currentWord, setCurrentWord] = useState(0)
  const words = ["Cars", "Jets", "Yachts", "Jewelry", "Watches"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollToContent = () => {
    const differenceSection = document.getElementById("difference-section")
    if (differenceSection) {
      differenceSection.scrollIntoView({ behavior: "smooth" })
    }
  }

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
          <Link href="/events" className={styles.navLink}>
            Events
          </Link>
          <Link href="/guide" className={styles.navLink}>
            Guide
          </Link>
          <Link href="/contact" className={styles.navLink}>
            Contact
          </Link>
        </nav>
      </header>

      {/* Hero Section with Video Background */}
      <section className={styles.heroSection}>
        <video autoPlay loop muted playsInline className={styles.heroVideo}>
          <source src="/chimera-demo.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Shopify for luxury brands</h1>
          <div className={styles.heroSubtitleWrapper}>
            <p className={styles.heroSubtitle}>AI driven immersive experiences for</p>
            <p className={styles.heroSubtitle}>
              <span className={styles.animatedWord} key={currentWord}>
                {words[currentWord]}
              </span>
            </p>
          </div>

          <div className={styles.badgesContainer}>
            <div className={styles.badgeContent}>
              <Image src="/apple-logo.png" alt="Apple Logo" width={20} height={20} className={styles.badgeLogo} />
              <span className={styles.badgeText}>
                <b>Apple</b> Verified Business
              </span>
            </div>
            <div className={styles.badgeContent}>
              <Image src="/nvidia-logo.png" alt="NVIDIA Logo" width={20} height={20} className={styles.badgeLogo} />
              <span className={styles.badgeText}>
                <b>NVIDIA</b> Inception Program
              </span>
            </div>
          </div>

          <p className={styles.heroTagline}>
            Increase sales conversion and customer satisfaction with immersive experiences that builds complete buying
            confidence
          </p>

          <div className={styles.heroCTA}>
            {/* Watch Demo CTA */}
            <Link
              href="https://youtu.be/IqDw3HJs1Js"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              <Play className={styles.watchDemoIcon} />
              <span>Watch Demo</span>
            </Link>
          </div>
        </div>

        <button onClick={scrollToContent} className={styles.scrollDownArrow} aria-label="Scroll to content">
          <ChevronDown className={styles.arrowIcon} />
        </button>
      </section>


      <section id="difference-section" className={styles.differenceSection}>
        <h2 className={styles.differenceSectionTitle}>What are you doing differently than your competition?</h2>
        <div className={styles.differenceGrid}>
          <div className={styles.differenceCard}>
            <div className={styles.differenceContent}>
              <h3 className={styles.differenceCardTitle}>EVENT & SHOWROOM EXPERIENCES</h3>
              <p className={styles.differenceCardText}>
                Everyone posts on social media. Everyone spends big budgets on pastries, flowers, and fancy setups that
                your customers forget the moment they walk out the door.
              </p>
              <p className={styles.differenceCardText}>
                <b>Use your budget wisely. Give them an experience they'll never forget</b> — something they'll talk about with
                their friends and colleagues. That's how you create a real competitive edge.
              </p>
              <Link href="/events" className={styles.differenceButton}>
                <span>TRY CHIMERA — AN UNFORGETTABLE EXPERIENCE</span>
                <ArrowRight className={styles.buttonIcon} />
              </Link>
            </div>
            <div className={styles.differenceImageContainer}>
              <Image
                src="/gallery/1.png"
                alt="Event and showroom experiences"
                width={600}
                height={400}
                className={styles.differenceImage}
              />
            </div>
          </div>

          <div className={styles.differenceCard}>
            <div className={styles.differenceContent}>
              <h3 className={styles.differenceCardTitle}>TURN ONLINE BROWSERS INTO BUYERS</h3>
              <p className={styles.differenceCardText}>
                Take your store inventory global. With Chimera, potential buyers can place new or used vehicles right in
                their driveway or garage using just their phone. It feels like magic.
              </p>
              <p className={styles.differenceCardText}>
                We handle the full integration, so your sales cycle speeds up, customers make more confident decisions,
                and you stand out from the rest.
              </p>
              <Link href="/ar-view" className={styles.differenceButton}>
                <span>PLACE A CAR IN YOUR WORLD</span>
                <ArrowRight className={styles.buttonIcon} />
              </Link>
            </div>
            <div className={styles.differenceImageContainer}>
              <Image
                src="/gallery/29.png"
                alt="AR car placement experience"
                width={600}
                height={400}
                className={styles.differenceImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteContainer}>
          <blockquote className={styles.quote}>
            "The graphics are so real, I kept reaching out to grab the steering wheel. This is the true meaning of 'what
            you see is what you get.'"
          </blockquote>
          <cite className={styles.quoteAuthor}>— Kyle Snell, Sales Manager at Boardwalk Lotus Redwood City</cite>
          <div className={styles.quoteUnderline} />
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className={styles.problemSolutionSection}>
        <div className={styles.problemSolutionGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>The Problem with Traditional Commerce</h2>
            <div className={styles.cardContent}>
              <p>
                Luxury customers deserve more than flat screens and outdated interfaces when configuring their dream
                purchases.
              </p>
              <ul className={styles.problemList}>
                <li>Traditional 2D configurators fail to capture true colors, materials, and lighting</li>
                <li>Customers struggle to visualize their final specification, leading to uncertainty</li>
                <li>Slow, fragmented experiences diminish the luxury buying journey</li>
              </ul>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Photorealistic AR/VR Solution</h2>
            <div className={styles.cardContent}>
              <p>
                Chimera delivers photorealistic AR/VR experiences that let customers truly see, feel, and connect with
                their configured products before purchase.
              </p>
              <div className={styles.solutionFeatures}>
                <div className={styles.feature}>
                  <div className={styles.featureIconContainer}>
                    <TrendingUp className={styles.featureIcon} />
                  </div>
                  <h4 className={styles.featureTitle}>Drive New Customer Acquisition</h4>
                </div>
                <div className={styles.feature}>
                  <div className={styles.featureIconContainer}>
                    <Sparkles className={styles.featureIcon} />
                  </div>
                  <h4 className={styles.featureTitle}>Elevate Brand Experiences</h4>
                </div>
                <div className={styles.feature}>
                  <div className={styles.featureIconContainer}>
                    <CheckCircle className={styles.featureIcon} />
                  </div>
                  <h4 className={styles.featureTitle}>Increase Configuration Confidence</h4>
                </div>
                <div className={styles.feature}>
                  <div className={styles.featureIconContainer}>
                    <Award className={styles.featureIcon} />
                  </div>
                  <h4 className={styles.featureTitle}>Boost Customer Satisfaction</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className={styles.aiSection}>
        <h2 className={styles.sectionTitle}>AI Features</h2>
        <div className={styles.aiGrid}>
          <div className={styles.aiFeature}>
            <h3>Voice-Powered Customization</h3>
            <p>Simply speak your preferences and watch your dream product come to life</p>
          </div>
          <div className={styles.aiFeature}>
            <h3>AI Sales Assistant</h3>
            <p>Intelligent guidance that understands customer preferences and suggests perfect combinations</p>
          </div>
          <div className={styles.aiFeature}>
            <h3>Personal Dashboard</h3>
            <p>Save, compare, and refine configurations across multiple sessions</p>
          </div>
          <div className={styles.aiFeature}>
            <h3>Brand Analytics</h3>
            <p>Deep insights into customer preferences and configuration trends</p>
          </div>
        </div>
      </section>

      {/* Traction Section */}
      <section className={styles.tractionSection}>
        <h2 className={styles.sectionTitle}>Trusted by Luxury Leaders</h2>
        <div className={styles.tractionGrid}>
          <div className={styles.tractionItem}>
            <div className={styles.tractionNumber}>20+</div>
            <div className={styles.tractionLabel}>Premium Brands</div>
            <p>Leading luxury retailers trust Chimera to elevate their customer experience</p>
          </div>
          <div className={styles.tractionItem}>
            <div className={styles.tractionNumber}>9+</div>
            <div className={styles.tractionLabel}>Exclusive Showcases</div>
            <p>Featured at premier events including Lamborghini reveals and F1 experiences</p>
          </div>
          <div className={styles.tractionItem}>
            <div className={styles.tractionNumber}>4</div>
            <div className={styles.tractionLabel}>Active Partnerships</div>
            <p>Working directly with top-tier brands to redefine luxury commerce</p>
          </div>
        </div>
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
              src="/gallery/30.png"
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
        </div>

        <div className={styles.partnerButton}>
          <Link href="/gallery" className={styles.primaryButton}>
            <span>View Full Gallery</span>
            <ArrowRight className={styles.buttonIcon} />
          </Link>
        </div>
      </section>

      {/* Competitive Advantage Section */}
      <section className={styles.advantageSection}>
        <h2 className={styles.sectionTitle}>Why Chimera Leads</h2>
        <div className={styles.advantageGrid}>
          <div className={styles.advantageItem}>
            <h3>Seamless Integration</h3>
            <p>Deploy instantly without complex development or ongoing maintenance requirements</p>
          </div>
          <div className={styles.advantageItem}>
            <h3>Universal Compatibility</h3>
            <p>Works flawlessly across all luxury brands and product categories</p>
          </div>
          <div className={styles.advantageItem}>
            <h3>Photorealistic Quality</h3>
            <p>Industry-leading visual fidelity that captures every detail, texture, and reflection</p>
          </div>
          <div className={styles.advantageItem}>
            <h3>AI-Enhanced Experience</h3>
            <p>Intelligent features that adapt to customer preferences and streamline the buying process</p>
          </div>
          <div className={styles.advantageItem}>
            <h3>Market Leadership</h3>
            <p>First-to-market advantage with established industry partnerships</p>
          </div>
          <div className={styles.advantageItem}>
            <h3>Rapid Deployment</h3>
            <p>Get up and running in minutes, not months, with comprehensive training included</p>
          </div>
        </div>
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
          <a
            href="https://www.lamborghininewportbeach.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.partnerLink}
          >
            <div className={styles.partner}>
              <div className={styles.partnerLogoContainer}>
                <Image
                  src="/lambonb.png"
                  alt="Lamborghini Newport Beach Logo"
                  width={200}
                  height={100}
                  className={styles.partnerLogo}
                />
              </div>
              <h3 className={styles.partnerName}>Lamborghini Newport Beach</h3>
            </div>
          </a>
        </div>
        <div className={styles.partnerButton}>
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSfb2TknAi6i4pGRdb4w_kinUkgvPdKfKfAhqSRJ4V4YmXUugg/viewform?usp=dialog"
            target="_blank"
            className={styles.primaryButton}
          >
            <span>Become a Partner</span>
            <ArrowRight className={styles.buttonIcon} />
          </Link>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className={styles.visionSection}>
        <div className={styles.visionGrid}>
          <div className={styles.visionContent}>
            <h2 className={styles.visionSectionTitle}>Beyond Automotive</h2>
            <p className={styles.visionText}>
              While automotive is our foundation, Chimera's immersive technology extends far beyond cars. We're
              pioneering the future of luxury product configuration across aviation, marine, real estate, timepieces,
              and other premium industries.
            </p>
            <p className={styles.visionSubtext}>
              The same customers who configure million-dollar supercars also customize private jets, luxury yachts,
              exclusive real estate properties, and premium timepieces. Our platform scales seamlessly across these
              interconnected luxury markets.
            </p>
          </div>
          <div className={styles.visionImageContainer}>
            <Image
              src="/vision-image.png"
              alt="Luxury products collage showing cars, yachts, private jets, and timepieces"
              width={1000}
              height={750}
              className={styles.visionImage}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerAddress}>
            <p>
              710 Lakeway Drive, Suite 200
              <br />
              Sunnyvale, CA 94085
            </p>
          </div>
          <div className={styles.footerLogoContainer}>
            <Image src="/chimera-icon.png" alt="Chimera Logo" width={80} height={80} className={styles.footerLogo} />
          </div>
          <div className={styles.footerContact}>
            <a href="mailto:founder@chimeraauto.com" className={styles.footerLink}>
              <Mail className={styles.footerIcon} />
              founder@chimeraauto.com
            </a>
            <a href="tel:7167300312" className={styles.footerLink}>
              <Phone className={styles.footerIcon} />
              (716) 730-0312
            </a>
          </div>
        </div>

        <div className={styles.footerCopyright}>
          <p>
            © {new Date().getFullYear()} Chimera Inc. All rights reserved. |{" "}
            <Link href="/privacy-policy" className={styles.privacyLink}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
