import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle"
import EventsList from "./events-list"
import styles from "./events.module.css"

export default function EventsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <HeaderBackButtonTitle title="Events" />
        <p className={styles.subtitle}>
          Join us at these events to experience Chimera's hyper-realistic AR/VR car configurator in person.
        </p>
        <EventsList />
      </div>
    </div>
  )
}
