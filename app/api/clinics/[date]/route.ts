import { sql } from '@/lib/db';
import { choose } from '@/lib/flags';

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

async function fetchDemo() {
  return [
    { appointment_time: '17:00', status: 'completed', patient_name: 'Sarah Henderson', insurance_company: 'BUPA' },
    { appointment_time: '17:20', status: 'completed', patient_name: 'James Mitchell', insurance_company: 'AXA' },
  ];
}

export async function GET(_req: Request, { params }: { params: { date: string } }) {
  const data = await choose(() => fetchLive(params.date), fetchDemo);
  return Response.json(data);
}
