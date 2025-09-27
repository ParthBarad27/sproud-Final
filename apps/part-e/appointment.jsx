import React, { useState } from 'react';

// Mock consultant data directly included to avoid import errors
const mockConsultants = [
  { id: 'cons1', name: 'Dr. Anya Sharma', specialty: 'Anxiety & Stress', address: '123 Health Ave, Mumbai', availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '4:00 PM'] },
  { id: 'cons2', name: 'Mr. Rohan Desai', specialty: 'Student Life', address: '456 Wellness Rd, Pune', availableSlots: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'] },
  { id: 'cons3', name: 'Ms. Priya Singh', specialty: 'Mindfulness', address: '789 Serenity St, Delhi', availableSlots: ['10:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] },
];

const App = () => {
  const [userId] = useState('user123');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [crisisRequests, setCrisisRequests] = useState([]);
  const [message, setMessage] = useState('');

  const handleBookAppointment = () => {
    if (!selectedConsultant || !selectedSlot) { setMessage('Please select a consultant and a slot.'); return; }
    const newAppointment = { id: Date.now(), date: currentDate, consultantName: selectedConsultant.name, slot: selectedSlot };
    setAppointments([...appointments, newAppointment]);
    setMessage('Appointment booked successfully!');
    setSelectedSlot(null);
  };

  const handleEmergencyBooking = () => {
    if (!selectedConsultant || !selectedSlot) { setMessage('Please select a consultant and a slot.'); return; }
    const newRequest = { id: Date.now(), date: new Date(), mood: 'Immediate', consultantName: selectedConsultant.name, slot: selectedSlot };
    setCrisisRequests([...crisisRequests, newRequest]);
    setMessage('Emergency appointment booked successfully!');
    setSelectedSlot(null);
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
    setMessage('Appointment cancelled successfully.');
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const blanks = Array.from({ length: firstDay }, (_, i) => <div key={`b${i}`} className="w-10 h-10"></div>);
    const days = Array.from({ length: daysInMonth }, (_, i) => (
      <button key={i} onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1))} 
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 ${currentDate.getDate()===i+1?'bg-indigo-600 text-white':'bg-blue-100 hover:bg-blue-200'}`}>{i+1}</button>
    ));
    return [...blanks, ...days];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center p-6 font-sans space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700">Smart Booking & Crisis Intervention</h1>

      {/* Calendar Section */}
      <section className="w-full max-w-3xl bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2 text-indigo-700">Select Date</h2>
        <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-600">{renderCalendar()}</div>
      </section>

      {/* Consultant Section */}
      <section className="w-full max-w-3xl bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="font-semibold mb-2 text-indigo-700">Choose Consultant & Time</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mockConsultants.map(c => (
            <div key={c.id} className={`p-3 rounded-lg cursor-pointer border ${selectedConsultant?.id===c.id?'border-indigo-600 bg-indigo-50':'border-gray-200 hover:bg-gray-50'}`}>              
              <div onClick={() => { setSelectedConsultant(c); setSelectedSlot(null); }}>
                <div className="font-semibold text-indigo-700">{c.name}</div>
                <div className="text-sm text-gray-500">{c.specialty}</div>
                <div className="text-xs text-gray-400 mt-1">{c.address}</div>
              </div>
              {selectedConsultant?.id === c.id && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {c.availableSlots.map(slot => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)} 
                      className={`text-sm p-2 rounded transition-colors duration-200 ${selectedSlot===slot?'bg-indigo-600 text-white':'bg-gray-100 hover:bg-gray-200'}`}>{slot}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Booking Buttons */}
      <section className="w-full max-w-3xl flex flex-col sm:flex-row gap-3">
        <button onClick={handleBookAppointment} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">Book Appointment</button>
        <button onClick={handleEmergencyBooking} className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">Emergency Appointment</button>
      </section>

      {/* Upcoming Appointments Section */}
      <section className="w-full max-w-3xl bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2 text-indigo-700">Upcoming Appointments</h2>
        <ul className="space-y-2">
          {appointments.length>0 ? appointments.map(a => (
            <li key={a.id} className="p-2 bg-blue-50 rounded flex justify-between items-center">
              <span>{a.date.toLocaleDateString()} {a.slot} with {a.consultantName}</span>
              <button onClick={() => handleCancelAppointment(a.id)} className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
            </li>
          )) : <li className="text-gray-500 italic">No upcoming appointments</li>}
        </ul>
      </section>

      {/* Emergency Requests Section */}
      <section className="w-full max-w-3xl bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2 text-red-600">Emergency Requests</h2>
        <ul className="space-y-2">
          {crisisRequests.length>0 ? crisisRequests.map(cr => (
            <li key={cr.id} className="p-2 bg-red-50 rounded">{cr.date.toLocaleString()} - {cr.consultantName} ({cr.slot})</li>
          )) : <li className="text-gray-500 italic">No emergency requests</li>}
        </ul>
      </section>

      {/* Message modal */}
      {message && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full text-center">
            <h4 className="font-bold mb-2">Notice</h4>
            <p className="mb-4">{message}</p>
            <button onClick={() => setMessage('')} className="px-4 py-2 bg-indigo-600 text-white rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
