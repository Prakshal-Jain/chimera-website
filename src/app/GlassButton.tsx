import styles from "./home.module.css";

export default function GlassButton(
    { label }: { label: string }
) {
    return (
        <button className={styles.glassButton}>
            {label}
        </button>
    )
}