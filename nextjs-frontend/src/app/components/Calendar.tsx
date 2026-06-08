"use client";

import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { itIT } from '@mui/x-scheduler/locales';
import { it } from 'date-fns/locale';

const theme = createTheme(
  {
    components: {
      MuiEventDialog: {
        styleOverrides: {
          root: { display: 'none' },
        },
      },
    } as any,
  },
  itIT,
);

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('it-IT', {
    weekday: 'long', day: '2-digit', month: 'long',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function BasicWeekView() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<SchedulerEvent | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    async function fetchDeliveries() {
      try {
        const response = await fetch('http://localhost:1337/api/consegnas');
        const json = await response.json();
        const formattedEvents = (json.data ?? [])
          .filter((item: any) => item.Inizio_Consegna && item.Fine_Consegna)
          .map((item: any) => ({
            id: item.documentId || item.id.toString(),
            title: item.Titolo || 'Consegna',
            start: item.Inizio_Consegna,
            end: item.Fine_Consegna,
            description: item.Descrizione || 'Non hai aggiunto una descirizione.',
          }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Errore nel recupero delle consegne:", error);
      }
    }
    fetchDeliveries();
  }, []);

  // completamnte fatto da claude perchè con l alibreria non ho capito come individuare il click
  const handleClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    let el = e.target as HTMLElement | null;
    while (el && el !== wrapperRef.current) {
      if (el.getAttribute('role') === 'button' || el.tagName === 'BUTTON') {
        const text = el.textContent?.trim() ?? '';
        const matched = events.find(ev => text.includes(ev.title));
        if (matched) {
          setSelectedEvent(prev => prev?.id === matched.id ? null : matched);
          return;
        }
      }
      el = el.parentElement;
    }
  }, [events]);

  return (
    <ThemeProvider theme={theme}>
      <div ref={wrapperRef} onClick={handleClick}>
        <div style={{ height: '600px', width: '100%' }}>
          <StandaloneWeekView
            events={events}
            dateLocale={it}
            areEventsDraggable={false}
            readOnly={false}
            defaultView='agenda'
          />
        </div>
      </div>

      {selectedEvent && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4 shadow-sm">
          <h2 className="text-base font-bold text-emerald-800 mb-3">{selectedEvent.title}</h2>
          <div className="flex flex-col gap-1 text-sm text-gray-700">
            <p><span className="font-semibold">Inizio:</span> {formatDateTime(selectedEvent.start)}</p>
            <p><span className="font-semibold">Fine:</span> {formatDateTime(selectedEvent.end)}</p>
            {selectedEvent.description && (
              <p><span className="font-semibold">Note:</span> {selectedEvent.description}</p>
            )}
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}