import styles from "./home.module.css";

export default function GlassButton(
    { label, href, onClick }: { label: string, href?: string, onClick?: () => void }
) {
    if (href !== null && href !== undefined) {
        return (
            <a className={styles.glassButton} href={href} target="_blank">
                {label}
            </a>
        )
    }

    return (
        <button onClick={onClick} className={styles.glassButton}>
            {label}
        </button>
    )
}