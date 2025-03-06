import React, { useState, useEffect } from 'react';
import './EventFormModal.css';

const EventFormModal = ({ isOpen, onClose, onSubmit, event, isEditing, onDelete }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [color, setColor] = useState('#FF0000');
    const [error, setError] = useState('');

    // Convert UTC dates to local time for display
    const toLocalTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Adjust for local timezone offset
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().slice(0, 16); // Format as 'YYYY-MM-DDTHH:MM'
    };

    useEffect(() => {
        if (event) {
            setTitle(event.title || '');
            setDescription(event.description || '');
            setStart(toLocalTime(event.start)); // Convert to local time for display
            setEnd(toLocalTime(event.end)); // Convert to local time for display
            setColor(event.color || '#FF0000');
        }
    }, [event]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (new Date(start) >= new Date(end)) {
            setError('End time must be after start time.');
            return;
        }
        onSubmit({
            title,
            description,
            start,
            end,
            color,
        });
        onClose();
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            onDelete();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="event-form-modal-container">
            <div className="event-form-container">
                <h2>{isEditing ? 'Edit Event' : 'Add Event'}</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>Title:</label>
                    <input className="event-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <br />
                    <label>Description:</label>
                    <textarea className="event-input" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <br />
                    <label>Start:</label>
                    <input className="event-input" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
                    <br />
                    <label>End:</label>
                    <input className="event-input" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
                    <br />
                    <label>Color:</label>
                    <select className="event-input" value={color} onChange={(e) => setColor(e.target.value)}>
                        <option value="#FF0000">Red</option>
                        <option value="#00FF00">Green</option>
                        <option value="#0000FF">Blue</option>
                        <option value="#FFFF00">Yellow</option>
                        <option value="#FF00FF">Magenta</option>
                        <option value="#00FFFF">Cyan</option>
                    </select>
                    <br />
                    <div className="event-submit-container">
                        <button className="event-submit-btns" type="submit">Save</button>
                        <button className="event-submit-btns" type="button" onClick={onClose}>Cancel</button>
                        {isEditing && (
                            <button className="event-submit-btns delete-btn" type="button" onClick={handleDelete}>
                                Delete
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventFormModal;