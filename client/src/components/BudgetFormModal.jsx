import React from 'react';

const BudgetFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    selectedEntry,
    title,
    setTitle,
    amount,
    setAmount,
    description,
    setDescription,
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
                <h2>{selectedEntry ? 'Edit Entry' : 'Add Entry'}</h2>
                <form className='budget-form' onSubmit={onSubmit}>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Title" 
                    required
                />
                <div className='amount-input'>
                    <h2>Amount:</h2>
                    <input 
                        type="number"
                        step="0.01"
                        value={amount} 
                        onChange={(event) => setAmount(event.target.value) }
                        onBlur={(event) => setAmount(parseFloat(event.target.value || 0).toFixed(2))}
                        placeholder="Amount" required>
                    </input>
                </div>
                <textarea 
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Description" rows={1}>
                </textarea>
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
                {selectedEntry ? (
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

export default BudgetFormModal;