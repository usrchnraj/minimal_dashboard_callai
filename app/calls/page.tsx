// app/calls/page.tsx
'use client';

import React, { useState } from 'react';
import { Phone, Check, X, Clock, ArrowLeft, PlayCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function CallsPage() {
  const [selectedCall, setSelectedCall] = useState<any>(null);

  // Call data with outcomes
  const calls = [
    {
      id: 1,
      time: '11:05 AM',
      date: 'Oct 16',
      patient: 'Emma Knight',
      age: 38,
      type: 'Inbound',
      duration: '2m 18s',
      outcome: 'Appointment Booked',
      outcomeType: 'success',
      details: 'Patient called to confirm Wednesday 3pm appointment. Asked about parking - directions sent via email.',
      appointmentDate: 'Oct 23',
      appointmentTime: '3:00 PM',
      clinic: 'London Clinic',
      insurance: 'Self-pay',
      reason: 'MRI review',
    },
    {
      id: 2,
      time: '10:32 AM',
      date: 'Oct 16',
      patient: 'James Mitchell',
      age: 62,
      type: 'Outbound Reminder',
      duration: '1m 4s',
      outcome: 'Confirmed',
      outcomeType: 'success',
      details: 'Reminder call for Tuesday 5:30pm appointment. Patient confirmed attending.',
      appointmentDate: 'Oct 15',
      appointmentTime: '5:30 PM',
      clinic: 'Princess Grace',
      insurance: 'AXA',
      reason: 'Post-op follow-up',
    },
    {
      id: 3,
      time: '9:14 AM',
      date: 'Oct 16',
      patient: 'Sarah Henderson',
      age: 45,
      type: 'Inbound',
      duration: '3m 42s',
      outcome: 'Appointment Booked',
      outcomeType: 'success',
      details: 'New patient booking. Lower back pain radiating down right leg for 6 months. Worse in morning. Previous GP treatment with painkillers. No MRI yet.',
      appointmentDate: 'Oct 15',
      appointmentTime: '5:00 PM',
      clinic: 'Princess Grace',
      insurance: 'BUPA',
      reason: 'Lower back pain',
      revenue: 420,
    },
    {
      id: 4,
      time: '8:50 AM',
      date: 'Oct 16',
      patient: 'Peter Roberts',
      age: 51,
      type: 'Outbound Reminder',
      duration: '0m 45s',
      outcome: 'No Answer',
      outcomeType: 'warning',
      details: 'Reminder call - no answer. Voicemail left. Will retry.',
      appointmentDate: 'Oct 15',
      appointmentTime: '6:30 PM',
      clinic: 'Princess Grace',
      insurance: 'BUPA',
      reason: 'Neck pain',
    },
    {
      id: 5,
      time: '4:20 PM',
      date: 'Oct 15',
      patient: 'Michael Davis',
      age: 43,
      type: 'Outbound Gap Fill',
      duration: '2m 35s',
      outcome: 'Appointment Booked',
      outcomeType: 'success',
      details: 'Called from waitlist. Offered 7:30pm slot. Patient accepted. Shoulder pain 2 weeks, sports injury.',
      appointmentDate: 'Oct 15',
      appointmentTime: '7:30 PM',
      clinic: 'Princess Grace',
      insurance: 'BUPA',
      reason: 'Shoulder pain',
      revenue: 380,
      gapFilled: true,
    },
    {
      id: 6,
      time: '2:15 PM',
      date: 'Oct 15',
      patient: 'Rachel Green',
      age: 34,
      type: 'Inbound',
      duration: '4m 10s',
      outcome: 'Appointment Booked',
      outcomeType: 'success',
      details: 'New patient. Back pain 3 months. Desk job. Tried physiotherapy. Wants consultation.',
      appointmentDate: 'Oct 22',
      appointmentTime: '6:00 PM',
      clinic: 'Princess Grace',
      insurance: 'Self-pay',
      reason: 'Back pain consultation',
      revenue: 450,
    },
    {
      id: 7,
      time: '11:40 AM',
      date: 'Oct 15',
      patient: 'David Wilson',
      age: 58,
      type: 'Inbound',
      duration: '1m 25s',
      outcome: 'Rescheduled',
      outcomeType: 'neutral',
      details: 'Patient called to reschedule from Oct 16 to Oct 23. Moved to Wednesday 4pm.',
      appointmentDate: 'Oct 23',
      appointmentTime: '4:00 PM',
      clinic: 'London Clinic',
      insurance: 'AXA',
      reason: 'Follow-up',
    },
    {
      id: 8,
      time: '9:05 AM',
      date: 'Oct 15',
      patient: 'Sophie Martinez',
      age: 29,
      type: 'Inbound',
      duration: '2m 50s',
      outcome: 'Cancelled',
      outcomeType: 'cancelled',
      details: 'Patient called to cancel appointment. No longer needed - pain resolved with physiotherapy.',
      appointmentDate: null,
      insurance: 'BUPA',
    },
  ];

  const stats = {
    totalCalls: calls.length,
    booked: calls.filter(c => c.outcome === 'Appointment Booked').length,
    confirmed: calls.filter(c => c.outcome === 'Confirmed').length,
    noAnswer: calls.filter(c => c.outcome === 'No Answer').length,
    rescheduled: calls.filter(c => c.outcome === 'Rescheduled').length,
    cancelled: calls.filter(c => c.outcome === 'Cancelled').length,
    totalRevenue: calls.reduce((sum, c) => sum + (c.revenue || 0), 0),
    gapsFilled: calls.filter(c => c.gapFilled).length,
  };

  const getOutcomeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-teal-600 bg-teal-50';
      case 'warning': return 'text-amber-600 bg-amber-50';
      case 'neutral': return 'text-gray-600 bg-gray-50';
      case 'cancelled': return 'text-gray-400 bg-gray-50';
      default: return 'text-gray-600';
    }
  };

  // CALL DETAIL VIEW
  if (selectedCall) {
    return (
      <div className="min-h-screen bg-white p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setSelectedCall(null)}
            className="text-gray-400 hover:text-gray-600 mb-8 text-sm font-light flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all calls
          </button>

          <div className="space-y-12">
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                {selectedCall.date} • {selectedCall.time}
              </div>
              <div className="text-5xl font-light text-gray-900 mb-2">
                {selectedCall.patient}
              </div>
              <div className="text-xl text-gray-400 font-light">
                {selectedCall.age} years old
              </div>
            </div>

            <div className={`-mx-6 px-6 py-6 rounded-lg ${getOutcomeColor(selectedCall.outcomeType)}`}>
              <div className="text-2xl font-light text-gray-900 mb-1">
                {selectedCall.outcome}
              </div>
              <div className="text-base font-light opacity-75">
                {selectedCall.type} • {selectedCall.duration}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Call Details</div>
                <div className="text-xl font-light text-gray-900 leading-relaxed">
                  {selectedCall.details}
                </div>
              </div>

              {selectedCall.appointmentDate && (
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Appointment</div>
                  <div className="text-xl font-light text-gray-900">
                    {selectedCall.appointmentDate} • {selectedCall.appointmentTime}
                  </div>
                  <div className="text-base text-gray-500 font-light mt-1">
                    {selectedCall.clinic}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Insurance</div>
                  <div className="text-xl font-light text-gray-900">
                    {selectedCall.insurance}
                  </div>
                </div>
                {selectedCall.reason && (
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Reason</div>
                    <div className="text-xl font-light text-gray-900">
                      {selectedCall.reason}
                    </div>
                  </div>
                )}
              </div>

              {selectedCall.gapFilled && (
                <div className="pt-6 border-t border-gray-100">
                  <div className="text-teal-600 font-light flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Gap filled from waitlist</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-gray-100">
              <button className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-light text-lg">
                <PlayCircle className="w-5 h-5" />
                <span>Listen to call recording</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CALLS LIST VIEW
  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/dashboard"
            className="text-gray-400 hover:text-gray-600 mb-4 text-sm font-light flex items-center gap-2 inline-flex"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-3 mt-6">
            Call History
          </div>
          <div className="text-5xl font-light text-gray-900">
            All Calls
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mb-16 bg-teal-50 -mx-6 px-6 py-8 md:-mx-12 md:px-12">
          <div className="flex items-baseline gap-3 mb-8">
            <Phone className="w-6 h-6 text-teal-600" />
            <div className="text-3xl font-light text-gray-900">
              {stats.totalCalls} calls this week
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <div className="text-4xl font-light text-gray-900 mb-1">
                {stats.booked}
              </div>
              <div className="text-sm text-gray-600 font-light">
                appointments booked
              </div>
            </div>
            <div>
              <div className="text-4xl font-light text-gray-900 mb-1">
                {stats.confirmed}
              </div>
              <div className="text-sm text-gray-600 font-light">
                reminders confirmed
              </div>
            </div>
            <div>
              <div className="text-4xl font-light text-gray-900 mb-1">
                {stats.gapsFilled}
              </div>
              <div className="text-sm text-gray-600 font-light">
                gaps filled
              </div>
            </div>
            <div>
              <div className="text-4xl font-light text-gray-900 mb-1">
                {stats.rescheduled + stats.cancelled}
              </div>
              <div className="text-sm text-gray-600 font-light">
                rescheduled/cancelled
              </div>
            </div>
          </div>

          {/* Minimal ROI */}
          <div className="pt-6 border-t border-teal-100">
            <div className="text-sm text-gray-500 font-light mb-1">
              Appointments generated this week
            </div>
            <div className="text-2xl font-light text-gray-900">
              {stats.booked + stats.confirmed} patients secured
            </div>
          </div>
        </div>

        {/* Call List */}
        <div className="space-y-4">
          {calls.map((call) => (
            <button
              key={call.id}
              onClick={() => setSelectedCall(call)}
              className="w-full text-left group"
            >
              <div className="pb-4 border-b border-gray-100 group-hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-1">
                      <div className="text-sm text-gray-400 font-light">
                        {call.date} • {call.time}
                      </div>
                      <div className="text-xs text-gray-400 font-light">
                        {call.duration}
                      </div>
                    </div>
                    <div className="text-2xl font-light text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                      {call.patient}
                    </div>
                    <div className="text-base text-gray-500 font-light mb-2">
                      {call.type} • {call.reason || 'Call'}
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm font-light ${getOutcomeColor(call.outcomeType)}`}>
                      {call.outcomeType === 'success' && <Check className="w-4 h-4" />}
                      {call.outcomeType === 'warning' && <Clock className="w-4 h-4" />}
                      {call.outcomeType === 'cancelled' && <X className="w-4 h-4" />}
                      <span>{call.outcome}</span>
                    </div>
                  </div>
                  {call.gapFilled && (
                    <div className="text-xs uppercase tracking-wider text-teal-600 font-medium">
                      Gap filled
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="text-xs text-gray-400 font-light">
            Showing all calls from Oct 15-16, 2025
          </div>
        </div>
      </div>
    </div>
  );
}