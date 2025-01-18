import styles from "./home.module.css";

export default function GlassButton(
    { label, href, onClick, theme='light' }: { label: string, href?: string, onClick?: () => void, theme?: 'light' | 'dark' }
) {
    if (href !== null && href !== undefined) {
        return (
            <a className={theme === 'light' ? styles.glassButton : styles.glassButtonDark} href={href} target="_blank">
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