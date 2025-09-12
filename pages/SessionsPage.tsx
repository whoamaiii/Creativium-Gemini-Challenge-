import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../services/store';
import Card from '../components/Card';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import Select from '../components/Select';
import { formatDateTime } from '../utils/format';
import { BookOpen, Trash, Filter } from '../components/icons';
import { downloadCSV } from '../utils/csv';

const SessionsPage: React.FC = () => {
  const { sessions, deleteSession, deleteSessions, students: storeStudents } = useStore();
  const [query, setQuery] = useState('');
  const [studentFilter, setStudentFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const studentNames = useMemo(() => {
    return [...storeStudents].map(s => s.name).sort((a, b) => a.localeCompare(b));
  }, [storeStudents]);

  // Read filters from hash search (e.g., #/sessions?student=Alex&from=2025-05-01&to=2025-05-31&q=noise)
  useEffect(() => {
    const applyFromHash = () => {
      const hash = window.location.hash;
      const qsIndex = hash.indexOf('?');
      const query = qsIndex >= 0 ? hash.slice(qsIndex + 1) : '';
      const params = new URLSearchParams(query);
      const student = params.get('student');
      const q = params.get('q');
      const from = params.get('from');
      const to = params.get('to');
      if (student) setStudentFilter(student);
      if (q) setQuery(q);
      if (from) setFromDate(from);
      if (to) setToDate(to);
      setPage(1);
    };
    applyFromHash();
    const onHash = () => applyFromHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      const matchesQuery = query
        ? [s.activity, s.location, s.notes, s.triggers.join(' '), s.teacherActions.join(' ')].join(' ').toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesStudent = studentFilter === 'all' ? true : s.student === studentFilter;
      const time = new Date(s.timeISO).getTime();
      const fromOk = fromDate ? time >= new Date(fromDate).getTime() : true;
      const toOk = toDate ? time <= new Date(toDate).getTime() + 24*60*60*1000 - 1 : true;
      return matchesQuery && matchesStudent && fromOk && toOk;
    });
  }, [sessions, query, studentFilter, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filtered.slice(start, end);
  }, [filtered, currentPage, pageSize]);

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
              {studentNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Select>
            <Select id="page-size" label="Page size" value={String(pageSize)} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              {[8, 12, 24, 48].map(sz => (
                <option key={sz} value={sz}>{sz} per page</option>
              ))}
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                id="from-date"
                label="From date"
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
              />
              <TextInput
                id="to-date"
                label="To date"
                type="date"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex items-end justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="!px-3"
              >
                Prev
              </Button>
              <div className="text-sm text-muted">Page {currentPage} / {totalPages}</div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="!px-3"
              >
                Next
              </Button>
              <Button
                type="button"
                onClick={() => downloadCSV(filtered)}
                disabled={filtered.length === 0}
              >
                Export CSV
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="!text-error hover:!bg-error/10"
                onClick={() => {
                  if (filtered.length === 0) return;
                  const ok = confirm(`Delete ${filtered.length} filtered session(s)? This cannot be undone.`);
                  if (!ok) return;
                  deleteSessions(filtered.map(s => s.id));
                }}
                disabled={filtered.length === 0}
              >
                Delete Filtered
              </Button>
            </div>
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
          {paged.map(s => (
            <Card key={s.id} isHoverable>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted">{formatDateTime(s.timeISO)}</p>
                  <h3 className="text-lg font-semibold">{s.activity || 'Untitled Activity'}</h3>
                  <p className="text-sm text-muted">
                    {(() => {
                      const stu = storeStudents.find(st => st.name === s.student);
                      const href = stu ? `#/student?id=${stu.id}` : '#/students';
                      return (
                        <a className="text-brand hover:underline" href={href}>{s.student}</a>
                      );
                    })()} 
                    • {s.location || 'Unknown location'} • {s.peers}
                  </p>
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
                  <a href={`#/edit?id=${s.id}`} className="w-full">
                    <Button className="w-full">Edit</Button>
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

