import React, { useState } from 'react';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const initialNotes = [
  { id: 'n1', student: 'Anonymous #MB25-AB12CD', session: '2025-09-20 14:00', type: 'individual', notes: 'Discussed coping strategies for exam stress.' },
  { id: 'n2', student: 'Anonymous #MB25-XY98ZT', session: '2025-09-22 11:30', type: 'crisis', notes: 'Safety plan created; follow-up scheduled.' },
];

const ConsultantTools = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState({ student: '', session: '', type: 'individual', notes: '' });

  const addNote = () => {
    if (!newNote.student || !newNote.session || !newNote.notes) return;
    setNotes([{ id: String(Date.now()), ...newNote }, ...notes]);
    setNewNote({ student: '', session: '', type: 'individual', notes: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Consultant Tools</h1>
            <p className="text-sm text-muted-foreground">Session notes and progress tracking</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Note */}
            <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">New Session Note</h2>
              <div className="space-y-3 text-sm">
                <input value={newNote.student} onChange={(e)=>setNewNote({ ...newNote, student: e.target.value })} placeholder="Student (Anonymous ID)" className="w-full px-3 py-2 bg-background border border-border rounded" />
                <input value={newNote.session} onChange={(e)=>setNewNote({ ...newNote, session: e.target.value })} placeholder="Session datetime" className="w-full px-3 py-2 bg-background border border-border rounded" />
                <select value={newNote.type} onChange={(e)=>setNewNote({ ...newNote, type: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded">
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="crisis">Crisis</option>
                </select>
                <textarea value={newNote.notes} onChange={(e)=>setNewNote({ ...newNote, notes: e.target.value })} rows={5} placeholder="Session notes (encrypted in production)" className="w-full px-3 py-2 bg-background border border-border rounded" />
                <Button variant="default" onClick={addNote} iconName="Plus" iconPosition="left">Add Note</Button>
              </div>
            </div>

            {/* Notes List */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Notes</h2>
              <div className="space-y-3">
                {notes.map(n => (
                  <div key={n.id} className="p-4 border border-border rounded">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{n.student}</div>
                      <div className="text-xs text-muted-foreground">{n.session}</div>
                    </div>
                    <div className="mt-1 text-xs"><span className="px-2 py-0.5 rounded bg-muted">{n.type}</span></div>
                    <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{n.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConsultantTools;


