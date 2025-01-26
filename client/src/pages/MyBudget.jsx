import {useState, useEffect, Fragment} from "react";
import './MyBudget.css';
import {useAuth} from "../AuthContext";

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

            if (response.ok) {
                const message = await response.text();
                throw new Error(message);
            }

            const data = await response.json();

            //Successful
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
            <div className="budget-container">
                <h1>My Budget</h1>
                <form className="budget-form" onSubmit={selectedEntry ? handleUpdateEntry : handleAddEntry}>
                    <input 
                        value={title} 
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        placeholder="Title" required>
                    </input>
                    <input 
                        type="number"
                        step="0.01"
                        value={amount} 
                        onChange={(event) => setAmount(event.target.value) }
                        onBlur={(event) => setAmount(parseFloat(event.target.value || 0).toFixed(2))}
                        placeholder="Amount ($)" required>
                    </input>
                    <textarea 
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Description" rows={1}>
                    </textarea>

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
                        placeholder="Add custom category" 
                        value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} 
                        onBlur={() => customCategory && setCategory(customCategory)} //Automatically select custom category
                    />

                    {selectedEntry ? (
                        <div className="edit-buttons">
                            <button type="submit">Save</button>
                            <button type="button" onClick={resetForm}>Cancel</button>
                        </div>
                    ) : (
                        <button type="submit">Add Entry</button>
                    )}
                </form>

                <form onSubmit={handleBudgetSubmit}>
                    <div className="inputs">
                        <div className="input">
                            <input 
                                type="number"
                                step="0.01"
                                value={budget} 
                                onChange={(event) => setBudget(event.target.value) }
                                onBlur={(event) => setBudget(parseFloat(event.target.value || 0).toFixed(2))}
                                placeholder="Total Budget ($)" required>
                            </input>
                            <button type="submit" className="submit">{(budget) ? "Change" : "Add"} Budget</button>
                        </div>
                    </div>
                </form>

                <table className="entry-table">
                    <thead>
                        <tr>
                            <th>Details</th>
                            <th>Amount</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(entriesByCategory).map((cat) => (
                            <Fragment key={cat}>
                                <tr className="category-row">
                                    <td colSpan="3">{cat}</td>
                                </tr>
                                {entriesByCategory[cat].map((entry) => (
                                    <tr key={entry.id} className="entry-item" onClick={() => handleEntryClick(entry)}>
                                        <td>
                                            <span className="entry-title">{entry.title}</span>
                                            <span className="entry-description">{entry.description}</span>
                                        </td>
                                        <td>${entry.amount}</td>
                                        <td>
                                            <button onClick={(event) => deleteEntry(event, entry.id)}>x</button>
                                        </td>
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
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

export default MyBudget;