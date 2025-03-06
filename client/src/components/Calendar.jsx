import React, { useState, useEffect, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Calendar.css';
import { useAuth } from '../AuthContext';
import EventFormModal from './EventFormModal';

// Utility function to convert ISO 8601 to MySQL datetime format
const toMySQLDateTime = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

const Calendar = () => {
    const { username, isLoggedIn } = useAuth();
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fullCalendarRef = useRef(null);

    // Fetch events when component mounts or username changes
    useEffect(() => {
        if (isLoggedIn && username) {
            setIsLoading(true);
            setError(null);
            fetch(`http://localhost:5000/MySchedule?username=${username}`)
                .then(response => response.json())
                .then(data => {
                    const formattedEvents = data.map(event => ({
                        id: event.id,
                        title: event.title,
                        description: event.description,
                        start: event.start, // Backend should return UTC dates
                        end: event.end || null,
                        color: event.color,
                        extendedProps: { description: event.description },
                    }));
                    setEvents(formattedEvents);
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                    setError('Failed to fetch events. Please try again.');
                })
                .finally(() => setIsLoading(false));
        }
    }, [isLoggedIn, username]);

    const handleAddEvent = useCallback((arg) => {
        const clickedDate = arg.date;
        setCurrentEvent({
            title: '',
            description: '',
            start: clickedDate.toISOString(), // Use UTC
            end: new Date(clickedDate.getTime() + 60 * 60 * 1000).toISOString(), // Use UTC
            color: '#FF0000',
        });
        setIsEditing(false);
        setIsModalOpen(true);
    }, []);

    const handleEventClick = useCallback((info) => {
        setCurrentEvent({
            id: info.event.id,
            title: info.event.title,
            description: info.event.extendedProps.description || '',
            start: info.event.start.toISOString(), // Use UTC
            end: info.event.end ? info.event.end.toISOString() : '',
            color: info.event.backgroundColor || '#FF0000',
        });
        setIsEditing(true);
        setIsModalOpen(true);
    }, []);

    const handleEventDropOrResize = useCallback((info) => {
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
    }, []);

    const updateEventInBackend = useCallback(async (eventData) => {
        const method = eventData.id ? 'PUT' : 'POST';
        const url = eventData.id
            ? `http://localhost:5000/MySchedule/${eventData.id}`
            : 'http://localhost:5000/MySchedule';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, ...eventData }),
        });

        if (!response.ok) {
            throw new Error('Failed to update event.');
        }

        const updatedEvent = await response.json();

        return {
            id: updatedEvent.id,
            title: updatedEvent.title,
            description: updatedEvent.description,
            start: updatedEvent.start, // Ensure this is in UTC
            end: updatedEvent.end || null, // Ensure this is in UTC
            color: updatedEvent.color,
            extendedProps: { description: updatedEvent.description },
        };
    }, [username]);

    const handleFormSubmit = useCallback((eventData) => {
        const formattedEventData = {
            ...eventData,
            start: toMySQLDateTime(eventData.start), // Convert to MySQL format
            end: toMySQLDateTime(eventData.end), // Convert to MySQL format
        };

        updateEventInBackend(formattedEventData)
            .then(updatedEvent => {
                setEvents(prevEvents => {
                    if (isEditing) {
                        // Replace the old event with the updated event
                        return prevEvents.map(evt =>
                            evt.id === updatedEvent.id
                                ? { ...updatedEvent, extendedProps: { description: updatedEvent.description } }
                                : evt
                        );
                    } else {
                        // Add the new event
                        return [...prevEvents, { ...updatedEvent, extendedProps: { description: updatedEvent.description } }];
                    }
                });
                fullCalendarRef.current.getApi().refetchEvents();
                setIsModalOpen(false);
                setCurrentEvent(null);
            })
            .catch(error => {
                console.error('Error saving event:', error);
                setError('Failed to save event. Please try again.');
            });
    }, [isEditing, updateEventInBackend]);

    const handleDeleteEvent = useCallback(async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/MySchedule/${eventId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            setEvents(prevEvents => prevEvents.filter(evt => evt.id !== eventId));
            fullCalendarRef.current.getApi().refetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            setError('Failed to delete event. Please try again.');
        }
    }, []);

    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <FullCalendar
                ref={fullCalendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                dateClick={handleAddEvent}
                editable={true}
                eventDrop={handleEventDropOrResize}
                eventResize={handleEventDropOrResize}
                eventClick={handleEventClick}
                selectable={true}
                timeZone="UTC" // Ensure FullCalendar uses UTC
                eventContent={(eventInfo) => (
                    <div>
                        <strong>{eventInfo.event.title}</strong>
                        <p>{eventInfo.event.extendedProps.description}</p>
                    </div>
                )}
            />

            <EventFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentEvent(null);
                }}
                onSubmit={handleFormSubmit}
                event={currentEvent}
                isEditing={isEditing}
                onDelete={() => handleDeleteEvent(currentEvent.id)}
            />
        </div>
    );
};

export default Calendar;