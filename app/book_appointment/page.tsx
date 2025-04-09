import AppointmentForm from "./appointment-form";
import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle";

export default function AppointmentPage() {
  return (
    <div className="container">
      <HeaderBackButtonTitle title="Book Appointment" />
      <AppointmentForm />
    </div>
  )
}

