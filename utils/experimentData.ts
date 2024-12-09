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
  objective: string;
  status: string;
  variations: string[];
  rules: {
    variation: string;
    action: string;
    percentage: number;
  }[];
  createdDate: string;
  statusHistory: StatusTransition[];
}

const dummyExperiments: Experiment[] = [
  {
    id: '1',
    title: 'APR Reduction Impact on Acceptance',
    key: 'apr_reduction_impact',
    objective: 'Increase card offer acceptance rate by 10% through APR reduction',
    status: 'Running',
    variations: ['Control', '2% APR Reduction', '5% APR Reduction'],
    rules: [
      { variation: 'Control', action: 'allow', percentage: 40 },
      { variation: '2% APR Reduction', action: 'allow', percentage: 50 },
      { variation: '5% APR Reduction', action: 'allow', percentage: 65 },
    ],
    createdDate: '2024-01-01',
    statusHistory: [
      { status: 'Draft', changedBy: 'John Doe', changedAt: '2024-01-01T09:00:00Z' },
      { status: 'Running', changedBy: 'Jane Smith', changedAt: '2024-01-05T14:30:00Z' },
      { status: 'Paused', changedBy: 'Mike Johnson', changedAt: '2024-01-10T11:15:00Z' },
      { status: 'Running', changedBy: 'Sarah Lee', changedAt: '2024-01-15T16:45:00Z' },
    ],
  },
  {
    id: '2',
    title: 'Cash Back vs. Reward Points',
    key: 'cash_back_vs_points',
    objective: 'Determine which reward structure leads to higher card usage',
    status: 'Paused',
    variations: ['2% Cash Back', '3x Reward Points'],
    rules: [
      { variation: '2% Cash Back', action: 'allow', percentage: 50 },
      { variation: '3x Reward Points', action: 'allow', percentage: 50 },
    ],
    createdDate: '2024-01-15',
    statusHistory: [
      { status: 'Draft', changedBy: 'Emma Wilson', changedAt: '2024-01-15T10:00:00Z' },
      { status: 'Running', changedBy: 'David Brown', changedAt: '2024-01-20T09:30:00Z' },
      { status: 'Paused', changedBy: 'Lisa Taylor', changedAt: '2024-02-01T14:00:00Z' },
    ],
  },
  {
    id: '3',
    title: 'Sign-up Bonus Threshold Test',
    key: 'signup_bonus_threshold',
    objective: 'Optimize sign-up bonus spend threshold for maximum ROI',
    status: 'Marked for Deletion',
    variations: ['$3000 in 3 months', '$4000 in 3 months', '$5000 in 3 months'],
    rules: [
      { variation: '$3000 in 3 months', action: 'allow', percentage: 33 },
      { variation: '$4000 in 3 months', action: 'allow', percentage: 33 },
      { variation: '$5000 in 3 months', action: 'allow', percentage: 34 },
    ],
    createdDate: '2024-02-01',
    statusHistory: [
      { status: 'Draft', changedBy: 'Chris Evans', changedAt: '2024-02-01T08:00:00Z' },
      { status: 'Running', changedBy: 'Natalie Porter', changedAt: '2024-02-05T11:30:00Z' },
      { status: 'Paused', changedBy: 'Tom Holland', changedAt: '2024-02-15T16:00:00Z' },
      { status: 'Marked for Deletion', changedBy: 'Robert Downey', changedAt: '2024-02-20T09:45:00Z' },
    ],
  },
  {
    id: '4',
    title: 'Annual Fee Waiver Duration',
    key: 'annual_fee_waiver_duration',
    objective: 'Assess impact of extended annual fee waiver on long-term retention',
    status: 'Running',
    variations: ['No Waiver', '1 Year Waiver', '2 Year Waiver'],
    rules: [
      { variation: 'No Waiver', action: 'allow', percentage: 33 },
      { variation: '1 Year Waiver', action: 'allow', percentage: 33 },
      { variation: '2 Year Waiver', action: 'allow', percentage: 34 },
    ],
    createdDate: '2024-02-15',
    statusHistory: [
      { status: 'Draft', changedBy: 'Scarlett Johansson', changedAt: '2024-02-15T13:00:00Z' },
      { status: 'Running', changedBy: 'Mark Ruffalo', changedAt: '2024-02-18T10:30:00Z' },
    ],
  },
  {
    id: '5',
    title: 'Credit Limit Increase Frequency',
    key: 'credit_limit_increase_frequency',
    objective: 'Determine optimal frequency of automatic credit limit increases',
    status: 'Draft',
    variations: ['6 Months', '12 Months', '18 Months'],
    rules: [
      { variation: '6 Months', action: 'allow', percentage: 33 },
      { variation: '12 Months', action: 'allow', percentage: 33 },
      { variation: '18 Months', action: 'allow', percentage: 34 },
    ],
    createdDate: '2024-03-01',
    statusHistory: [
      { status: 'Draft', changedBy: 'Chris Hemsworth', changedAt: '2024-03-01T09:00:00Z' },
    ],
  },
  {
    id: '6',
    title: 'Balance Transfer Fee Reduction',
    key: 'balance_transfer_fee_reduction',
    objective: 'Increase balance transfer activity by reducing fees',
    status: 'Marked for Deletion',
    variations: ['3% Fee', '2% Fee', '1% Fee'],
    rules: [
      { variation: '3% Fee', action: 'allow', percentage: 33 },
      { variation: '2% Fee', action: 'allow', percentage: 33 },
      { variation: '1% Fee', action: 'allow', percentage: 34 },
    ],
    createdDate: '2024-03-15',
    statusHistory: [
      { status: 'Draft', changedBy: 'Jeremy Renner', changedAt: '2024-03-15T11:00:00Z' },
      { status: 'Running', changedBy: 'Elizabeth Olsen', changedAt: '2024-03-18T14:30:00Z' },
      { status: 'Paused', changedBy: 'Paul Bettany', changedAt: '2024-03-25T09:15:00Z' },
      { status: 'Marked for Deletion', changedBy: 'Samuel L. Jackson', changedAt: '2024-03-30T16:00:00Z' },
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
      setExperiments(dummyExperiments);
      localStorage.setItem('experiments', JSON.stringify(dummyExperiments));
    }
  }, []);

  const updateExperiments = (newExperiments: Experiment[]) => {
    setExperiments(newExperiments);
    localStorage.setItem('experiments', JSON.stringify(newExperiments));
  };

  return { experiments, updateExperiments };
}

