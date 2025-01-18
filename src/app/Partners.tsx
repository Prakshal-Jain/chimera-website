import styles from "./partners.module.css";
import PartnerImageContainer from './PartnerImageContainer'

export default function Partners() {
    return (
        <div className={styles.sectionContainer}>
            <h1 id="partners">Our Partners</h1>
            <div className={styles.partnersContainer}>
                {partnerList.map(x => <PartnerImageContainer filename={x.filename} name={x.name} key={x.name} />)}
            </div>
        </div>
    )
}

const partnerList = [
    {
        "name": "Lotus",
        "filename": "partner_logos/lotus.png"
    },
    {
        "name": "Acura",
        "filename": "partner_logos/acura.png"
    },
    {
        "name": "Chrysler",
        "filename": "partner_logos/chrysler.png"
    },
    {
        "name": "Volkswagen",
        "filename": "partner_logos/volkswagen.png"
    },
    {
        "name": "Jeep",
        "filename": "partner_logos/jeep.png"
    },
    {
        "name": "Ford",
        "filename": "partner_logos/ford.png"
    },
    {
        "name": "Chevrolet",
        "filename": "partner_logos/chevrolet.png"
    },
    {
        "name": "Dodge",
        "filename": "partner_logos/dodge.png"
    }
]