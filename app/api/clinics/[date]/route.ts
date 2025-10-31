import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { choose } from "@/lib/flags";

// --- Live query from Neon ---
async function fetchLive(date: string) {
  const rows = await sql/* sql */`
    SELECT
      a.appointment_time,
      a.status,
      p.name AS patient_name,
      a.insurance_company
    FROM appointments a
    JOIN patients p ON p.id = a.patient_id
    JOIN clinics  c ON c.id = a.clinic_id
    WHERE a.appointment_date = ${date}::date
    ORDER BY a.appointment_time;
  `;
  return rows;
}

// --- Demo fallback for local testing ---
async function fetchDemo() {
  return [
    {
      appointment_time: "17:00",
      status: "completed",
      patient_name: "Sarah Henderson",
      insurance_company: "BUPA",
    },
    {
      appointment_time: "17:20",
      status: "completed",
      patient_name: "James Mitchell",
      insurance_company: "AXA",
    },
  ];
}

// --- Fixed handler (Next.js 15 compatible) ---
export async function GET(request: Request, context: { params: { date: string } }) {
  const { date } = context.params;

  const data = await choose(() => fetchLive(date), fetchDemo);
  return NextResponse.json(data);
}
