import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  // Timestamp is a helper type — safe to import even if Firestore fails to initialize.
  Timestamp,
  getDocs,
  doc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

// Firebase configuration (kept as provided)
const firebaseConfig = {
  apiKey: "AIzaSyBLkN4LkQP2k8lnICr7xBuba4lImV9kniw",
  authDomain: "my-mental-health-app-5695d.firebaseapp.com",
  projectId: "my-mental-health-app-5695d",
  storageBucket: "my-mental-health-app-5695d.firebasestorage.app",
  messagingSenderId: "811865010699",
  appId: "1:811865010699:web:8c2e15b80c93a97efa0d0e",
  measurementId: "G-TM75ZEH38Q"
};

// App constants
const appId = 'my-consultant-dashboard-app';
const MOCK_CONSULTANT_ID = 'cons1';

// Utility
const generateUserId = () => `anon-${Math.random().toString(36).substr(2, 9)}`;
const safeToDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  if (typeof value === 'string') return new Date(value);
  if (value instanceof Date) return value;
  return null;
};

const moodEmojis = {
  happy: '😊',
  sad: '😔',
  anxious: '😟',
  stressed: '😩',
  calm: '😌',
  hopeful: '✨',
};

// Small mock data used when Firebase can't be initialized (safe to run in any environment)
const SAMPLE_APPOINTMENTS = [
  {
    id: 'sample_upcoming_1',
    bookedBy: 'student_001',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24), // tomorrow
    mood: 'anxious',
    consultantNotes: '',
    rating: null,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_upcoming_2',
    bookedBy: 'student_003',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // in 2 days
    mood: 'hopeful',
    consultantNotes: '',
    rating: null,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_upcoming_3',
    bookedBy: 'student_004',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // in 5 days
    mood: 'calm',
    consultantNotes: '',
    rating: null,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_past_1',
    bookedBy: 'student_002',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // two days ago
    mood: 'calm',
    consultantNotes: 'Initial session notes (mock).',
    rating: 4,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'sample_past_2',
    bookedBy: 'student_005',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // a week ago
    mood: 'happy',
    consultantNotes: 'Follow-up complete.',
    rating: 5,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
];

// New requests sample data (including a crisis request)
const SAMPLE_NEW_REQUESTS = [
  {
    id: 'req_101',
    bookedBy: 'student_006',
    date: new Date(Date.now() + 1000 * 60 * 30), // in 30 minutes
    slot: '10:30 AM - 11:00 AM',
    mood: 'stressed',
    isCrisis: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req_102',
    bookedBy: 'student_007',
    date: new Date(Date.now() + 1000 * 60 * 60 * 3), // in 3 hours
    slot: '2:00 PM - 2:30 PM',
    mood: 'anxious',
    isCrisis: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req_103',
    bookedBy: 'student_008',
    date: new Date(Date.now() + 1000 * 60 * 10), // in 10 minutes
    slot: 'Immediate',
    mood: 'sad',
    isCrisis: true,
    createdAt: new Date().toISOString(),
  },
];

const App = () => {
  // firebase instances
  const [app, setApp] = useState(null);
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);

  // UI state
  const [userId, setUserId] = useState('');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [newRequests, setNewRequests] = useState([]);
  const [crisisRequests, setCrisisRequests] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState({});
  const [ratings, setRatings] = useState({});
  const [mockMode, setMockMode] = useState(false);

  // Firestore paths
  const publicAppointmentsPath = `artifacts/${appId}/public/data/appointments`;
  const privateAppointmentsPath = `artifacts/${appId}/users`;

  // Initialize Firebase safely. Uses getApps() to avoid "already initialized" errors in HMR/dev.
  // Falls back to mock mode if anything goes wrong (so UI still renders and developer can continue).
  useEffect(() => {
    let unsubscribeAuth = null;

    const init = async () => {
      // guard for server-side rendering or non-browser environment
      if (typeof window === 'undefined') {
        console.warn('Not running in a browser environment — switching to mock mode.');
        setMessage('Running outside browser — Firebase disabled (mock mode).');
        setMockMode(true);
        setIsAuthReady(true);
        setLoading(false);
        return;
      }

      try {
        const apps = getApps();
        const firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);
        const firebaseAuth = getAuth(firebaseApp);
        const firestoreDb = getFirestore(firebaseApp);

        setApp(firebaseApp);
        setAuth(firebaseAuth);
        setDb(firestoreDb);

        // try anonymous sign-in for development; if it fails, we continue but notify the user
        try {
          await signInAnonymously(firebaseAuth);
        } catch (err) {
          console.warn('Anonymous sign-in failed (continuing in read-only mode):', err);
          setMessage('Authentication failed (anonymous). You may have limited access.');
        }

        unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
          if (user) setUserId(user.uid);
          else setUserId(generateUserId());
          setIsAuthReady(true);
        });
      } catch (err) {
        // If anything throws while initializing Firebase, fall back to mock data.
        console.error('Firebase initialization failed:', err);
        setMessage(`Firebase initialization failed: ${err?.message ?? String(err)}`);
        setMockMode(true);
        setIsAuthReady(true);
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
    };
  }, []);

  // If mock mode is active, populate sample data so UI remains interactive for dev/testing.
  useEffect(() => {
    if (mockMode) {
      setAppointments(SAMPLE_APPOINTMENTS.map(a => ({ ...a })));
      // populate new requests and crisis requests from sample data
      setNewRequests(SAMPLE_NEW_REQUESTS.filter(r => !r.isCrisis).map(r => ({ ...r })));
      setCrisisRequests(SAMPLE_NEW_REQUESTS.filter(r => r.isCrisis).map(r => ({ ...r })));
      setLoading(false);
    }
  }, [mockMode]);

  // Listen to Firestore (only when db is available)
  useEffect(() => {
    if (!db || !isAuthReady || mockMode) return;
    setLoading(true);

    const q = query(collection(db, publicAppointmentsPath), where('consultantId', '==', MOCK_CONSULTANT_ID));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const fetchedAppointments = snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            date: safeToDate(data?.date) || null,
          };
        });
        setAppointments(fetchedAppointments);
      } catch (err) {
        console.error('Error processing snapshot:', err);
        setMessage('Error processing appointments snapshot. See console.');
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Firestore onSnapshot error (appointments):', error);
      setMessage('Failed to load appointments from Firestore.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, isAuthReady, publicAppointmentsPath, mockMode]);

  // Listen for new/unmatched requests (only when db available)
  useEffect(() => {
    if (!db || !isAuthReady || mockMode) return;

    const q = query(collection(db, publicAppointmentsPath), where('consultantId', '==', null));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const requests = snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            date: safeToDate(data?.date) || null,
          };
        });
        setNewRequests(requests.filter(r => !r.isCrisis));
        setCrisisRequests(requests.filter(r => r.isCrisis));
      } catch (err) {
        console.error('Error processing snapshot (requests):', err);
      }
    }, (error) => {
      console.error('Firestore onSnapshot error (requests):', error);
    });

    return () => unsubscribe();
  }, [db, isAuthReady, publicAppointmentsPath, mockMode]);

  // Helper functions
  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments
      .filter(app => app.date && app.date > now)
      .sort((a, b) => a.date - b.date);
  };

  const getPastAppointments = () => {
    const now = new Date();
    return appointments
      .filter(app => app.date && app.date <= now)
      .sort((a, b) => b.date - a.date);
  };

  // Save notes: supports both Firestore (when db exists) and mock-mode local update.
  const handleSaveNotes = async (appointmentId) => {
    const appointment = appointments.find(a => a.id === appointmentId) || crisisRequests.find(r => r.id === appointmentId);
    if (!appointment) return;
    if (!notes[appointmentId] && !ratings[appointmentId]) return; // nothing to save

    // Mock-mode: update local state
    if (!db || mockMode) {
      setAppointments(prev => prev.map(a => a.id === appointmentId ? {
        ...a,
        consultantNotes: notes[appointmentId] || a.consultantNotes || '',
        rating: ratings[appointmentId] || a.rating || null,
        status: 'completed',
        updatedAt: new Date(),
      } : a));

      setMessage('Session notes and rating saved (mock).');
      return;
    }

    // Firestore mode
    try {
      const studentAppointmentsPath = `${privateAppointmentsPath}/${appointment.bookedBy}/appointments`;
      const q = query(collection(db, studentAppointmentsPath), where('createdAt', '==', appointment.createdAt));
      const studentDocs = await getDocs(q);

      const batch = writeBatch(db);
      const publicAppointmentRef = doc(db, publicAppointmentsPath, appointmentId);
      batch.update(publicAppointmentRef, {
        consultantNotes: notes[appointmentId] || '',
        rating: ratings[appointmentId] || null,
        status: 'completed',
        updatedAt: Timestamp.now(),
      });

      if (!studentDocs.empty) {
        studentDocs.forEach((d) => {
          batch.update(d.ref, {
            consultantNotes: notes[appointmentId] || '',
            rating: ratings[appointmentId] || null,
            status: 'completed',
            updatedAt: Timestamp.now(),
          });
        });
      }

      await batch.commit();
      setMessage('Session notes and rating saved successfully!');
    } catch (e) {
      console.error('Error saving notes:', e);
      setMessage('Failed to save notes. Please try again.');
    }
  };

  // Reschedule (Firestore or mock)
  const handleReschedule = async (appointmentId) => {
    if (!db || mockMode) {
      setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'rescheduled', updatedAt: new Date() } : a));
      setMessage('Appointment marked as rescheduled (mock).');
      return;
    }

    try {
      const appointmentDocRef = doc(db, publicAppointmentsPath, appointmentId);
      await updateDoc(appointmentDocRef, { status: 'rescheduled', updatedAt: Timestamp.now() });
      setMessage('Appointment marked as rescheduled.');
    } catch (e) {
      console.error('Error rescheduling:', e);
      setMessage('Failed to reschedule.');
    }
  };

  // Match student (Firestore or mock)
  const handleMatchStudent = async (appointmentId) => {
    if (!db || mockMode) {
      setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, consultantId: MOCK_CONSULTANT_ID, consultantName: 'Dr. Anya Sharma', status: 'matched', updatedAt: new Date() } : a));
      setMessage('New student request matched to your profile (mock).');
      return;
    }

    try {
      const appointmentDocRef = doc(db, publicAppointmentsPath, appointmentId);
      await updateDoc(appointmentDocRef, {
        consultantId: MOCK_CONSULTANT_ID,
        consultantName: 'Dr. Anya Sharma',
        status: 'matched',
        updatedAt: Timestamp.now(),
      });
      setMessage('New student request matched to your profile!');
    } catch (e) {
      console.error('Error matching student:', e);
      setMessage('Failed to match student.');
    }
  };

  const handleToggleAvailability = () => {
    setIsAvailable(prev => !prev);
    setMessage(!isAvailable ? 'You are now on call for crisis intervention.' : 'You are now offline for crisis intervention.');
  };

  // Render
  const renderTabContent = () => {
    if (loading) return <div className="text-center py-8">Loading dashboard...</div>;

    const upcomingAppointments = getUpcomingAppointments();
    const pastAppointments = getPastAppointments();

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-105">
                <h3 className="text-lg font-semibold text-indigo-700">Upcoming Sessions</h3>
                <p className="text-4xl font-extrabold text-indigo-600 mt-2">{upcomingAppointments.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-105">
                <h3 className="text-lg font-semibold text-green-700">Completed Sessions</h3>
                <p className="text-4xl font-extrabold text-green-600 mt-2">{pastAppointments.length}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-105">
                <h3 className="text-lg font-semibold text-yellow-700">New Requests</h3>
                <p className="text-4xl font-extrabold text-yellow-600 mt-2">{newRequests.length}</p>
              </div>
            </div>
          </div>
        );

      case 'upcoming':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Sessions</h2>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(app => (
                <div key={app.id} className="bg-white p-4 rounded-lg shadow-sm border-2 border-indigo-100">
                  <p className="text-lg font-semibold text-gray-800">{app.date ? app.date.toLocaleString() : '—'}</p>
                  <p className="text-sm text-gray-500">Student ID: {app.bookedBy}</p>
                  <p className="text-sm text-gray-500">Mood check-in: {app.mood ? `${moodEmojis[app.mood]} ${app.mood}` : 'N/A'}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleReschedule(app.id)}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleSaveNotes(app.id)}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-green-100 text-green-800 hover:bg-green-200"
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No upcoming sessions.</p>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Session History</h2>
            {pastAppointments.length > 0 ? (
              pastAppointments.map(app => (
                <div key={app.id} className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-100">
                  <p className="text-lg font-semibold text-gray-800">{app.date ? app.date.toLocaleString() : '—'}</p>
                  <p className="text-sm text-gray-500">Student ID: {app.bookedBy}</p>
                  <div className="mt-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Consultant Notes</label>
                    <textarea
                      value={notes[app.id] ?? app.consultantNotes ?? ''}
                      onChange={(e) => setNotes({ ...notes, [app.id]: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="3"
                      placeholder="Add session notes..."
                    />
                    <label className="block text-sm font-medium text-gray-700">Session Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setRatings({ ...ratings, [app.id]: star })}
                          className={`text-2xl ${((ratings[app.id] ?? app.rating) || 0) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveNotes(app.id)}
                    className="mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Save Notes & Rating
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No past sessions.</p>
            )}
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">New Student Requests (Matching)</h2>
            {newRequests.length > 0 ? (
              newRequests.map(req => (
                <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="font-semibold text-blue-800">New Request from Student</p>
                    <p className="text-sm text-blue-600">Mood check-in: {req.mood ? `${moodEmojis[req.mood]} ${req.mood}` : 'N/A'}</p>
                    <p className="text-xs text-gray-500">Time: {req.slot ?? '—'}, Date: {req.date ? req.date.toLocaleDateString() : '—'}</p>
                  </div>
                  <button
                    onClick={() => handleMatchStudent(req.id)}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Match Student
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No new requests at the moment.</p>
            )}
          </div>
        );

      case 'crisis':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Crisis Intervention</h2>
              <button
                onClick={handleToggleAvailability}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-colors duration-300 ${isAvailable ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
              >
                {isAvailable ? 'Go Offline' : 'Go On Call'}
              </button>
            </div>
            {crisisRequests.length > 0 ? (
              crisisRequests.map(req => (
                <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border-2 border-red-500 animate-pulse">
                  <p className="text-lg font-bold text-red-600">URGENT: Crisis Intervention Request</p>
                  <p className="text-sm text-gray-500">Student ID: {req.bookedBy}</p>
                  <p className="text-sm text-gray-500">Time: {req.date ? req.date.toLocaleString() : '—'}</p>
                  <p className="text-sm text-gray-500 mt-2">Initial Check-in: {req.mood ? `${moodEmojis[req.mood]} ${req.mood}` : 'N/A'}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleMatchStudent(req.id)}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Respond Now
                    </button>
                    <button
                      onClick={() => handleSaveNotes(req.id)}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Mark as Handled
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No crisis requests at the moment.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4 sm:p-8 font-sans antialiased">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-extrabold text-gray-800">Consultant Dashboard</h1>
          <p className="text-sm text-gray-400">User ID: {userId || (mockMode ? 'mock-user' : '—')}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-start space-x-2 border-b-2 border-gray-200 mb-6">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 font-semibold transition-colors duration-200 rounded-t-lg ${activeTab === 'dashboard' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('upcoming')} className={`px-4 py-2 font-semibold transition-colors duration-200 rounded-t-lg ${activeTab === 'upcoming' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>Upcoming</button>
          <button onClick={() => setActiveTab('history')} className={`px-4 py-2 font-semibold transition-colors duration-200 rounded-t-lg ${activeTab === 'history' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>History</button>
          <button onClick={() => setActiveTab('matching')} className={`px-4 py-2 font-semibold transition-colors duration-200 rounded-t-lg ${activeTab === 'matching' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>New Requests</button>
          <button onClick={() => setActiveTab('crisis')} className={`px-4 py-2 font-semibold transition-colors duration-200 rounded-t-lg ${activeTab === 'crisis' ? 'text-red-600 border-b-4 border-red-600' : 'text-gray-500 hover:text-gray-800'}`}>Crisis</button>
        </div>

        {renderTabContent()}
      </div>

      {/* Message Modal */}
      {message && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-6 bg-white w-96 rounded-lg shadow-xl text-center">
            <h3 className="text-lg font-bold mb-4">{message.toLowerCase().includes('success') ? 'Success!' : 'Note'}</h3>
            <p className="mb-6 text-gray-600">{message}</p>
            <button onClick={() => setMessage('')} className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

