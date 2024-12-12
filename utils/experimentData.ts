import { useState, useEffect } from 'react';

export interface StatusTransition {
  status: string;
  changedBy: string;
  changedAt: string;
}

export interface Experiment {
  id: string;
  title: string;
  key: string;
  createdBy: string;
  objective: string;
  status: string;
  variations: string[];
  rules: {
    variation: string;
    action: string;
    percentage: number;
    rankingType?: 'static' | 'dynamic';
    nextBestVariations?: string[];
    valueFormat?: 'string' | 'number';
    checkValueItems?: { weight: number; value: string }[];
  }[];
  createdDate: string;
  statusHistory: StatusTransition[];
}

const dummyExperiments: Experiment[] = [
  {
    id: '1',
    title: 'APR Reduction Impact on Acceptance',
    key: 'apr_reduction_impact',
    createdBy: 'John Doe',
    objective: 'Increase card offer acceptance rate by 10% through APR reduction',
    status: 'Running',
    variations: ['Control', '2% APR Reduction', '5% APR Reduction'],
    rules: [
      { variation: 'Control', action: 'allow', percentage: 40 },
      { variation: '2% APR Reduction', action: 'suppress', percentage: 0 },
      { 
        variation: '5% APR Reduction', 
        action: 'nextBestVariation', 
        percentage: 60,
        rankingType: 'static',
        nextBestVariations: ['Control', '2% APR Reduction']
      },
    ],
    createdDate: '2024-01-01',
    statusHistory: [
      { status: 'Draft', changedBy: 'John Doe', changedAt: '2024-01-01T09:00:00Z' },
      { status: 'Running', changedBy: 'Jane Smith', changedAt: '2024-01-05T14:30:00Z' },
      { status: 'Stopped', changedBy: 'Mike Johnson', changedAt: '2024-01-10T11:15:00Z' },
      { status: 'Running', changedBy: 'Sarah Lee', changedAt: '2024-01-15T16:45:00Z' },
    ],
  },
  {
    id: '2',
    title: 'Cash Back vs. Reward Points',
    key: 'cash_back_vs_points',
    createdBy: 'Jane Smith',
    objective: 'Determine which reward structure leads to higher card usage',
    status: 'Stopped',
    variations: ['2% Cash Back', '3x Reward Points'],
    rules: [
      { 
        variation: '2% Cash Back', 
        action: 'checkValue', 
        percentage: 50,
        valueFormat: 'number',
        checkValueItems: [
          { weight: 30, value: '500' },
          { weight: 70, value: '1000' }
        ]
      },
      { variation: '3x Reward Points', action: 'allow', percentage: 50 },
    ],
    createdDate: '2024-01-15',
    statusHistory: [
      { status: 'Draft', changedBy: 'Emma Wilson', changedAt: '2024-01-15T10:00:00Z' },
      { status: 'Running', changedBy: 'David Brown', changedAt: '2024-01-20T09:30:00Z' },
      { status: 'Stopped', changedBy: 'Lisa Taylor', changedAt: '2024-02-01T14:00:00Z' },
    ],
  },
  {
    id: '3',
    title: 'Sign-up Bonus Threshold Test',
    key: 'signup_bonus_threshold',
    createdBy: 'Chris Evans',
    objective: 'Optimize sign-up bonus spend threshold for maximum ROI',
    status: 'Marked for Deletion',
    variations: ['$3000 in 3 months', '$4000 in 3 months', '$5000 in 3 months'],
    rules: [
      { variation: '$3000 in 3 months', action: 'allow', percentage: 33 },
      { 
        variation: '$4000 in 3 months', 
        action: 'nextBestVariation', 
        percentage: 33,
        rankingType: 'dynamic'
      },
      { variation: '$5000 in 3 months', action: 'allow', percentage: 34 },
    ],
    createdDate: '2024-02-01',
    statusHistory: [
      { status: 'Draft', changedBy: 'Chris Evans', changedAt: '2024-02-01T08:00:00Z' },
      { status: 'Running', changedBy: 'Natalie Porter', changedAt: '2024-02-05T11:30:00Z' },
      { status: 'Stopped', changedBy: 'Tom Holland', changedAt: '2024-02-15T16:00:00Z' },
      { status: 'Marked for Deletion', changedBy: 'Robert Downey', changedAt: '2024-02-20T09:45:00Z' },
    ],
  },
];

export function useExperiments() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);

  useEffect(() => {
    const storedExperiments = localStorage.getItem('experiments');
    if (storedExperiments) {
      setExperiments(JSON.parse(storedExperiments));
    } else {
      localStorage.setItem('experiments', JSON.stringify(dummyExperiments));
      setExperiments(dummyExperiments);
    }
  }, []);

  const updateExperiments = (newExperiments: Experiment[]) => {
    setExperiments(newExperiments);
    localStorage.setItem('experiments', JSON.stringify(newExperiments));
  };

  const addExperiment = (experiment: Experiment) => {
    const updatedExperiments = [...experiments, experiment];
    updateExperiments(updatedExperiments);
  };

  const editExperiment = (updatedExperiment: Experiment) => {
    const updatedExperiments = experiments.map(exp => 
      exp.id === updatedExperiment.id ? updatedExperiment : exp
    );
    updateExperiments(updatedExperiments);
  };

  const deleteExperiment = (id: string) => {
    const updatedExperiments = experiments.filter(exp => exp.id !== id);
    updateExperiments(updatedExperiments);
  };

  return { 
    experiments, 
    addExperiment, 
    editExperiment, 
    deleteExperiment 
  };
}

