import React, { useState, useMemo } from 'react';
import { useStore } from '../services/store';
import { Goal, GoalStatus } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Tabs, { TabPanel } from '../components/Tabs';
import Badge from '../components/Badge';
import { Target } from '../components/icons';
import { formatDate, formatDateTime } from '../utils/format';
import { toastService } from '../services/toast';

const GoalCard: React.FC<{
  goal: Goal;
  onUpdateStatus: (id: string, status: GoalStatus) => void;
  onAddProgress: (goal: Goal) => void;
}> = ({ goal, onUpdateStatus, onAddProgress }) => {

  const getTargetDate = (goal: Goal): Date => {
    const date = new Date(goal.createdAtISO);
    date.setDate(date.getDate() + goal.timeframeWeeks * 7);
    return date;
  };

  const targetDate = getTargetDate(goal);

  return (
    <Card className="flex flex-col">
      <div className="flex-grow space-y-3">
        <div className="flex justify-between items-start">
            <p className="font-bold text-lg">{goal.studentName}</p>
            {goal.status === 'active' && <Badge color="blue">Active</Badge>}
            {goal.status === 'suggested' && <Badge color="yellow">Suggested</Badge>}
            {goal.status === 'completed' && <Badge color="green">Completed</Badge>}
            {goal.status === 'archived' && <Badge color="gray">Archived</Badge>}
        </div>
        <p className="text-muted">{goal.statement}</p>
        <p className="text-sm text-muted">Target Date: {formatDate(targetDate.toISOString())}</p>
        
        {goal.progressNotes.length > 0 && (
          <div className="pt-2">
            <h4 className="text-sm font-semibold mb-1">Latest Progress:</h4>
            <div className="text-sm p-2 bg-surface-2 rounded-md border border-border">
              <p className="text-muted">{goal.progressNotes[0].note}</p>
              <p className="text-xs text-muted/70 mt-1">{formatDateTime(goal.progressNotes[0].dateISO)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2 justify-end">
        {goal.status === 'suggested' && (
          <Button variant="primary" onClick={() => onUpdateStatus(goal.id, 'active')}>Activate Goal</Button>
        )}
        {goal.status === 'active' && (
          <>
            <Button variant="secondary" onClick={() => onAddProgress(goal)}>Log Progress</Button>
            <Button variant="primary" onClick={() => onUpdateStatus(goal.id, 'completed')}>Mark as Completed</Button>
          </>
        )}
        {(goal.status === 'completed' || goal.status === 'archived') && (
            <Button variant="secondary" onClick={() => onUpdateStatus(goal.id, 'active')}>Reactivate</Button>
        )}
      </div>
    </Card>
  );
};


const GoalsPage: React.FC = () => {
  const { goals, updateGoalStatus, addProgressNote } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [progressNote, setProgressNote] = useState('');

  const sortedGoals = useMemo(() => {
    return [...goals].sort((a, b) => new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime());
  }, [goals]);

  const activeGoals = sortedGoals.filter(g => g.status === 'active');
  const suggestedGoals = sortedGoals.filter(g => g.status === 'suggested');
  const completedGoals = sortedGoals.filter(g => g.status === 'completed' || g.status === 'archived');
  
  const handleOpenModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGoal(null);
    setProgressNote('');
  };
  
  const handleSaveProgress = () => {
    if (selectedGoal && progressNote.trim()) {
      addProgressNote(selectedGoal.id, progressNote.trim());
      toastService.show('Progress logged!');
      handleCloseModal();
    }
  };

  const renderGoalList = (goalList: Goal[]) => {
    if (goalList.length === 0) {
      return (
        <div className="text-center py-12 text-muted">
          <Target size={40} className="mx-auto mb-4" />
          <p>No goals in this category yet.</p>
        </div>
      );
    }
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {goalList.map(goal => (
          <GoalCard key={goal.id} goal={goal} onUpdateStatus={updateGoalStatus} onAddProgress={handleOpenModal} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Student Goals</h1>
        <p className="text-muted mt-2">Track, manage, and update S.M.A.R.T. goals for your students.</p>
      </div>

      <Tabs label="Goal Status">
        <TabPanel title={`Active (${activeGoals.length})`}>
          {renderGoalList(activeGoals)}
        </TabPanel>
        <TabPanel title={`Suggested (${suggestedGoals.length})`}>
          {renderGoalList(suggestedGoals)}
        </TabPanel>
        <TabPanel title={`Completed (${completedGoals.length})`}>
          {renderGoalList(completedGoals)}
        </TabPanel>
      </Tabs>
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Log Progress for ${selectedGoal?.studentName}`}
      >
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-sm">Goal</p>
            <p className="text-muted">{selectedGoal?.statement}</p>
          </div>
          <textarea
            className="textarea w-full"
            rows={4}
            placeholder="e.g., Student successfully used headphones during assembly..."
            value={progressNote}
            onChange={(e) => setProgressNote(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveProgress} disabled={!progressNote.trim()}>Save Note</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GoalsPage;