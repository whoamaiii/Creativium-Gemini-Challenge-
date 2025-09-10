import { useMemo, useState } from 'react';
import { useStore } from '../services/store';
import Card from '../components/Card';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import Select from '../components/Select';
import { formatDateTime } from '../utils/format';
import { BookOpen, Trash, Filter } from '../components/icons';

const SessionsPage: React.FC = () => {
  const { sessions, deleteSession } = useStore();
  const [query, setQuery] = useState('');
  const [studentFilter, setStudentFilter] = useState('all');

  const students = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach(s => set.add(s.student));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [sessions]);

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      const matchesQuery = query
        ? [s.activity, s.location, s.notes, s.triggers.join(' '), s.teacherActions.join(' ')].join(' ').toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesStudent = studentFilter === 'all' ? true : s.student === studentFilter;
      return matchesQuery && matchesStudent;
    });
  }, [sessions, query, studentFilter]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Sessions</h1>
        <p className="text-muted mt-2">Browse, filter, and open insights for past sessions.</p>
      </div>

      <Card>
        <div className="grid md:grid-cols-3 gap-4">
          <TextInput
            id="search"
            label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activity, notes, triggers..."
          />
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select id="student" label="Student" value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)}>
              <option value="all">All students</option>
              {students.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <Filter size={32} className="mx-auto mb-3 text-muted" />
          <p className="text-muted">No sessions match your filters.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(s => (
            <Card key={s.id} isHoverable>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted">{formatDateTime(s.timeISO)}</p>
                  <h3 className="text-lg font-semibold">{s.activity || 'Untitled Activity'}</h3>
                  <p className="text-sm text-muted">{s.student} • {s.location || 'Unknown location'} • {s.peers}</p>
                  {s.emotions.length > 0 && (
                    <p className="text-sm"><span className="text-muted">Emotions:</span> {s.emotions.join(', ')}</p>
                  )}
                  {s.triggers.length > 0 && (
                    <p className="text-sm"><span className="text-muted">Triggers:</span> {s.triggers.join(', ')}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 min-w-40">
                  <a href={`#/insights?id=${s.id}`} className="w-full">
                    <Button variant="secondary" className="w-full"><BookOpen size={16} /> Open Insights</Button>
                  </a>
                  <Button
                    variant="ghost"
                    className="w-full !justify-start !text-error hover:!bg-error/10"
                    onClick={() => {
                      if (confirm('Delete this session? This cannot be undone.')) {
                        deleteSession(s.id);
                      }
                    }}
                  >
                    <Trash size={16} /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionsPage;

