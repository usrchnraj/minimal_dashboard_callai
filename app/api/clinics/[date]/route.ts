import { NextResponse } from "next/server";
import { choose } from "@/lib/flags";

async function fetchLive(date: string) {
  // 👇 dynamically import Neon only when called
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL!);

  const rows = await sql/* sql */`
    SELECT
      a.appointment_time,
      a.status,
      p.name AS patient_name,
      a.insurance_company
    FROM appointments a
    JOIN patients p ON p.id = a.patient_id
    JOIN clinics c ON c.id = a.clinic_id
    WHERE a.appointment_date = ${date}::date
    ORDER BY a.appointment_time;
  `;

  return rows;
}

async function fetchDemo() {
  return [
    { appointment_time: "17:00", status: "completed", patient_name: "Sarah Henderson", insurance_company: "BUPA" },
    { appointment_time: "17:20", status: "completed", patient_name: "James Mitchell", insurance_company: "AXA" },
  ];
}

export async function GET(request: Request) {
  // Extract date from URL path (Next.js 15 style)
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const date = segments[segments.length - 1];

  // Run live Neon query or fallback demo
  const data = await choose(() => fetchLive(date), fetchDemo);

  return NextResponse.json(data);
}
