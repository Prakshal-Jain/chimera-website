import styles from "./guide.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p className={styles.footerText}>© {new Date().getFullYear()} Chimera Inc. All rights reserved.</p>
        </footer>
    );
}
