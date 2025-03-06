import AppointmentForm from "./appointment-form";
import Image from "next/image";

export default function AppointmentPage() {
  return (
    <div className="container">
      <a className="logo-container" href="/">
        <div className="chimera-logo">
          <Image
            alt="Chimera Name"
            src='chimera-logo.png'
            width={0}
            height={0}
            layout='responsive'
          />
        </div>
      </a>
      <AppointmentForm />
    </div>
  )
}

