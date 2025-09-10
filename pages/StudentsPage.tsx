import React, { useState } from 'react';
import { useStore } from '../services/store';
import Card from '../components/Card';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { Trash, Users } from '../components/icons';
import { toastService } from '../services/toast';

const StudentsPage: React.FC = () => {
  const { students, addStudent, deleteStudent } = useStore();
  const [newStudentName, setNewStudentName] = useState('');

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      addStudent(newStudentName.trim());
      toastService.show(`Added student: ${newStudentName.trim()}`);
      setNewStudentName('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Manage Students</h1>
        <p className="text-muted mt-2">Add or remove students from the tracker.</p>
      </div>

      <div className="max-w-xl mx-auto grid md:grid-cols-2 gap-8">
        <Card className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
            <form onSubmit={handleAddStudent} className="flex items-end gap-4">
                <TextInput
                    id="new-student-name"
                    label="Student Name"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g., John Smith"
                />
                <Button type="submit" variant="primary">Add</Button>
            </form>
        </Card>
        
        <Card className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Current Students</h2>
            {students.length > 0 ? (
                <ul className="space-y-2">
                    {students.map(student => (
                        <li key={student.id} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                            <span className="font-medium">{student.name}</span>
                            <Button 
                                variant="ghost" 
                                className="!p-2 text-muted hover:!text-error hover:!bg-error/10"
                                onClick={() => deleteStudent(student.id)}
                                aria-label={`Delete ${student.name}`}
                            >
                                <Trash size={18} />
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-8 text-muted">
                    <Users size={40} className="mx-auto mb-4" />
                    <p>No students have been added yet.</p>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default StudentsPage;
