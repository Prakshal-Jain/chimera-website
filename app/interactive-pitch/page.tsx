"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Mail, Phone } from "lucide-react"
import styles from "./interactive-pitch.module.css"

export default function InteractivePitchPage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const galleryImages = [
        {
            src: "/gallery/1.png",
            alt: "AR/VR car experience",
        },
        {
            src: "/gallery/2.png",
            alt: "Dealership showcase",
        },
        {
            src: "/gallery/4.jpg",
            alt: "Luxury car configuration",
        },
    ]

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
    }

    const handleDemoEmail = () => {
        const subject = encodeURIComponent("Chimera Demo Request")
        const body = encodeURIComponent(
            "Hi PJ,\n\nI'm interested in scheduling a live demo of Chimera's AR/VR configurator.\n\nBest regards,",
        )
        window.location.href = `mailto:prakshaljain422@gmail.com?subject=${subject}&body=${body}`
    }

    return (
        <div className={styles.container}>
            {/* Sticky Header */}
            <header className={styles.header}>
                <Link href="/" className={styles.logoContainer}>
                    <Image src="/chimera-logo.png" alt="Chimera Logo" width={200} height={67} className={styles.logo} />
                </Link>
                <div className={styles.appleVerifiedBadge}>
                    <div className={styles.badgeContent}>
                        <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-riOfDC7BGc08r4dKMbE9dcMFi4H4Xb.png"
                            alt="Apple Logo"
                            width={16}
                            height={16}
                            className={styles.appleLogo}
                        />
                        <span className={styles.badgeText}>Verified Business</span>
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.heroSection}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>Pitch Decks Don't Do It Justice.<br />A Demo Does.</h1>
                        <p className={styles.heroSubtitle}>
                            Chimera is an immersive AI-driven configurator at Luxury car dealerships delivered through Apple Vision Pro — the most advanced and
                            immersive headset.
                        </p>
                        <p className={styles.heroSubtitle}>After knocking on doors at 30+ dealerships from San Francisco to Palm
                            Springs, we learned that people undervalue or dismiss the idea until they experience it firsthand.
                        </p>
                        <blockquote className={styles.quote}>
                            "People don't know what they want until you show it to them." — Steve Jobs
                        </blockquote>
                    </div>
                </section>

                {/* AR Experience Section */}
                <section className={styles.experienceSection}>
                    <div className={styles.experienceGrid}>
                        <div className={styles.experienceContent}>
                            <div className={styles.experienceCard}>
                            <h2 className={styles.sectionTitle}>Something fun for you to try...</h2>
                                <p className={styles.experienceBlurb}>
                                    This is a one-of-one car, configured by an actual buyer at a partner dealership using the Apple Vision
                                    Pro. Place their car in your own space and examine every detail with AR on your phone.
                                </p>
                                <div className={styles.experienceCTA}>
                                    <Link href="/ar-view?code=1234" className={styles.arButton}>
                                        View in AR (iPhone/iPad)
                                        <ArrowRight className={styles.buttonIcon} />
                                    </Link>
                                    <div className={styles.qrSection}>
                                        <div className={styles.qrCode}>
                                            <Image
                                                src="/placeholder.svg?height=120&width=120&text=QR+Code"
                                                alt="QR Code to view on mobile"
                                                width={120}
                                                height={120}
                                            />
                                        </div>
                                        <p className={styles.qrText}>Scan to view on mobile</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.videoContainer}>
                            <iframe
                                width="400"
                                height="600"
                                src="https://www.youtube.com/embed/PZ_SiIFtEWY?si=cEaxz3-2FqL1yCOm"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                className={styles.video}
                            ></iframe>
                        </div>
                    </div>
                    <div className={styles.videoDescription}>
                        <p>
                            What you're seeing on a phone is just a glimpse of the post-configuration result. Buyers actually build
                            their cars inside Apple Vision Pro — an experience 100× more vivid than a phone and light-years beyond any
                            monitor or TV configurator.
                        </p>
                        <p>
                            The "How much better can it be than a TV screen" to "HOLY SHIT! This is INSANE. WE WANT IT!" happens in
                            literally <strong>15 minutes</strong>.
                        </p>
                    </div>
                </section>

                {/* What's In It For You Section */}
                <section className={styles.valueSection}>
                    <div className={styles.valueGrid}>
                        <div className={styles.valueContent}>
                            <h2 className={styles.sectionTitle}>
                                We're Starting with Automotive. But Our Sights Are on the Entire Luxury Market.
                            </h2>
                            <p className={styles.valueText}>
                                Chimera's immersive technology is built to scale far beyond cars. Our roadmap moves from automotive into
                                Real Estate, Private Jets, Yachts, Watches, Fine Jewellery and other ultra-luxury verticals where
                                experience drives value. These industries already share deep ties with high-end auto brands through
                                co-branded products, design language, and customer overlap.
                            </p>
                            <p className={styles.valueText}>
                                By getting involved early, you're not just backing a Vision Pro app, you're helping build the platform
                                that will redefine how ultra-luxury is experienced and purchased across every major vertical.
                            </p>
                        </div>
                        <div className={styles.luxuryCollage}>
                            <Image
                                src="/vision-image.png"
                                alt="Luxury products collage showing cars, yachts, private jets, and timepieces"
                                width={800}
                                height={600}
                                className={styles.collageImage}
                            />
                        </div>
                    </div>
                </section>

                {/* What's Next Section */}
                <section className={styles.nextSection}>
                    <div className={styles.nextContent}>
                        <h2 className={styles.nextTitle}>The Most Effective Way Forward Is a Live Demo</h2>
                        <p className={styles.nextText}>
                            I want to save you time and move forward effectively. Call, text, or email me (PJ, Founder of Chimera) and
                            I'll personally arrange a demo with you.
                        </p>
                        <p className={styles.nextPromise}>
                            Worst case — it's one of the most memorable experiences you'll have, and you'll want to share it with
                            colleagues and friends. I promise.
                        </p>
                        <button onClick={handleDemoEmail} className={styles.demoButton}>
                            Let's Demo the Product
                            <ArrowRight className={styles.buttonIcon} />
                        </button>
                        <div className={styles.contactBlock}>
                            <h3 className={styles.contactName}>Prakshal Jain (PJ) — Founder</h3>
                            <div className={styles.contactInfo}>
                                <a href="mailto:prakshaljain422@gmail.com" className={styles.contactLink}>
                                    <Mail className={styles.contactIcon} />
                                    prakshaljain422@gmail.com
                                </a>
                                <a href="tel:+17167300312" className={styles.contactLink}>
                                    <Phone className={styles.contactIcon} />
                                    +1 (716) 730-0312
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Proof Section */}
                <section className={styles.proofSection}>
                    <h2 className={styles.sectionTitle}>High-Intent Adoption from Top Dealerships & Brands</h2>
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

                    <div className={styles.galleryCarousel}>
                        <div className={styles.carouselContainer}>
                            <button onClick={prevImage} className={styles.carouselButton}>
                                ‹
                            </button>
                            <div className={styles.carouselImage}>
                                <Image
                                    src={galleryImages[currentImageIndex].src || "/placeholder.svg"}
                                    alt={galleryImages[currentImageIndex].alt}
                                    width={500}
                                    height={500}
                                    className={styles.galleryImage}
                                />
                            </div>
                            <button onClick={nextImage} className={styles.carouselButton}>
                                ›
                            </button>
                        </div>
                        <div className={styles.carouselDots}>
                            {galleryImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ""}`}
                                />
                            ))}
                        </div>
                    </div>

                    <p className={styles.proofCaption}>
                        "Every dealership lowballed us… until they saw the Vision Pro demo. Then they called in their managers,
                        colleagues, even owners. Excitement spreads instantly."
                    </p>
                </section>

                {/* Team Section */}
                <section className={styles.teamSection}>
                    <h2 className={styles.sectionTitle}>OUR TEAM</h2>
                    <div className={styles.teamGrid}>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>
                                <Image
                                    src="/placeholder.svg?height=200&width=200&text=Marat"
                                    alt="Marat Pashkevich"
                                    width={200}
                                    height={200}
                                    className={styles.memberImage}
                                />
                            </div>
                            <h3 className={styles.memberName}>Marat Pashkevich, Advisor</h3>
                            <p className={styles.memberContact}>marat@mvp-strategies.com</p>
                            <ul className={styles.memberBio}>
                                <li>20+ years in luxury automotive, driving brand growth.</li>
                                <li>Proven track record in cultivating OEM & dealership relationships.</li>
                                <li>Head of Strategic Partnerships at Anaphora</li>
                                <li><a href="#" className={styles.linkedinLink}>LinkedIn</a></li>
                            </ul>
                        </div>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>
                                <Image
                                    src="/placeholder.svg?height=200&width=200&text=PJ"
                                    alt="Prakshal Jain"
                                    width={200}
                                    height={200}
                                    className={styles.memberImage}
                                />
                            </div>
                            <h3 className={styles.memberName}>Prakshal Jain, Founder</h3>
                            <div className={styles.memberContacts}>
                                <p className={styles.memberContact}>(716) 730-0312</p>
                                <p className={styles.memberContact}>prakshaljain422@gmail.com</p>
                            </div>
                            <ul className={styles.memberBio}>
                                <li>Previously: Meta, Software Eng (AR/VR)</li>
                                <li>Lead and Launched Immersive Experiences for <em>Millions</em> of AR/VR (Meta Quest) users.</li>
                                <li>Holds the patent</li>
                                <li><a href="#" className={styles.linkedinLink}>Article</a>, <a href="#" className={styles.linkedinLink}>LinkedIn</a></li>
                            </ul>
                        </div>
                        <div className={styles.teamMember}>
                            <div className={styles.memberPhoto}>
                                <Image
                                    src="/placeholder.svg?height=200&width=200&text=Neil"
                                    alt="Neil Patel"
                                    width={200}
                                    height={200}
                                    className={styles.memberImage}
                                />
                            </div>
                            <h3 className={styles.memberName}>Neil Patel, Head of Business Development</h3>
                            <div className={styles.memberContacts}>
                                <p className={styles.memberContact}>(949) 351-4894</p>
                                <p className={styles.memberContact}>neil.patel210@gmail.com</p>
                            </div>
                            <ul className={styles.memberBio}>
                                <li>Finance and Business Administration</li>
                                <li>Blacklight Group, Digital Marketing and Sales</li>
                                <li><a href="#" className={styles.linkedinLink}>LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                    <p className={styles.teamClosing}>Join us and redefine how ultra-luxury is experienced and purchased.</p>
                </section>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerLeft}>
                        Chimera Auto Inc.
                    </div>

                    <div className={styles.footerCenter}>
                        <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy%20of%20Final%20Pitch%20Deck-Picsart-BackgroundRemover-tBRY8Ey5HTxlreewz3oWyy9TGXqgXG.png"
                            alt="Chimera Logo"
                            width={60}
                            height={60}
                            className={styles.footerLogo}
                        />
                    </div>

                    <div className={styles.footerRight}>
                        <a
                            href="https://docs.google.com/presentation/d/1234567890"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.slidedeckLink}
                        >
                            View Chimera slide deck
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
