import React, { useState, useEffect, useRef} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Calendar.css';
import { useAuth } from '../AuthContext';
import EventFormModal from './EventFormModal';

export default function Calendar({ username, tripId }) {
    /* const { username, isLoggedIn, currentTrip } = useAuth(); */
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [color, setColor] = useState('#3788d8');

    const calendarRef = useRef(null);

    // Fetch events from the server
    const fetchEvents = async () => {
        try {
            const response = await fetch(`http://localhost:5000/MySchedule?username=${username}&tripId=${tripId}`);
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [username, tripId]);

    // Handle date click (adding new event)
    const handleDateClick = (arg) => {
        const clickedDate = arg.date;
        const endDate = new Date(clickedDate);
        endDate.setHours(endDate.getHours() + 1);

        const formatLocalDateTime = (date) => {
            return [
                date.getFullYear(),
                (date.getMonth() + 1).toString().padStart(2, '0'),
                date.getDate().toString().padStart(2, '0')
            ].join('-') + 'T' + [
                date.getHours().toString().padStart(2, '0'),
                date.getMinutes().toString().padStart(2, '0')
            ].join(':');
        };
        
        setSelectedEvent(null);
        setTitle('');
        setDescription('');
        setStart(formatLocalDateTime(clickedDate));
        setEnd(formatLocalDateTime(endDate)); 
        setColor('#ffa6e3');
        setIsModalOpen(true);
    };

    // Handle event click (view/edit existing event)
    const handleEventClick = (info) => {
        const startStr = info.event.startStr.slice(0, 16); // Remove timezone info
        const endStr = info.event.endStr ? info.event.endStr.slice(0, 16) : startStr;

        setSelectedEvent(info.event);
        setTitle(info.event.title);
        setDescription(info.event.extendedProps.description || '');
        setStart(startStr);
        setEnd(endStr);
        setColor(info.event.backgroundColor || '#3788d8');
        setIsModalOpen(true);
    };

    /* const handleEventDropOrResize = useCallback((info) => {
        const { event } = info;
        const updatedEvent = {
            id: event.id,
            title: event.title,
            description: event.extendedProps.description || '',
            start: toMySQLDateTime(event.start.toISOString()), // Convert to MySQL format
            end: event.end ? toMySQLDateTime(event.end.toISOString()) : null, // Convert to MySQL format
            color: event.backgroundColor,
        };

        updateEventInBackend(updatedEvent)
            .then(() => {
                setEvents(prevEvents =>
                    prevEvents.map(evt =>
                        evt.id === updatedEvent.id
                            ? { ...updatedEvent, extendedProps: { description: updatedEvent.description } }
                            : evt
                    )
                );
                fullCalendarRef.current.getApi().refetchEvents();
            })
            .catch(error => {
                console.error('Error updating event:', error);
                info.revert();
            });
    }, []); */

    // Save event (both create and update)
    const handleSaveEvent = async () => {
        const toLocalISO = (dateStr) => {
            const date = new Date(dateStr);
            return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        };

        const eventData = {
            username,
            title,
            description,
            start: toLocalISO(start),
            end: toLocalISO(end),
            color,
            tripId
        };

        try {
            let response;
            if (selectedEvent) {
                // Update existing event
                response = await fetch(`http://localhost:5000/MySchedule/${selectedEvent.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData),
                });
            } else {
                // Create new event
                response = await fetch('http://localhost:5000/MySchedule', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData),
                });
            }

            const data = await response.json();
            fetchEvents(); // Refresh events
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    /* const handleEventChange = async (changedEvent) => {
        try {
          const response = await fetch(`http://localhost:5000/MySchedule/${changedEvent.event.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              start: changedEvent.event.start,
              end: changedEvent.event.end,
            })
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Update failed');
          }
        } catch (error) {
          console.error('Error updating event:', error);
          // Revert the change visually
          changedEvent.revert();
        }
      }; */

    // Delete event
    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;

        const confirmDeleteNote = window.confirm("Are you sure you want to delete this note?");
        if (!confirmDeleteNote) {
            return;
        }

        try {
            await fetch(`http://localhost:5000/MySchedule/${selectedEvent.id}`, {
                method: 'DELETE',
            });
            fetchEvents(); // Refresh events
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventContent={renderEventContent}

                timeZone='local' 
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    meridiem: false
                }}

                
                /* eventResizeFromStart={true} */
                /* eventResize={handleEventChange}
                eventDrop={handleEventChange} */
                
                /* eventContent={(eventInfo) => (
                    <div>
                        <strong>{eventInfo.event.title}</strong>
                        <p>{eventInfo.event.extendedProps.description}</p>
                    </div>
                )} */
            />

            {/* Event Modal */}
            <EventFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSaveEvent}
                    selectedEvent={selectedEvent}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    start={start}
                    setStart={setStart}
                    end={end}
                    setEnd={setEnd}
                    color = {color}
                    setColor = {setColor}
                    onDelete={(e) => {
                        e.preventDefault(); // Prevent form submission
                        if (selectedEvent) {
                            handleDeleteEvent(e, selectedEvent.id);
                        }
                        setIsModalOpen(false);
                        }}
            />
        </div>
    );
}

// Custom event rendering
function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <br></br>
            <i>{eventInfo.event.title}</i>
        </>
    );
}