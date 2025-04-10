import React, {useState} from 'react';

const TripFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    selectedTrip,
    name,
    setName,
    description,
    setDescription,
    start,
    setStart,
    end,
    setEnd,
    onDelete
}) => {
    const [error, setError] = useState('');

    const handleDateChange = (type, value) => {
        setError('');
        if (type === 'start') {
            setStart(value);
            // If end date exists and is before new start date, clear it
            if (end && new Date(value) > new Date(end)) {
                setEnd('');
            }
        } else {
            setEnd(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate dates
        if (start && end && new Date(end) < new Date(start)) {
            setError('End date cannot be before start date');
            return;
        }
        
        onSubmit(e); // Proceed with original submit if valid
    };
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>{selectedTrip ? 'Edit Trip' : 'Add Trip'}</h2>
                <form className='trips-form' onSubmit={onSubmit}>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Trip Name" 
                    required
                />
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Description" 
                    rows={10}
                />
                <input 
                    type="date" 
                    value={start} 
                    onChange={(e) => setStart(e.target.value)} 
                    required 
                    min={new Date().toISOString().split('T')[0]}
                />
                <input 
                    type="date" 
                    value={end} 
                    onChange={(e) => handleDateChange('end', e.target.value)} 
                    required 
                    min={start || new Date().toISOString().split('T')[0]}
                />
                {error && <div className="error-message">{error}</div>}
                {selectedTrip ? (
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
                        <button type="submit">Add Trip</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                )}
                </form>
            </div>
        </div>
    );
};

export default TripFormModal;