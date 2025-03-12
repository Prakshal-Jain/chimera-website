import styles from "./footer.module.css";

export default function Footer() {
    return (
        <div className={styles.sectionContainer}>
            <div className={styles.descriptionSection}>
                <h2 className={styles.footerTitle}>About Chimera</h2>
                <p className={styles.description}>
                    Chimera is a luxury brand offering an immersive AR/VR solution that delivers hyper-realistic experiences for supercar buyers and owners. Potential buyers can precisely configure cars—replacing traditional software—while owners can further customize their vehicles through select dealerships and custom shops. Chimera also provides engaging content, such as short films, historical highlights, and unique car details, along with inspirational tools that guide customers toward higher trims or alternate models.
                </p>
            </div>

            <div>
                <h2 className={styles.footerTitle}>Contact</h2>
                <p className={styles.description}>
                    Phone: +1 (7167300312)
                </p>
                <p className={styles.description}>
                    Email: <a href="mailto:prakshaljain422@gmail.com">chimera.autos@gmail.com</a>
                </p>
                <p className={styles.description}>
                    <a href="/book_appointment" target="_blank">Setup the Demo</a>
                </p>
                <p className={styles.description}>
                    &#169; 2025 Chimera Inc. All rights reserved.
                </p>
            </div>
        </div>
    )
}