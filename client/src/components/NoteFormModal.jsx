import React from 'react';

const NoteFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    selectedNote,
    title,
    setTitle,
    content,
    setContent,
    category,
    setCategory,
    categories,
    customCategory,
    setCustomCategory,
    onDelete
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>{selectedNote ? 'Edit Note' : 'Add Note'}</h2>
                <form className='notes-form' onSubmit={onSubmit}>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Title" 
                    required
                />
                <textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="Content" 
                    rows={10} required
                />
                <div className='category-input'>
                    <select className="select-dropdown" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Uncategorized">Uncategorized</option>
                        <option value="Attractions">Attractions</option>
                        <option value="Food">Food</option>
                        <option value="Stay">Stay</option>
                        <option value="Other">Other</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                        {customCategory && <option value={customCategory}>{customCategory}</option>}
                    </select>

                    <input 
                        type="text" 
                        maxLength={80}
                        placeholder="Add custom category" 
                        value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} 
                        onBlur={() => customCategory && setCategory(customCategory)}
                    />
                </div>
                {selectedNote ? (
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
                        <button type="submit">Add Note</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                )}
                </form>
            </div>
        </div>
    );
};

export default NoteFormModal;