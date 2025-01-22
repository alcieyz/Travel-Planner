import {useState, useEffect} from "react";
import './MyNotes.css';
import {useAuth} from "../AuthContext";

const MyNotes = () => { 
    const { username, isLoggedIn } = useAuth();
    const [notesByCategory, setNotesByCategory] = useState({});
    const [category, setCategory] = useState("Uncategorized")
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);

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
            <div className="notes-container">
                <h1>My Notes</h1>
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

                    <select className="select-dropdown" value={category} onChange={(event) => setCategory(event.target.value)}>
                        <option value="Uncategorized">Uncategorized</option>
                        <option value="Attractions">Attractions</option>
                        <option value="Food">Food</option>
                        <option value="Stay">Stay</option>
                        <option value="Other">Other</option>
                    </select>

                    {selectedNote ? (
                        <div className="edit-buttons">
                            <button type="submit">Save</button>
                            <button type="button" onClick={resetForm}>Cancel</button>
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
                            <div key={note.id} className="notes-item" onClick={() => handleNoteClick(note)}>
                                <div className="notes-header">
                                    <button onClick={(event) => deleteNote(event, note.id)}>x</button>
                                </div>
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