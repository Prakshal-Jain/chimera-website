import Link from "next/link"
import { ArrowLeft, X } from "lucide-react"
import styles from "./home-button.module.css"

export default function BackHome() {
    return (
        <Link href="/" className={styles.backLink}>
            <ArrowLeft className={styles.backIcon} />
            Back to Home
        </Link>
    )
}