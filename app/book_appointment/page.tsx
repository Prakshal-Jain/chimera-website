import { Suspense } from "react";
import AppointmentForm from "./appointment-form";
import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle";

export default function AppointmentPage() {
  return (
    <div className="container">
      <HeaderBackButtonTitle title="Book Appointment" />
      <Suspense fallback={<div className="loading-indicator">Loading...</div>}>
        <AppointmentForm />
      </Suspense>
    </div>
  )
}

