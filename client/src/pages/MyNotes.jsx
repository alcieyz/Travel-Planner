import {useState, useEffect} from "react";
import './MyNotes.css';
import {useAuth} from "../AuthContext";
import SideMenu from '../components/SideMenu';

const MyNotes = () => { 
    const { username, isLoggedIn } = useAuth();
    const [notesByCategory, setNotesByCategory] = useState({});
    const [category, setCategory] = useState("Uncategorized");
    const [customCategory, setCustomCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (isLoggedIn && username) {
            fetchNotes();
        }
    }, [isLoggedIn, username]);

    const fetchNotes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/MyNotes?username=${username}`);
            if (!response.ok) {
                throw new Error("Failed to fetch notes");
            }
            const data = await response.json();
            setNotesByCategory(data);
        }
        catch (error) {
            console.error("Error fetching notes:", error.message);
        }
    };

    useEffect(() => {
        const fetchUserCategories = async () => {
            try {
                const response = await fetch(`http://localhost:5000/MyNotes/GetUserCategories?username=${username}`);
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

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category || "Uncategorized");
    }

    const handleAddNote = async (event) => {
        event.preventDefault();

        try {
            const newNote = { title, content, category, username };
            const response = await fetch("http://localhost:5000/MyNotes", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newNote),
            });
            if (!response.ok) {
                throw new Error("Failed to add note");
            }
            fetchNotes(); //Refresh notes
            resetForm();
        }
        catch (error) {
            console.error("Error adding note:", error.message);
        }
    };

    const handleUpdateNote = async (event) => {
        event.preventDefault();

        if(!selectedNote) {
            return;
        }

        try {
            const updatedNote = {id: selectedNote.id, title, content, category, username };
            const response = await fetch("http://localhost:5000/MyNotes", {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(updatedNote),
            });
            if (!response.ok) {
                throw new Error("Failed to update note");
            }
            fetchNotes();
            resetForm();
        }
        catch (error) {
            console.error("Error updating note:", error.message);
            alert(error.message);
        }
    };

    const deleteNote = async (event, noteId) => {
        event.stopPropagation();

        const confirmDeleteNote = window.confirm("Are you sure you want to delete this note?");
        if (!confirmDeleteNote) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/MyNotes/${noteId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete note");
            }
            fetchNotes();
            resetForm();
            alert('Note deleted successfully')
        }
        catch (error) {
            console.error("Error deleting note:", error.message);
            alert(error.message);
        }
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setCategory("Uncategorized");
        setSelectedNote(null);
    }


    return (
        <div className="page-container">
            <div className="notes-content">
                <div className="page-title">
                    <h1>My Notes</h1>
                </div>
                <form className="notes-form" onSubmit={selectedNote ? handleUpdateNote : handleAddNote}>
                    <input 
                        value={title} 
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        placeholder="Title" required>
                    </input>
                    <textarea 
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="Content" rows={10} required>
                    </textarea>

                    <div className='category-input'>
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

                    {selectedNote ? (
                        <div className="edit-btns">
                            <button className='delete-btn' 
                                onClick={(event) => {
                                    event.preventDefault();
                                    deleteNote(event, selectedNote.id);
                                }}
                            >
                                Delete</button>
                            <div className="save-cancel">
                                <button type="submit">Save</button>
                                <button type="button" onClick={resetForm}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button type="submit">Add Note</button>
                    )}
                </form>
                {Object.keys(notesByCategory).map((cat) => (
                    <div key={cat} className="notes-category">
                        <h2>{cat}</h2>
                        <div className="notes-grid">
                        {notesByCategory[cat].map((note) => (
                            <div key={note.id} className={`note-item ${selectedNote === note ? "selected" : ""}`} onClick={() => handleNoteClick(note)}>
                                <h2>{note.title}</h2>
                                <p>{note.content}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyNotes;