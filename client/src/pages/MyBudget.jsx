import {useState, useEffect, Fragment} from "react";
import './MyBudget.css';
import {useAuth} from "../AuthContext";
import SideMenu from '../components/SideMenu';

const MyBudget = () => {
    const { username, isLoggedIn } = useAuth();
    const [entriesByCategory, setEntriesByCategory] = useState({});
    const [category, setCategory] = useState("Uncategorized");
    const [customCategory, setCustomCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [budget, setBudget] = useState(0);

    useEffect(() => {
        if (isLoggedIn && username) {
            fetchEntries();
        }
    }, [isLoggedIn, username]);

    const fetchEntries = async () => {
        try {
            const response = await fetch(`http://localhost:5000/MyBudget?username=${username}`);
            if (!response.ok) {
                throw new Error("Failed to fetch entries");
            }
            const data = await response.json();
            setEntriesByCategory(data);
        }
        catch (error) {
            console.error("Error fetching entries:", error.message);
        }
    };

    useEffect(() => {
        const fetchUserCategories = async () => {
            try {
                const response = await fetch(`http://localhost:5000/MyBudget/GetUserCategories?username=${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
                else {
                    console.error('Error fetching categories');
                }
            }
            catch (error) {
                console.error('Error:', error);
            }
        };
        fetchUserCategories();
    }, [username]);

    useEffect(() => {
        if (isLoggedIn && username) {
            fetchBudget();
        }
    }, [isLoggedIn, username]);

    const fetchBudget = async () => {
        try {
            const response = await fetch(`http://localhost:5000/MyBudget/GetUserBudget?username=${username}`);
            if (!response.ok) {
                throw new Error("Failed to fetch total budget");
            }
            const data = await response.json();
            setBudget(data.budget || 0);
        }
        catch (error) {
            console.error("Error fetching total budget:", error.message);
        }
    };

    const handleEntryClick = (entry) => {
        setSelectedEntry(entry);
        setTitle(entry.title);
        setAmount(entry.amount);
        setDescription(entry.description);
        setCategory(entry.category || "Uncategorized");
    }

    const handleAddEntry = async (event) => {
        event.preventDefault();

        try {
            const newEntry = { title, amount, description, category, username };
            const response = await fetch("http://localhost:5000/MyBudget", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newEntry),
            });
            if (!response.ok) {
                throw new Error("Failed to add entry");
            }
            fetchEntries(); //Refresh entries
            resetForm();
        }
        catch (error) {
            console.error("Error adding entry:", error.message);
        }
    };

    const handleUpdateEntry = async (event) => {
        event.preventDefault();

        if(!selectedEntry) {
            return;
        }

        try {
            const updatedEntry = {id: selectedEntry.id, title, amount, description, category, username };
            const response = await fetch("http://localhost:5000/MyBudget", {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(updatedEntry),
            });
            if (!response.ok) {
                throw new Error("Failed to update entry");
            }
            fetchEntries();
            resetForm();
        }
        catch (error) {
            console.error("Error updating entry:", error.message);
            alert(error.message);
        }
    };

    const deleteEntry = async (event, entryId) => {
        event.stopPropagation();

        const confirmDeleteEntry = window.confirm("Are you sure you want to delete this entry?");
        if (!confirmDeleteEntry) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/MyBudget/${entryId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete entry");
            }
            fetchEntries();
            resetForm();
            alert('Entry deleted successfully')
        }
        catch (error) {
            console.error("Error deleting entry:", error.message);
            alert(error.message);
        }
    };

    const handleBudgetSubmit = async (event) => {
        event.preventDefault();
        if (!budget) {
            alert("Please enter a monetary value");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/MyBudget/Budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({budget, username}),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message);
            }

            const data = await response.json();

            //Successful
            alert('Total budget updated successfully!');
        }
        catch (err) {
            alert(err.message);
        }
    }

    const resetForm = () => {
        setTitle("");
        setAmount(0);
        setDescription("");
        setCategory("Uncategorized");
        setSelectedEntry(null);
    }

    const totalAmount = Object.values(entriesByCategory)
        .flat()
        .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);

    return (
        <div className="page-container">
            <SideMenu/>
            <div className="budget-content">
                <div className="page-title">
                    <h1>My Budget</h1>
                </div>
                <form className="budget-form" onSubmit={selectedEntry ? handleUpdateEntry : handleAddEntry}>
                    <input 
                        value={title} 
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        placeholder="Title" required>
                    </input>
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
                    
                    <div className="category-input">
                        <select className="select-dropdown" value={category} onChange={(event) => setCategory(event.target.value)}>
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
                            onBlur={() => customCategory && setCategory(customCategory)} //Automatically select custom category
                        />
                    </div>

                    {selectedEntry ? (
                        <div className="edit-btns">
                            <button className='delete-btn' 
                                onClick={(event) => {
                                    event.preventDefault();
                                    deleteEntry(event, selectedEntry.id);
                                }}
                            >
                                Delete</button>
                            <div className="save-cancel">
                                <button type="submit">Save</button>
                                <button className="cancel-btn" onClick={resetForm}>Cancel</button>
                                </div>
                        </div>
                    ) : (
                        <button type="submit">Add Entry</button>
                    )}
                </form>

                <form className='budget-form' onSubmit={handleBudgetSubmit}>
                    <div className="budget-input">
                        <h2>Budget:</h2>
                        <input 
                            type="number"
                            step="0.01"
                            value={budget} 
                            onChange={(event) => setBudget(event.target.value) }
                            onBlur={(event) => setBudget(parseFloat(event.target.value || 0).toFixed(2))}
                            placeholder="Total Budget" required>
                        </input>
                        <button type="submit" className="submit">{(budget) ? "Change" : "Add"}&nbsp;Budget</button>
                    </div>
                </form>

                <div className="table-container">
                    <table className="entry-table">
                        <thead>
                            <tr>
                                <th>Details</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(entriesByCategory).map((cat) => (
                                <Fragment key={cat}>
                                    <tr className="category-row">
                                        <td colSpan="2">{cat}</td>
                                    </tr>
                                    {entriesByCategory[cat].map((entry) => (
                                        <tr key={entry.id} className={`entry-item ${selectedEntry === entry ? "selected" : ""}`} onClick={() => handleEntryClick(entry)}>
                                            <td>
                                                <span className="entry-title">{entry.title}</span>
                                                <span className="entry-description">{entry.description}</span>
                                            </td>
                                            <td>${entry.amount}</td>
                                        </tr>
                                    ))}
                                </Fragment>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><strong>Total</strong></td>
                                <td><strong>${totalAmount.toFixed(2)}</strong></td>
                            </tr>
                            <tr>
                                <td><strong>Amount Remaining</strong></td>
                                <td><strong>$ {(parseFloat(budget) - totalAmount).toFixed(2)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default MyBudget;