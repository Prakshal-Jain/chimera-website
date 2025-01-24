import styles from "./partners.module.css";
import PartnerImageContainer from './PartnerImageContainer'
import GlassButton from "./GlassButton";

export default function Partners() {
    return (
        <div className={styles.sectionContainer}>
            <h1 id="partners">Our Partners</h1>
            <div className={styles.partnersContainer}>
                {partnerList.map(x => <PartnerImageContainer filename={x.filename} name={x.name} key={x.name} />)}
            </div>
            <GlassButton label="Become a Partner" theme='dark' href="https://docs.google.com/forms/d/e/1FAIpQLSfb2TknAi6i4pGRdb4w_kinUkgvPdKfKfAhqSRJ4V4YmXUugg/viewform?usp=dialog" />
        </div>
    )
}

const partnerList = [
    {
        "name": "Lotus",
        "filename": "partner_logos/lotus.png"
    },
    {
        "name": "Lamborghini",
        "filename": "partner_logos/lamborghini.png"
    },
    {
        "name": "Ferrari",
        "filename": "partner_logos/ferrari.png"
    },
    {
        "name": "Bentley",
        "filename": "partner_logos/bentley.png"
    },
]