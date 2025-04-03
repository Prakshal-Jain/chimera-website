import ConfigurationForm from "./configuration-form";
import Image from "next/image";
import Link from 'next/link'

export default function AppointmentPage() {
  return (
    <div className="container">
      <Link className="logo-container" href="/">
        <div className="chimera-logo">
          <Image
            alt="Chimera Name"
            src='chimera-logo.png'
            width={0}
            height={0}
            layout='responsive'
          />
        </div>
      </Link>
      <ConfigurationForm />
    </div>
  )
}

