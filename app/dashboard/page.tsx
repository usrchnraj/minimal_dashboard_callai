// app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Phone, Check, AlertCircle, Clock, MapPin, ChevronRight, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // --- UI state (unchanged) ---
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const [followUpScheduled, setFollowUpScheduled] = useState({
    'Sarah Henderson': true,
    'Emma Knight': false,
    'Peter Roberts': true,
    'Robert Wilson': false,
    'Sophie Brown': false,
    'Maria Garcia': true,
    'John Anderson': false,
    'Elizabeth Clark': false,
  });

  const now = new Date();
  const currentDay = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const currentTime = now.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // ---- STATIC FALLBACK DATA (your original arrays) ----
  const fallbackThisWeekClinics = [
    {
      day: 'Tuesday',
      date: 'Oct 15',
      time: '5-8 PM',
      location: 'Princess Grace',
      status: 'completed',
      patients: [
        { name: 'Sarah Henderson', age: 45, reason: 'Lower back pain', insurance: 'BUPA', type: 'New', attended: true, needsFollowup: true },
        { name: 'James Mitchell', age: 62, reason: 'Post-op follow-up', insurance: 'AXA', type: 'Follow-up', attended: true, needsFollowup: false },
        { name: 'Emma Knight', age: 38, reason: 'MRI review', insurance: 'Self-pay', type: 'Review', attended: true, needsFollowup: true },
        { name: 'Peter Roberts', age: 51, reason: 'Neck pain', insurance: 'BUPA', type: 'New', attended: true, needsFollowup: true },
        { name: 'Linda Thompson', age: 58, reason: 'Follow-up', insurance: 'AXA', type: 'Follow-up', attended: true, needsFollowup: false },
        { name: 'Michael Davis', age: 43, reason: 'Shoulder pain', insurance: 'BUPA', type: 'New', attended: true, needsFollowup: false },
      ]
    },
    {
      day: 'Wednesday',
      date: 'Oct 16',
      time: '2-6 PM',
      location: 'London Clinic',
      status: 'completed',
      patients: [
        { name: 'Robert Wilson', age: 55, reason: 'Back surgery consult', insurance: 'AXA', type: 'New', attended: true, needsFollowup: true },
        { name: 'Sophie Brown', age: 42, reason: 'Neck pain', insurance: 'BUPA', type: 'New', attended: true, needsFollowup: true },
        { name: 'David Lee', age: 67, reason: 'Post-op review', insurance: 'Self-pay', type: 'Follow-up', attended: true, needsFollowup: false },
        { name: 'Maria Garcia', age: 48, reason: 'Lower back pain', insurance: 'BUPA', type: 'New', attended: true, needsFollowup: true },
        { name: 'John Anderson', age: 59, reason: 'MRI review', insurance: 'AXA', type: 'Review', attended: true, needsFollowup: true },
        { name: 'Patricia Moore', age: 52, reason: 'Follow-up', insurance: 'BUPA', type: 'Follow-up', attended: true, needsFollowup: false },
        { name: 'Thomas Taylor', age: 44, reason: 'Shoulder assessment', insurance: 'Self-pay', type: 'New', attended: false, needsFollowup: false },
        { name: 'Elizabeth Clark', age: 61, reason: 'Back pain', insurance: 'AXA', type: 'New', attended: true, needsFollowup: true },
      ]
    }
  ];

  const fallbackNextWeekClinics = [
    {
      day: 'Tuesday',
      date: 'Oct 22',
      time: '5-8 PM',
      location: 'Princess Grace',
      status: 'upcoming',
      patientsBooked: 4,
      slotsTotal: 9,
      patients: [
        { name: 'Alice Johnson', time: '5:00', reason: 'MRI review', insurance: 'BUPA', confirmed: true },
        { name: 'Mark Stevens', time: '5:20', reason: 'Follow-up', insurance: 'AXA', confirmed: true },
        { name: 'Rachel Green', time: '6:00', reason: 'New consultation', insurance: 'Self-pay', confirmed: false },
        { name: 'Daniel White', time: '7:00', reason: 'MRI review', insurance: 'BUPA', confirmed: true },
      ]
    },
    {
      day: 'Wednesday',
      date: 'Oct 23',
      time: '2-6 PM',
      location: 'London Clinic',
      status: 'upcoming',
      patientsBooked: 3,
      slotsTotal: 12,
      patients: [
        { name: 'Carol Martinez', time: '2:00', reason: 'New consultation', insurance: 'AXA', confirmed: true },
        { name: 'Steven Wright', time: '3:00', reason: 'Follow-up', insurance: 'BUPA', confirmed: true },
        { name: 'Nancy Lewis', time: '4:00', reason: 'MRI review', insurance: 'Self-pay', confirmed: false },
      ]
    }
  ];

  // ---- WEEK STATS (unchanged static for now) ----
  const thisWeekStats = {
    totalCalls: 20,
    newBookings: 7,
    gapsFilled: 2,
    totalPatients: 14,
    attended: 13,
    noShows: 1,
    needsFollowup: 8
  };

  // ---- LIVE DATA TOGGLE + STATE (new, safe) ----
  const useLiveData = process.env.NEXT_PUBLIC_USE_LIVE_DATA === 'true';
  const [thisWeekClinics, setThisWeekClinics] = useState<any[]>([]);
  const [nextWeekClinics, setNextWeekClinics] = useState<any[]>([]);

  useEffect(() => {
    if (!useLiveData) return; // don’t fetch in demo mode

    async function fetchClinics() {
      try {
        const [completedRes, upcomingRes] = await Promise.all([
          fetch('/api/clinics/completed', { cache: 'no-store' }),
          fetch('/api/clinics/upcoming', { cache: 'no-store' }),
        ]);
        const completed = await completedRes.json();
        const upcoming = await upcomingRes.json();

        // Very defensive: only accept arrays
        setThisWeekClinics(Array.isArray(completed) ? completed : []);
        setNextWeekClinics(Array.isArray(upcoming) ? upcoming : []);
      } catch (e) {
        console.error('Error fetching clinics', e);
        setThisWeekClinics([]);
        setNextWeekClinics([]);
      }
    }

    fetchClinics();
  }, [useLiveData]);

  // ---- Follow-up click (unchanged) ----
  const handleScheduleFollowup = (patientName: string) => {
    setFollowUpScheduled(prev => ({
      ...prev,
      [patientName]: true
    }));
  };

  // ============== CLINIC DETAIL VIEW (unchanged) ==============
  if (selectedClinic) {
    const clinic = selectedClinic;
    const isCompleted = clinic.status === 'completed';

    const formatInsurance = (insuranceCompany?: string, paymentMethod?: string) => {
      if (insuranceCompany && insuranceCompany.trim() !== '') return insuranceCompany;
      if (paymentMethod?.toLowerCase() === 'insurance') return 'Insurance';
      if (paymentMethod?.toLowerCase() === 'self_pay') return 'Self-Pay';
      return 'Self-Pay';
    };

    return (
      <div className="min-h-screen bg-white p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedClinic(null)}
            className="text-gray-400 hover:text-gray-600 mb-8 text-sm font-light"
          >
            ← Back
          </button>

          <div className="mb-12">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-3">
              {isCompleted ? 'Completed Clinic' : 'Upcoming Clinic'}
            </div>
            <div className="text-5xl font-light text-gray-900 mb-3">
              {clinic.date} • {clinic.day}
            </div>
            <div className="text-2xl font-light text-gray-500 mb-4">
              {clinic.time}
            </div>
            <div className="flex items-center gap-2 text-xl text-gray-400 font-light">
              <MapPin className="w-5 h-5" />
              <span>{clinic.location}</span>
            </div>
            {!isCompleted && (
              <div className="mt-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="text-4xl font-light text-gray-900">
                    {clinic.patientsBooked}
                  </div>
                  <div className="text-2xl text-gray-400 font-light">
                    / {clinic.slotsTotal} slots
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full transition-all"
                    style={{ width: `${(clinic.patientsBooked / clinic.slotsTotal) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {isCompleted && clinic.patients.filter((p: any) => p.needsFollowup).length > 0 && (
            <div className="mb-12 bg-teal-50 -mx-6 px-6 py-6 md:-mx-12 md:px-12">
              <div className="flex items-baseline gap-3 mb-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <div className="text-2xl font-light text-gray-900">
                  {clinic.patients.filter((p: any) => p.needsFollowup && !followUpScheduled[p.name as keyof typeof followUpScheduled]).length} patients need follow-up
                </div>
              </div>
              <div className="text-base text-gray-600 font-light">
                MRI scans ready within 1 week
              </div>
            </div>
          )}

          <div className="space-y-4">
            {clinic.patients.map((patient: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedPatient({ ...patient, clinic: clinic.location, clinicDay: clinic.day, clinicDate: clinic.date })}
                className="w-full text-left group"
              >
                <div className="flex items-start justify-between pb-4 border-b border-gray-100 group-hover:border-gray-300 transition-colors">
                  <div className="flex-1">
                    {!isCompleted && (
                      <div className="text-sm text-gray-400 font-light mb-1">
                        {patient.time} PM
                      </div>
                    )}
                    <div className="text-2xl font-light text-gray-900 group-hover:text-teal-600 transition-colors mb-1">
                      {patient.name}
                    </div>
                    <div className="text-base text-gray-500 font-light mb-2">
                      {patient.reason} • {formatInsurance(patient.insurance_company, patient.payment_method)}
                    </div>

                    {isCompleted && patient.needsFollowup && (
                      <div className="mt-2">
                        {followUpScheduled[patient.name as keyof typeof followUpScheduled] ? (
                          <div className="text-sm text-teal-600 font-light">
                            MRI follow-up scheduled
                          </div>
                        ) : (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleScheduleFollowup(patient.name);
                            }}
                            className="cursor-pointer text-sm text-gray-900 font-light underline hover:text-teal-600"
                          >
                            Need follow-up?
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    {isCompleted ? (
                      patient.attended ? (
                        <Check className="w-5 h-5 text-teal-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-gray-300" />
                      )
                    ) : (
                      patient.confirmed ? (
                        <Check className="w-5 h-5 text-teal-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      )
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============== PATIENT DETAIL VIEW (unchanged) ==============
  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-white p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedPatient(null)}
            className="text-gray-400 hover:text-gray-600 mb-8 text-sm font-light"
          >
            ← Back
          </button>

          <div className="space-y-12">
            <div>
              <div className="text-5xl font-light text-gray-900 mb-2">
                {selectedPatient.name}
              </div>
              <div className="text-xl text-gray-400 font-light">
                {selectedPatient.age} years old
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Appointment</div>
                <div className="text-2xl font-light text-gray-900">
                  {selectedPatient.clinicDate} • {selectedPatient.clinicDay}
                </div>
                <div className="text-xl text-gray-500 font-light mt-1">
                  {selectedPatient.time} • {selectedPatient.clinic}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Reason</div>
                <div className="text-2xl font-light text-gray-900">
                  {selectedPatient.reason}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Insurance</div>
                  <div className="text-xl font-light text-gray-900">
                    {selectedPatient.insurance}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Type</div>
                  <div className="text-xl font-light text-gray-900">
                    {selectedPatient.type}
                  </div>
                </div>
              </div>
            </div>

            {selectedPatient.needsFollowup && (
              <div className="pt-8 border-t border-gray-100">
                {followUpScheduled[selectedPatient.name as keyof typeof followUpScheduled] ? (
                  <div className="bg-teal-50 -mx-6 px-6 py-6 rounded-lg">
                    <div className="text-lg text-teal-600 font-light">
                      ✓ MRI follow-up scheduled
                    </div>
                    <div className="text-base text-gray-600 font-light mt-2">
                      AI will call patient next week to book review appointment
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg font-light text-gray-900 mb-4">
                      MRI scan ready within 1 week
                    </div>
                    <button
                      onClick={() => handleScheduleFollowup(selectedPatient.name)}
                      className="text-gray-900 hover:text-teal-600 font-light underline text-lg"
                    >
                      Need follow-up?
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============== HOME VIEW (unchanged visual; live-data aware) ==============
  const displayThisWeek = useLiveData && thisWeekClinics.length > 0 ? thisWeekClinics : fallbackThisWeekClinics;
  const displayNextWeek = useLiveData && nextWeekClinics.length > 0 ? nextWeekClinics : fallbackNextWeekClinics;

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">

        <div className="mb-12">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">
            {currentDay} • {currentTime}
          </div>
          <div className="text-3xl font-light text-gray-900">
            Weekly Overview
          </div>
        </div>

        <div className="mb-16">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-6">
            This Week
          </div>

          <div className="mb-12 bg-teal-50 -mx-6 px-6 py-8 md:-mx-12 md:px-12">
            <div className="flex items-baseline gap-3 mb-6">
              <Phone className="w-6 h-6 text-teal-600" />
              <div className="text-3xl font-light text-gray-900">
                {thisWeekStats.totalCalls} calls handled this week
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-4xl font-light text-gray-900 mb-1">
                  {thisWeekStats.newBookings}
                </div>
                <div className="text-base text-gray-600 font-light">
                  appointments booked
                </div>
              </div>
              <div>
                <div className="text-4xl font-light text-gray-900 mb-1">
                  {thisWeekStats.gapsFilled}
                </div>
                <div className="text-base text-gray-600 font-light">
                  gaps filled
                </div>
              </div>
              <div>
                <div className="text-4xl font-light text-gray-900 mb-1">
                  {thisWeekStats.attended}/{thisWeekStats.totalPatients}
                </div>
                <div className="text-base text-gray-600 font-light">
                  attended
                </div>
              </div>
            </div>

            <Link
              href="/calls"
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-light group"
            >
              <span>View all calls</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {thisWeekStats.needsFollowup > 0 && (
            <div className="mb-8 bg-amber-50 -mx-6 px-6 py-8 md:-mx-12 md:px-12">
              <div className="flex items-baseline gap-3 mb-4">
                <Calendar className="w-6 h-6 text-amber-600" />
                <div className="text-2xl font-light text-gray-900">
                  Completed Clinic
                </div>
              </div>
              <div className="text-base text-gray-600 font-light mb-1">
                Review {Object.values(followUpScheduled).filter(v => !v).length} patients below and trigger AI to book follow-up appointments
              </div>
            </div>
          )}

          <div className="space-y-6">
            {displayThisWeek.map((clinic: any, idx: number) => {
              // defensive: ensure array
              const patients = Array.isArray(clinic.patients) ? clinic.patients : [];
              const followupNeeded = patients.filter(
                (p: any) => p.needsFollowup && !followUpScheduled[p.name as keyof typeof followUpScheduled]
              ).length;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedClinic(clinic)}
                  className="w-full text-left group"
                >
                  <div className="pb-6 border-b border-gray-100 group-hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-2xl font-light text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                          {clinic.date} • {clinic.day}
                        </div>
                        <div className="text-lg text-gray-500 font-light mb-2">
                          {clinic.time}
                        </div>
                        <div className="flex items-center gap-2 text-base text-gray-500 font-light mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{clinic.location}</span>
                        </div>
                        <div className="text-base text-gray-500 font-light">
                          {patients.length} patients • {patients.filter((p: any) => p.attended).length} attended
                        </div>
                        {followupNeeded > 0 && (
                          <div className="mt-2 text-sm text-amber-600 font-light">
                            {followupNeeded} need follow-up
                          </div>
                        )}
                      </div>
                      <div>
                        <Check className="w-6 h-6 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-12 pt-12 border-t-2 border-gray-100">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-6">
            Upcoming Clinic List
          </div>

          <div className="space-y-6">
            {displayNextWeek.map((clinic: any, idx: number) => {
              const unconfirmed = Array.isArray(clinic.patients)
                ? clinic.patients.filter((p: any) => !p.confirmed).length
                : 0;
              const booked = Number(clinic.patientsBooked || 0);
              const total = Math.max(1, Number(clinic.slotsTotal || 0));
              const fillPercentage = Math.round((booked / total) * 100);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedClinic(clinic)}
                  className="w-full text-left group"
                >
                  <div className="pb-6 border-b border-gray-100 group-hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-2xl font-light text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                          {clinic.date} • {clinic.day}
                        </div>
                        <div className="text-lg text-gray-500 font-light mb-3">
                          {clinic.time}
                        </div>
                        <div className="flex items-center gap-2 text-base text-gray-500 font-light mb-4">
                          <MapPin className="w-4 h-4" />
                          <span>{clinic.location}</span>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-baseline gap-2 mb-2">
                            <div className="text-4xl font-light text-gray-900">
                              {booked}
                            </div>
                            <div className="text-2xl text-gray-400 font-light">
                              / {total} slots
                            </div>
                            <div className="text-base text-gray-500 font-light">
                              ({fillPercentage}%)
                            </div>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-teal-600 h-full transition-all"
                              style={{ width: `${fillPercentage}%` }}
                            />
                          </div>
                        </div>
                        {unconfirmed > 0 && (
                          <div className="text-sm text-amber-600 font-light">
                            {unconfirmed} not confirmed yet
                          </div>
                        )}
                      </div>
                      <div>
                        <Clock className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <div className="text-xs text-gray-400 font-light">
            Updated 2 minutes ago
          </div>
        </div>
      </div>
    </div>
  );
}
