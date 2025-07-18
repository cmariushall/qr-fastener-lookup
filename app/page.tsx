'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [years, setYears] = useState<number[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  useEffect(() => {
    fetch('/api/years')
      .then(res => res.json())
      .then(setYears);
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetch(`/api/makes?year=${selectedYear}`)
        .then(res => res.json())
        .then(setMakes);
    } else {
      setMakes([]);
      setSelectedMake('');
      setModels([]);
      setSelectedModel('');
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedYear && selectedMake) {
      fetch(`/api/models?year=${selectedYear}&make=${selectedMake}`)
        .then(res => res.json())
        .then(setModels);
    } else {
      setModels([]);
      setSelectedModel('');
    }
  }, [selectedMake]);

  return (
    <div className="min-h-screen p-8 sm:p-20 font-sans">
      <h1 className="text-2xl font-bold mb-8">Select Your Vehicle</h1>

      <div className="flex flex-col gap-6 max-w-sm">
        {/* Year */}
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Year</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {/* Make */}
        <select
          value={selectedMake}
          onChange={e => setSelectedMake(e.target.value)}
          disabled={!selectedYear}
          className="border p-2 rounded"
        >
          <option value="">Select Make</option>
          {makes.map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>

        {/* Model */}
        <select
          value={selectedModel}
          onChange={e => setSelectedModel(e.target.value)}
          disabled={!selectedMake}
          className="border p-2 rounded"
        >
          <option value="">Select Model</option>
          {models.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
//redeploy 
// redeploy 
