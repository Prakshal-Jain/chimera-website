import styles from "./partners.module.css";
import Image from "next/image";

export default function PartnerImageContainer(
    {
        filename,
        name
    }: {
        filename: string,
        name: string,
    }
) {
    return (
        <div className={styles.partnerImage}>
            <Image
                alt={name}
                src={filename}
                width={0}
                height={0}
                layout='responsive'
            />
        </div>
    )
}