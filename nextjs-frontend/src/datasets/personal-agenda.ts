import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';

export const defaultVisibleDate = '2026-06-02';

export const resources: SchedulerResource[] = [
  { id: '1', title: 'Corriere 1', eventColor: 'blue' },
  { id: '2', title: 'Corriere 2', eventColor: 'teal' },
];

export const initialEvents: SchedulerEvent[] = [
  {
    id: '1',
    title: 'Consegna Via Roma 12',
    start: '2026-06-02T09:00:00',
    end: '2026-06-02T09:30:00',
    resource: '1',
    color: 'blue',
  },
  {
    id: '2',
    title: 'Ritiro Magazzino Centrale',
    start: '2026-06-02T10:00:00',
    end: '2026-06-02T10:45:00',
    resource: '1',
    color: 'teal',
  },
  {
    id: '3',
    title: 'Consegna Via Garibaldi 5',
    start: '2026-06-03T11:00:00',
    end: '2026-06-03T11:30:00',
    resource: '2',
    color: 'green',
  },
  {
    id: '4',
    title: 'Consegna Via Verdi 20',
    start: '2026-06-04T14:00:00',
    end: '2026-06-04T14:30:00',
    resource: '1',
    color: 'orange',
  },
  {
    id: '5',
    title: 'Riunione corrieri',
    start: '2026-06-05T09:00:00',
    end: '2026-06-05T10:00:00',
    resource: null,
    color: 'purple',
  },
];
