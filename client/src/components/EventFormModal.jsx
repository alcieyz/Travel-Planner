import React from 'react';

const EventFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    selectedEvent,
    title,
    setTitle,
    description,
    setDescription,
    start,
    setStart,
    end,
    setEnd,
    color,
    setColor,
    onDelete
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>{selectedEvent ? 'Edit Event' : 'Add Event'}</h2>
                <form className='budget-form' onSubmit={onSubmit}>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Title" 
                    required
                />
                <textarea
                    rows={3}
                    value={description} 
                    onChange={(event) => setDescription(event.target.value) }
                    placeholder="Description" required
                />
                <input 
                    type="datetime-local"
                    value={start}
                    onChange={(event) => setStart(event.target.value)}>
                </input>
                <input 
                    type="datetime-local"
                    value={end}
                    onChange={(event) => setEnd(event.target.value)}>
                </input>
                <div className='category-input'>
                    <select className="select-dropdown" value={color} onChange={(e) => setColor(e.target.value)}>
                        <option value="#ff8282">Red</option>
                        <option value="#82deff">Blue</option>
                        <option value="#82ffa5">Green</option>
                        <option value="#ffd18d">Orange</option>
                        <option value="#f0ff8d">Yellow</option>
                        <option value="#e39bff">Purple</option>
                        <option value="#ffa6e3">Pink</option>
                        <option value="#d7d7d7">Gray</option>
                    </select>
                </div>
                {selectedEvent ? (
                    <div className="edit-btns">
                    <button 
                        className='delete-btn' 
                        type="button"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                    <div className="save-cancel">
                        <button type="submit">Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                    </div>
                ) : (
                    <div className="save-cancel">
                        <button type="submit">Add Entry</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                )}
                </form>
            </div>
        </div>
    );
};

export default EventFormModal;