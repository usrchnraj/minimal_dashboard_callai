import { NextResponse } from "next/server";

// helper to convert 24-hour → 12-hour format
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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode"); // 'lastweek' or 'all'

  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL!);

  let rows;

  if (mode === "lastweek") {
    // ✅ Get only the two most recent distinct clinic dates (Tue + Wed only)
    rows = await sql/* sql */`
      WITH recent_clinic_dates AS (
        SELECT DISTINCT appointment_date
        FROM appointments
        WHERE appointment_date <= CURRENT_DATE
          AND EXTRACT(DOW FROM appointment_date) IN (2,3)
        ORDER BY appointment_date DESC
        LIMIT 2
      )
      SELECT 
        a.clinic_id,
        a.appointment_date,
        a.appointment_time,
        a.insurance_company,
        a.payment_method,
        c.name AS clinic_name,
        p.name AS patient_name,
        p.phone AS patient_phone,
        p.email AS patient_email,
        p.reason_for_visit,
        cs.start_time,
        cs.end_time
      FROM appointments a
      JOIN clinics c ON a.clinic_id = c.id
      JOIN patients p ON a.patient_id = p.id
      LEFT JOIN clinic_schedule cs ON cs.clinic_id = c.id
      WHERE a.appointment_date IN (SELECT appointment_date FROM recent_clinic_dates) AND a.status IN ('confirmed', 'completed', 'scheduled')
      ORDER BY a.appointment_date ASC, a.appointment_time ASC;
    `;
  } else {
    // 📜 Full historical completed list
    rows = await sql/* sql */`
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
      WHERE a.appointment_date <= CURRENT_DATE AND a.status IN ('confirmed', 'completed', 'scheduled')
      ORDER BY a.appointment_date ASC, a.appointment_time ASC
      LIMIT 100;
    `;
  }

  const clinicsMap: Record<string, any> = {};
  for (const r of rows) {
    const key = `${r.clinic_id}-${r.appointment_date}`;
    if (!clinicsMap[key]) {
      clinicsMap[key] = {
        day: new Date(r.appointment_date).toLocaleDateString("en-GB", { weekday: "long" }),
        date: new Date(r.appointment_date).toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
        time: formatTimeRange(r.start_time, r.end_time),
        location: r.clinic_name,
        status: "completed",
        patients: [],
      };
    }

    // unified insurance label
    let insurance = "Self-Pay";
    if (r.insurance_company && r.insurance_company.trim() !== "") insurance = r.insurance_company;
    else if (r.payment_method?.toLowerCase() === "insurance") insurance = "Insurance";
    else if (r.payment_method?.toLowerCase() === "self_pay") insurance = "Self-Pay";

    clinicsMap[key].patients.push({
      name: r.patient_name,
      reason: r.reason_for_visit || "Follow-up",
      insurance,
      attended: true,
      needsFollowup: Math.random() > 0.6,
      phone: r.patient_phone,
      email: r.patient_email,
      appointment_time: r.appointment_time,
    });

  }

  return NextResponse.json(Object.values(clinicsMap));
}



