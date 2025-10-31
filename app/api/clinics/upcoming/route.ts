import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

function formatTimeRange(start: string | null, end: string | null) {
  if (!start || !end) return "";
  const fmt = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hr = ((h + 11) % 12) + 1;
    return `${hr}${m ? `:${String(m).padStart(2, "0")}` : ""} ${period}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

export async function GET() {
  const rows = await sql`
    SELECT 
      a.clinic_id,
      a.appointment_date,
      a.appointment_time,
      a.insurance_company,
      a.payment_method,
      c.name AS clinic_name,
      p.name AS patient_name,
      p.reason_for_visit,
      cs.start_time,
      cs.end_time
    FROM appointments a
    JOIN clinics c ON a.clinic_id = c.id
    JOIN patients p ON a.patient_id = p.id
    LEFT JOIN clinic_schedule cs ON cs.clinic_id = c.id
    WHERE a.appointment_date > CURRENT_DATE
    ORDER BY a.appointment_date ASC, a.appointment_time ASC
    LIMIT 50;
  `;

  const clinicsMap: Record<string, any> = {};
  for (const r of rows) {
    const key = `${r.clinic_id}-${r.appointment_date}`;
    if (!clinicsMap[key]) {
      clinicsMap[key] = {
        day: new Date(r.appointment_date).toLocaleDateString("en-GB", { weekday: "long" }),
        date: new Date(r.appointment_date).toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
        time: formatTimeRange(r.start_time, r.end_time),
        location: r.clinic_name,
        status: "upcoming",
        patientsBooked: 0,
        slotsTotal: 9,
        patients: [],
      };
    }

    clinicsMap[key].patientsBooked++;
    const insurance =
      r.insurance_company ||
      r.payment_method ||
      "Self-Pay";

    clinicsMap[key].patients.push({
      name: r.patient_name,
      time: r.appointment_time?.slice(0, 5),
      reason: r.reason_for_visit || "Consultation",
      insurance,
      confirmed: true,
    });
  }

  return NextResponse.json(Object.values(clinicsMap));
}


