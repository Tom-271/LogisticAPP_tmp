"use client";

import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotesIcon from '@mui/icons-material/Notes';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface DeliveryEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  phone_number?: string;
  description?: string;
}

const MONTHS_IT = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];
const MONTHS_SHORT_IT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const DAYS_SHORT_IT  = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
const DAYS_FULL_IT   = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

function midnight(d: Date): Date {
  const n = new Date(d); n.setHours(0, 0, 0, 0); return n;
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(d.getDate() + n); return r;
}
function sameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('it-IT', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function Calendar({ refreshTrigger = 0 }: { refreshTrigger?: number }) {
  const realToday = React.useMemo(() => midnight(new Date()), []);

  const [centerDate, setCenterDate]     = React.useState<Date>(realToday);
  const [selectedDay, setSelectedDay]   = React.useState<Date>(realToday);
  const [events, setEvents]             = React.useState<DeliveryEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<DeliveryEvent | null>(null);
  const [showPicker, setShowPicker]     = React.useState(false);
  const [pickerYear, setPickerYear]     = React.useState(realToday.getFullYear());
  const pickerRef = React.useRef<HTMLDivElement>(null);

  // When navigation moves the center, select the center day and clear event detail
  const goBack = () => {
    setCenterDate(d => { const n = addDays(d, -1); setSelectedDay(n); return n; });
    setSelectedEvent(null);
  };
  const goForward = () => {
    setCenterDate(d => { const n = addDays(d, 1);  setSelectedDay(n); return n; });
    setSelectedEvent(null);
  };

  const fetchDeliveries = React.useCallback(async () => {
    try {
      const res  = await fetch('http://localhost:1337/api/consegnas');
      const json = await res.json();
      const mapped: DeliveryEvent[] = (json.data ?? [])
        .filter((item: any) => item.Inizio_Consegna && item.Fine_Consegna)
        .map((item: any) => ({
          id:           item.documentId || String(item.id),
          title:        item.Titolo || 'Consegna',
          start:        item.Inizio_Consegna,
          end:          item.Fine_Consegna,
          phone_number: item.Numero_Telefono || 'N/A',
          description:  item.Descrizione || '',
        }));
      setEvents(mapped);
    } catch (err) {
      console.error('Errore nel recupero delle consegne:', err);
    }
  }, []);

  React.useEffect(() => { fetchDeliveries(); }, [fetchDeliveries, refreshTrigger]);

  // Close picker on outside click
  React.useEffect(() => {
    if (!showPicker) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node))
        setShowPicker(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPicker]);

  const visibleDays = [-1, 0, 1].map(offset => addDays(centerDate, offset));

  const eventsForDate = (date: Date) =>
    events
      .filter(e => sameDay(new Date(e.start), date))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const jumpToMonth = (month: number) => {
    const d = midnight(new Date(pickerYear, month, 1));
    setCenterDate(d); setSelectedDay(d);
    setShowPicker(false); setSelectedEvent(null);
  };

  const centerMonth = centerDate.getMonth();
  const centerYear  = centerDate.getFullYear();

  const selectedDayEvents = eventsForDate(selectedDay);

  return (
    <div className="mt-4 select-none">

      {/* ── Header: frecce + etichetta mese/anno cliccabile ── */}
      <div className="relative flex items-center justify-between mb-4 px-1">
        <button
          onClick={goBack}
          className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-600"
        >
          <ChevronLeftIcon />
        </button>

        <div ref={pickerRef} className="relative">
          <button
            onClick={() => { setPickerYear(centerYear); setShowPicker(v => !v); }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
          >
            <span className="text-lg font-bold text-gray-800">
              {MONTHS_IT[centerMonth]} {centerYear}
            </span>
            <CalendarMonthIcon fontSize="small" className="text-gray-800" />
          </button>

          {/* ── Picker dropdown ── */}
          {showPicker && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-64">
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => setPickerYear(y => y - 1)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronLeftIcon fontSize="small" />
                </button>
                <span className="font-bold text-gray-800">{pickerYear}</span>
                <button onClick={() => setPickerYear(y => y + 1)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronRightIcon fontSize="small" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {MONTHS_SHORT_IT.map((name, i) => {
                  const isActive      = i === centerMonth && pickerYear === centerYear;
                  const isCurrentMon  = i === realToday.getMonth() && pickerYear === realToday.getFullYear();
                  return (
                    <button
                      key={i}
                      onClick={() => jumpToMonth(i)}
                      className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-500 text-white shadow-sm'
                          : isCurrentMon
                          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={goForward}
          className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-600"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* ── 3-day cards ── */}
      <div className="flex gap-3">
        {visibleDays.map((date, idx) => {
          const isCenter    = idx === 1;
          const today       = sameDay(date, realToday);
          const isSelected  = sameDay(date, selectedDay);
          const count       = eventsForDate(date).length;
          const diffMonth   = date.getMonth() !== centerMonth;

          return (
            <button
              key={idx}
              onClick={() => { setSelectedDay(date); setSelectedEvent(null); }}
              className={`flex-1 rounded-2xl border flex flex-col overflow-hidden transition-all duration-200 text-left focus:outline-none ${
                isSelected
                  ? 'ring-2 ring-black shadow-lg'
                  : 'hover:shadow-md'
              } ${
                today
                  ? 'border-blue-700 shadow-md'
                  : 'border-gray-200 bg-white'
              } ${isCenter ? '' : 'opacity-75 scale-[0.97]'}`}
            >
              {/* Day header */}
              <div className={`px-3 py-3 text-center ${today ? 'bg-blue-500' : 'bg-gray-50 border-b border-gray-200'}`}>
                {diffMonth && (
                  <div className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${today ? 'text-blue-200' : 'text-gray-400'}`}>
                    {MONTHS_SHORT_IT[date.getMonth()]}
                  </div>
                )}
                <div className={`text-xs font-semibold uppercase tracking-wider ${today ? 'text-blue-100' : 'text-gray-400'}`}>
                  {DAYS_SHORT_IT[date.getDay()]}
                </div>
                <div className={`font-bold leading-none mt-1 ${isCenter ? 'text-3xl' : 'text-2xl'} ${today ? 'text-white' : 'text-gray-800'}`}>
                  {date.getDate()}
                </div>
                {today && (
                  <div className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest mt-1">
                    Oggi
                  </div>
                )}
              </div>

              {/* Event count badge */}
              <div className="px-3 py-2.5 bg-white flex items-center justify-center min-h-[44px]">
                {count === 0 ? (
                  <span className="text-xs text-gray-300">Nessun evento</span>
                ) : (
                  <span className={`inline-flex items-center gap-1 text-md font-bold px-2.5 py-1 rounded-full ${
                    today ? 'bg-yellow-100 text-orange-500' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count} {count === 1 ? 'evento' : 'eventi'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Lista eventi del giorno selezionato ── */}
      <div className="mt-4">
        {/* Header del giorno selezionato */}
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="text-sm font-bold text-gray-700">
            {DAYS_FULL_IT[selectedDay.getDay()]}{' '}
            {selectedDay.getDate()} {MONTHS_IT[selectedDay.getMonth()]} {selectedDay.getFullYear()}
          </span>
          {selectedDayEvents.length > 0 && (
            <span className="text-xs text-gray-400">— {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'evento' : 'eventi'}</span>
          )}
        </div>

        {selectedDayEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-400">
            Nessun evento per questo giorno
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedDayEvents.map(event => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(prev => (prev?.id === event.id ? null : event))}
                className={`w-full text-left rounded-2xl border px-4 py-3 flex items-center gap-4 transition-all ${
                  selectedEvent?.id === event.id
                    ? 'border-blue-400 bg-blue-500 text-white shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50'
                }`}
              >
                <div className={`flex items-center gap-1.5 text-xs font-semibold shrink-0 ${
                  selectedEvent?.id === event.id ? 'text-blue-100' : 'text-blue-500'
                }`}>
                  <AccessTimeIcon fontSize="inherit" />
                  {formatTime(event.start)}
                </div>
                <div className={`w-px h-5 shrink-0 ${selectedEvent?.id === event.id ? 'bg-blue-300' : 'bg-gray-200'}`} />
                <div className={`font-semibold text-sm truncate ${selectedEvent?.id === event.id ? 'text-white' : 'text-gray-800'}`}>
                  {event.title}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Pannello dettaglio evento ── */}
      {selectedEvent && (
        <div className="mt-4 rounded-2xl border border-blue-300 bg-blue-50 px-6 py-4 shadow-sm">
          <div className="relative flex items-center justify-center mb-4">
            <h2 className="text-4xl uppercase font-bold text-blue-900 leading-tight text-center">{selectedEvent.title}</h2>
            <button className="absolute right-0 flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-700 rounded-full px-4 py-2 hover:bg-blue-800 active:scale-95 transition-all shadow-sm">
              <EditIcon style={{ fontSize: 16 }} />
              Modifica
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
    </div>
  );
}
