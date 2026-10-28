import { Task } from '../types';

export const getInitialSampleTasks = (): Task[] => {
  const now = new Date();
  
  const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
  const inFourDays = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  return [
    {
      id: 'sample-task-1',
      title: 'Review lecture notes',
      subject: 'Wireless & Mobile Communication',
      description: 'Review modulation techniques and MIMO cellular concepts from lectures 8-10.',
      deadline: formatDate(inTwoDays),
      estimated_duration: 45,
      priority: 'high',
      status: 'not_started',
      scheduled_order: 1,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      is_sample: true,
    },
    {
      id: 'sample-task-2',
      title: 'Complete practice sheet',
      subject: 'Data Structures',
      description: 'Solve questions on binary search tree balanced rotations and traversal.',
      deadline: formatDate(tomorrow),
      estimated_duration: 60,
      priority: 'high',
      status: 'not_started',
      scheduled_order: 2,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      is_sample: true,
    },
    {
      id: 'sample-task-3',
      title: 'Prepare presentation outline',
      subject: 'Project',
      description: 'Draft 5-slide structure covering system architecture and MVP features.',
      deadline: formatDate(inFourDays),
      estimated_duration: 30,
      priority: 'normal',
      status: 'not_started',
      scheduled_order: 3,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      is_sample: true,
    },
  ];
};
