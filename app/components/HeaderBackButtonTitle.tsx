import Link from "next/link"
import { ArrowLeft, X } from "lucide-react"
import styles from "./home-button.module.css"

export default function HeaderBackButtonTitle({
    title
}: {
    title: string
}) {
    return (
        <div className={styles.header}>
            <Link href="/" className={styles.backLink}>
                <ArrowLeft className={styles.backIcon} />
                Back to Home
            </Link>
            <h1 className={styles.title}>{title}</h1>
        </div>
    )
}