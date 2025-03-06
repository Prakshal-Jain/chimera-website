import styles from "./home.module.css";
import Link from 'next/link'

export default function GlassButton(
    { label, href, onClick, theme='light', target="_blank" }: { label: string, href?: string, onClick?: () => void, theme?: 'light' | 'dark', target?: "_blank" | "_self" }
) {
    if (href !== null && href !== undefined) {
        return (
            <Link className={theme === 'light' ? styles.glassButton : styles.glassButtonDark} href={href} target={target}>
                {label}
            </Link>
        )
    }

    return (
        <button onClick={onClick} className={styles.glassButton}>
            {label}
        </button>
    )
}