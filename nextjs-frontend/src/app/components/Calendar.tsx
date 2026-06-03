"use client";

import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { itIT } from '@mui/x-scheduler/locales';
import { it } from 'date-fns/locale';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/personal-agenda';

const theme = createTheme({}, itIT);

export default function BasicWeekView() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: '600px', width: '100%' }}>
        <StandaloneWeekView
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          dateLocale={it}
        />
      </div>
    </ThemeProvider>
  );
}
