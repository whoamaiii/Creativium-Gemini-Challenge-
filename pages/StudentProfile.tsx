import React from 'react';
import { useStore } from '../services/store';
import { parseHashSearch } from '../utils/hashParams';
import Card from '../components/Card';
import { AlertTriangle, Users, BookOpen } from '../components/icons';
import { formatDate } from '../utils/format';
import LineChart from '../components/charts/LineChart';
import { trendPoints } from '../utils/analytics';
import Button from '../components/Button';
import Breadcrumbs from '../components/Breadcrumbs';

const StudentProfile: React.FC = () => {
  const { students, sessions } = useStore();
  const params = parseHashSearch();
  const studentId = params.get('id');

  const student = students.find(s => s.id === studentId);
  const studentSessions = sessions.filter(s => s.student === student?.name);
  const studentTrendPoints = trendPoints(studentSessions);

  if (!student) {
    return (
      <Card className="text-center py-12">
        <AlertTriangle size={48} className="mx-auto text-warn mb-4" />
        <h2 className="text-2xl font-semibold">Student Not Found</h2>
        <p className="text-muted mt-2">Could not find a student with the specified ID. Go to the <a href="#/students" className="text-brand underline">Students</a> page to see all students.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <Breadcrumbs items={[{ label: 'Home', href: '#/' }, { label: 'Students', href: '#/students' }, { label: student.name }]} />
          <h1 className="text-4xl font-bold mt-2">{student.name}</h1>
          <p className="text-muted mt-2">An overview of logged sessions and trends.</p>
        </div>
        <a href="#/">
          <Button variant="primary">New Session for {student.name}</Button>
        </a>
      </div>


      <div className="grid md:grid-cols-3 gap-6">
        <Card>
            <h2 className="text-xl font-semibold mb-4">Total Sessions</h2>
            <p className="text-5xl font-bold text-brand">{studentSessions.length}</p>
        </Card>
        
        <Card className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Emotion Trend</h2>
            <div className="h-40">
                <LineChart data={studentTrendPoints} />
            </div>
        </Card>
        
        <Card className="md:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
            {studentSessions.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-auto">
                    {studentSessions.slice(0, 10).map(session => (
                        <div key={session.id} className="p-3 bg-surface-2 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{session.activity}</p>
                                <p className="text-sm text-muted">{session.emotions.join(', ') || 'Neutral'}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-muted hidden md:block">{formatDate(session.timeISO)}</p>
                                <a href={`#/insights?id=${session.id}`} className="flex items-center gap-2 text-brand text-sm font-semibold hover:underline p-2 rounded-md hover:bg-brand/10">
                                  <BookOpen size={16} />
                                  <span>View Insights</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-8 text-muted">
                    <Users size={40} className="mx-auto mb-4" />
                    <p>No sessions logged for {student.name} yet.</p>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;