import {useState, useEffect} from "react";
import './MyBudget.css';
import {useAuth} from "../AuthContext";

const MyBudget = () => {
    const { username, isLoggedIn } = useAuth();
    const [entriesByCategory, setEntriesByCategory] = useState({});
    const [category, setCategory] = useState("Uncategorized");
    const [customCategory, setCustomCategory] = useState("");
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0.00);
    const [description, setDescription] = useState("");
    const [selectedEntry, setSelectedEntry] = useState(null);

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

    const resetForm = () => {
        setTitle("");
        setAmount(0);
        setDescription("");
        setCategory("Uncategorized");
        setSelectedEntry(null);
    }

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
                        onChange={(event) => setAmount(parseFloat(event.target.value).toFixed(2)) }
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
                {Object.keys(entriesByCategory).map((cat) => (
                    <div key={cat} className="entries-category">
                        <h2>{cat}</h2>
                        <div className="entries-grid">
                        {entriesByCategory[cat].map((entry) => (
                            <div key={entry.id} className="entry-item" onClick={() => handleEntryClick(entry)}>
                                <div className="entry-header">
                                    <button onClick={(event) => deleteEntry(event, entry.id)}>x</button>
                                </div>
                                <h2>{entry.title}</h2>
                                <p>${entry.amount}</p>
                                <p>{entry.description}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
                <h2>There will be a total sum.</h2>
            </div>
        </div>
    )
}

export default MyBudget;