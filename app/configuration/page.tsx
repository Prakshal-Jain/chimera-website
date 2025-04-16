import ConfigurationForm from "./configuration-form";
import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle";

export default function AppointmentPage() {
  return (
    <div className="container">
      <HeaderBackButtonTitle title="Configuration" />
      <ConfigurationForm />
    </div>
  )
}

