import styles from "./partners.module.css";
import PartnerImageContainer from './PartnerImageContainer';
import GlassButton from "./GlassButton";

export default function Partners() {
    return (
        <div className={styles.sectionContainer}>
            <h1 id="partners">Our Partners</h1>
            <div className={styles.partnersContainer}>
                {partnerList.map(x => (
                    <div key={x.name} className={styles.partnerItem}>
                        <PartnerImageContainer filename={x.filename} name={x.name} />
                        <p className={styles.partnerName}>{x.name}</p>
                    </div>
                ))}
            </div>
            <GlassButton label="Become a Partner" theme='dark' href="https://docs.google.com/forms/d/e/1FAIpQLSfb2TknAi6i4pGRdb4w_kinUkgvPdKfKfAhqSRJ4V4YmXUugg/viewform?usp=dialog" />
        </div>
    )
}

const partnerList = [
    {
        "name": "Boardwalk Lotus Redwood City",
        "filename": "partner_logos/lotus.png"
    },
    {
        "name": "Lamborghini - Luxury Collection Los Gatos",
        "filename": "partner_logos/lamborghini.png"
    }
];