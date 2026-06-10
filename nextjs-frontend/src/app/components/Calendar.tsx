"use client";

import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { itIT } from '@mui/x-scheduler/locales';
import EditIcon from '@mui/icons-material/Edit';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotesIcon from '@mui/icons-material/Notes';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
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
            phone_number: item.Numero_Telefono || 'N/A',
            description: item.Descrizione || 'Non hai aggiunto una descrizione.',
          }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Errore nel recupero delle consegne:", error);
      }
    }
    fetchDeliveries();
  }, []);

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
        <div className="mt-4 rounded-xl border border-blue-300 bg-blue-50 px-6 py-4 shadow-sm">
          
          {/* Modifica qui: rimozione di justify-between, pulsante affiancato al titolo */}
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl uppercase font-bold text-orange-500">{selectedEvent.title}</h2>
            <button className="h-10 w-10 rounded-full border border-orange-500 text-orange-500 flex items-center justify-center">
              <EditIcon fontSize="small" />
            </button>
          </div>
          
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            <p className="flex items-center m-0">
              <ChevronRightIcon className="text-black" />
              <span className="font-semibold ml-1 text-black">Inizio:</span>
              <span className="ml-6">{formatDateTime(selectedEvent.start)}</span>
            </p>
            <p className="flex items-center m-0">
              <ChevronRightIcon className="text-black" />
              <span className="font-semibold ml-1 text-black">Fine:</span>
              <span className="ml-8">{formatDateTime(selectedEvent.end)}</span>
            </p>
          </div>
          
          <div className="flex items-center mt-6 gap-6 text-sm text-gray-700">
            <p className="flex items-center m-0">
              <ChevronRightIcon className="text-black" />
              <span className="font-semibold ml-1 text-black">Numero di telefono:</span>
              <span className="ml-6">{selectedEvent.phone_number}</span>
            </p>
            <button className="flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition-colors">
              <LocalPhoneIcon fontSize="small" />
              <span className="font-semibold">Chiama</span>
            </button>
          </div>

          {selectedEvent.description && (
            <div className="mt-6 text-gray-900 flex items-start">
              <NotesIcon className="mt-0.5 text-gray-900" />
              <span className="font-semibold ml-1 whitespace-nowrap">Note:</span> 
              <span className="ml-2">{selectedEvent.description}</span>
            </div>
          )}
        </div>
      )}
    </ThemeProvider>
  );
}