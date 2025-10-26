import { BCPAAppointmentManager } from "@/components/bcpa/BCPAAppointmentManager"

export const metadata = {
  title: "BCPA Appointment Management | Wabi Care",
  description: "Manage BCPA appointments, assessments, and technician sessions."
}

export default function BCPAPage() {
  return <BCPAAppointmentManager bcpaId="bcpa-1" />
}




