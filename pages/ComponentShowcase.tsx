
import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Select from '../components/Select';
import TextInput from '../components/TextInput';
import RangeSlider from '../components/RangeSlider';
import Chip from '../components/Chip';
import SegmentedControl from '../components/SegmentedControl';
import EmojiChoice from '../components/EmojiChoice';
import TagPill from '../components/TagPill';
import { Lightbulb } from '../components/icons';
import type { Emotion } from '../types';

const ComponentShowcase: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(5);
  const [selectedChip, setSelectedChip] = useState('chip2');
  const [segmentValue, setSegmentValue] = useState<'A' | 'B' | 'C'>('A');
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>(['Happy']);
  const [selectedTag, setSelectedTag] = useState('Tag 1');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Component Showcase</h1>
        <p className="text-muted mt-2">A gallery of available UI components.</p>
      </div>

      {/* Buttons */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" isLoading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary"><Lightbulb size={16} /> With Icon</Button>
        </div>
      </Card>
      
      {/* Form Elements */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Form Elements</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <TextInput id="text-input" label="Text Input" placeholder="Enter text..." />
          <Select id="select-input" label="Select Input">
            <option>Option 1</option>
            <option>Option 2</option>
          </Select>
          <div className="md:col-span-2">
            <RangeSlider id="range-slider" label="Range Slider" value={sliderValue} onChange={setSliderValue} />
          </div>
        </div>
      </Card>

      {/* Choice Elements */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Choice Elements</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted mb-2">Chips</h3>
            <div className="flex flex-wrap gap-2">
              <Chip label="Chip 1" isSelected={selectedChip === 'chip1'} onClick={() => setSelectedChip('chip1')} />
              <Chip label="Chip 2" isSelected={selectedChip === 'chip2'} onClick={() => setSelectedChip('chip2')} />
              <Chip label="Chip 3" isSelected={selectedChip === 'chip3'} onClick={() => setSelectedChip('chip3')} />
            </div>
          </div>
           <div>
            <h3 className="text-sm font-medium text-muted mb-2">Tag Pills</h3>
            <div className="flex flex-wrap gap-2">
              <TagPill label="Tag 1" isSelected={selectedTag === 'Tag 1'} onToggle={() => setSelectedTag('Tag 1')} />
              <TagPill label="Tag 2" isSelected={selectedTag === 'Tag 2'} onToggle={() => setSelectedTag('Tag 2')} />
              <TagPill label="Tag 3" isSelected={selectedTag === 'Tag 3'} onToggle={() => setSelectedTag('Tag 3')} />
            </div>
          </div>
          <div>
            {/* Fix: Explicitly provide the generic type to the SegmentedControl component to resolve the type mismatch for the `onChange` handler. */}
            <SegmentedControl<'A' | 'B' | 'C'>
              label="Segmented Control"
              options={[
                { label: 'Option A', value: 'A' },
                { label: 'Option B', value: 'B' },
                { label: 'Option C', value: 'C' },
              ]}
              value={segmentValue}
              onChange={setSegmentValue}
            />
          </div>
        </div>
      </Card>
      
      {/* Custom Components */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Custom Components</h2>
        <EmojiChoice selected={selectedEmotions} onChange={setSelectedEmotions} />
      </Card>
    </div>
  );
};

export default ComponentShowcase;
