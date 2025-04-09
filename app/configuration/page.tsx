import ConfigurationForm from "./configuration-form";
import Image from "next/image";
import Link from 'next/link'
import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle";
import styles from "./configuration.module.css";

export default function AppointmentPage() {
  return (
    <div className="container">
      <HeaderBackButtonTitle title="Configuration" />
      <ConfigurationForm />
    </div>
  )
}

