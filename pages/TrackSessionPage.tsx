
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useStore } from '../services/store';
import { useAutosave, loadDraft, clearDraft } from '../hooks/useAutosave';
import { Attachment, Emotion, SensoryChannel } from '../types';
import { SENSORY_CHANNELS, TEACHER_REACTIONS, QUICK_ADD_TRIGGERS } from '../constants';
import { toastService } from '../services/toast';
import { Plus } from '../components/icons';
import { parseHashSearch } from '../utils/hashParams';

// Import Components
import Card from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';
import TextInput from '../components/TextInput';
import EmojiChoice from '../components/EmojiChoice';
import RangeSlider from '../components/RangeSlider';
import TagPill from '../components/TagPill';
import StickyBar from '../components/StickyBar';
import AutoSuggest from '../components/AutoSuggest';
import UploadArea from '../components/UploadArea';

const BASE_DRAFT_KEY = 'kreativium:session-draft';

type SessionState = Omit<Attachment, 'file'>;

const initialSensoryState = SENSORY_CHANNELS.reduce((acc, channel) => {
  acc[channel] = 0;
  return acc;
}, {} as Record<SensoryChannel, number>);

const getInitialState = (draftKey: string) => {
  const savedDraft = loadDraft<any>(draftKey);
  if (savedDraft) {
    // We don't save File objects, so attachments need to be reset.
    return { ...savedDraft, attachments: [] };
  }
  return {
    student: '',
    location: '',
    activity: '',
    peers: 'Alone',
    emotions: [] as Emotion[],
    sensory: initialSensoryState,
    triggers: [] as string[],
    newTrigger: '',
    teacherActions: [] as string[],
    notes: '',
    attachments: [] as Attachment[],
  };
};


const TrackSessionPage: React.FC = () => {
  const params = parseHashSearch();
  const editingId = params.get('id') || '';
  const isEditing = window.location.hash.startsWith('#/edit') && !!editingId;

  const { students, addSession, updateSession, getSession } = useStore();

  const draftKey = useMemo(() => `${BASE_DRAFT_KEY}${isEditing ? `:${editingId}` : ''}`, [isEditing, editingId]);

  const [state, setState] = useState(() => {
    if (isEditing) {
      const existing = getSession(editingId);
      if (existing) {
        return {
          student: existing.student,
          location: existing.location,
          activity: existing.activity,
          peers: existing.peers,
          emotions: [...existing.emotions],
          sensory: { ...existing.sensory },
          triggers: [...existing.triggers],
          newTrigger: '',
          teacherActions: [...existing.teacherActions],
          notes: existing.notes,
          attachments: existing.attachments ? [...existing.attachments] : [],
        };
      }
    }
    return getInitialState(draftKey);
  });

  useEffect(() => {
    // If navigating between edit/new, reinitialize the form state accordingly
    // This keeps the form in sync when the id changes.
    // We avoid resetting if already at correct mode/state.
  }, [isEditing, editingId]);

  useAutosave(draftKey, state);

  const updateField = <K extends keyof typeof state>(field: K, value: (typeof state)[K]) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleSensoryChange = (channel: SensoryChannel, value: number) => {
    setState(prev => ({
      ...prev,
      sensory: { ...prev.sensory, [channel]: value },
    }));
  };
  
  const handleToggleList = (listKey: 'triggers' | 'teacherActions', item: string) => {
    const currentList = state[listKey] as string[];
    const newList = currentList.includes(item)
      ? currentList.filter(i => i !== item)
      : [...currentList, item];
    updateField(listKey, newList as any);
  };
  
  const handleAddTrigger = () => {
      if (state.newTrigger && !state.triggers.includes(state.newTrigger)) {
          updateField('triggers', [...state.triggers, state.newTrigger]);
          updateField('newTrigger', '');
      }
  };
  
  const onFilesAccepted = useCallback((files: File[]) => {
    const newAttachments: Attachment[] = files.map(file => ({
      file,
      kind: file.type.startsWith('image/') ? 'image' : 'audio',
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    updateField('attachments', [...state.attachments, ...newAttachments]);
  }, [state.attachments]);

  const onRemoveAttachment = (index: number) => {
    const attachment = state.attachments[index];
    if (attachment) {
      URL.revokeObjectURL(attachment.url); // Clean up blob URL
    }
    updateField('attachments', state.attachments.filter((_, i) => i !== index));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.student) {
      toastService.show('Please select a student.');
      return;
    }
    if (isEditing) {
      updateSession(editingId, {
        student: state.student,
        location: state.location,
        activity: state.activity,
        peers: state.peers,
        emotions: state.emotions,
        sensory: state.sensory,
        triggers: state.triggers,
        teacherActions: state.teacherActions,
        notes: state.notes,
        attachments: state.attachments,
      });
      toastService.show('Session updated.');
      clearDraft(draftKey);
      window.location.hash = `#/insights?id=${editingId}`;
    } else {
      const id = addSession(state);
      toastService.show('Session saved successfully!');
      clearDraft(draftKey);
      setState(getInitialState(draftKey));
      window.location.hash = `#/insights?id=${id}`;
    }
  };

  const handleReset = () => {
    clearDraft(draftKey);
    setState(getInitialState(draftKey));
    toastService.show('Form has been cleared.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{isEditing ? 'Edit Session' : 'Track New Session'}</h1>
        <p className="text-muted mt-2">{isEditing ? 'Update the details for this observation.' : 'Log an observation to track behavior and sensory data.'}</p>
        {isEditing && (
          <p className="text-sm text-muted mt-2">Saving will update the existing session. <a className="text-brand underline" href={`#/insights?id=${editingId}`}>Back to Insights</a></p>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
            <h2 className="card-title">Context</h2>
            <div className="grid md:grid-cols-3 gap-6">
                 <Select
                    id="student"
                    label="Student"
                    value={state.student}
                    onChange={(e) => updateField('student', e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a student</option>
                    {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                 </Select>
                 <TextInput id="location" label="Location / Setting" value={state.location} onChange={e => updateField('location', e.target.value)} placeholder="e.g., Classroom, Playground" />
                 <TextInput id="activity" label="Activity" value={state.activity} onChange={e => updateField('activity', e.target.value)} placeholder="e.g., Circle time, Math" />
            </div>
        </Card>
        
        <Card>
            <h2 className="card-title">Emotions Observed</h2>
            <EmojiChoice selected={state.emotions} onChange={(val) => updateField('emotions', val)} />
        </Card>

        <Card>
            <h2 className="card-title">Triggers</h2>
            <div className="flex flex-wrap gap-2 mb-4">
                {QUICK_ADD_TRIGGERS.map(trigger => (
                    <TagPill key={trigger} label={trigger} isSelected={state.triggers.includes(trigger)} onToggle={() => handleToggleList('triggers', trigger)} />
                ))}
            </div>
             <div className="flex items-end gap-2">
                <AutoSuggest
                    id="new-trigger"
                    label="Add custom trigger"
                    suggestions={state.triggers}
                    value={state.newTrigger}
                    onChange={(e) => updateField('newTrigger', e.target.value)}
                    onSelect={(val) => updateField('newTrigger', val)}
                />
                <Button type="button" onClick={handleAddTrigger} className="!p-2.5" aria-label="Add Trigger"><Plus /></Button>
            </div>
        </Card>
        
        <Card className="md:col-span-2">
            <h2 className="card-title">Sensory Input Levels</h2>
            <p className="text-sm text-muted mb-4">Rate the intensity of sensory input in the environment from 0 (none) to 10 (high).</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {SENSORY_CHANNELS.map(channel => (
                    <RangeSlider key={channel} id={channel} label={channel} value={state.sensory[channel]} onChange={(val) => handleSensoryChange(channel, val)} />
                ))}
            </div>
        </Card>

         <Card className="md:col-span-2">
            <h2 className="card-title">Teacher / Staff Actions</h2>
             <div className="flex flex-wrap gap-2">
                {TEACHER_REACTIONS.map(action => (
                    <TagPill key={action} label={action} isSelected={state.teacherActions.includes(action)} onToggle={() => handleToggleList('teacherActions', action)} />
                ))}
            </div>
        </Card>
        
        <Card className="md:col-span-2">
             <h2 className="card-title">Notes & Attachments</h2>
             <div className="space-y-4">
                <textarea
                    id="notes"
                    className="textarea w-full"
                    rows={4}
                    placeholder="Add any additional observations or context here..."
                    value={state.notes}
                    onChange={e => updateField('notes', e.target.value)}
                />
                <UploadArea attachments={state.attachments} onFilesAccepted={onFilesAccepted} onRemoveAttachment={onRemoveAttachment} />
             </div>
        </Card>
      </div>

      <StickyBar>
        <Button type="button" variant="secondary" onClick={handleReset}>Clear Form</Button>
        <Button type="submit" variant="primary">Save Session</Button>
      </StickyBar>
    </form>
  );
};

export default TrackSessionPage;
