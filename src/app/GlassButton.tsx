import styles from "./home.module.css";

export default function GlassButton(
    { label, href, onClick, theme='light', target="_blank" }: { label: string, href?: string, onClick?: () => void, theme?: 'light' | 'dark', target?: "_blank" | "_self" }
) {
    if (href !== null && href !== undefined) {
        return (
            <a className={theme === 'light' ? styles.glassButton : styles.glassButtonDark} href={href} target={target}>
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