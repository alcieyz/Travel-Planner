import {useState, useEffect} from "react";
import './MyNotes.css';
import {useAuth} from "../AuthContext";
import NoteFormModal from '../components/NoteFormModal';

const MyNotes = () => { 
    const { username, isLoggedIn, currentTrip } = useAuth();
    const [notesByCategory, setNotesByCategory] = useState({});
    const [category, setCategory] = useState("Uncategorized");
    const [customCategory, setCustomCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (isLoggedIn && username) {
            fetchNotes();
            fetchUserCategories();
        }
    }, [isLoggedIn, username, currentTrip]);

    const fetchNotes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/MyNotes?username=${username}&tripId=${currentTrip.id}`);
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

    const fetchUserCategories = async () => {
        try {
            const response = await fetch(`http://localhost:5000/MyNotes/GetUserCategories?username=${username}&tripId=${currentTrip.id}`);
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

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category || "Uncategorized");
        setIsModalOpen(true);
    }

    const handleAddNote = async (event) => {
        event.preventDefault();

        try {
            const newNote = { title, content, category, username, tripId: currentTrip.id};
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
            setIsModalOpen(false);
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
            const updatedNote = {id: selectedNote.id, title, content, category, username};
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
            setIsModalOpen(false);
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

    const openAddNoteModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    return (
        <div className="page-container">
            <div className="notes-content">
                <div className="page-header">
                    <p><a href="/Dashboard">Dashboard</a> {'>'} <a href="/MyTrips">{currentTrip.name}</a> {'>'} My Notes</p>
                </div>
                <div className="page-title">
                    <h1>My Notes</h1>
                </div>
                <div className="add-btn">
                    <button className='add-note-btn' onClick={openAddNoteModal}>
                        + Add Note
                    </button>
                </div>
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
                <NoteFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={selectedNote ? handleUpdateNote : handleAddNote}
                    selectedNote={selectedNote}
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                    category = {category}
                    setCategory = {setCategory}
                    categories = {categories}
                    setCategories = {setCategories}
                    customCategory={customCategory}
                    setCustomCategory={setCustomCategory}
                    onDelete={(e) => {
                        e.preventDefault(); // Prevent form submission
                        if (selectedNote) {
                            deleteNote(e, selectedNote.id);
                        }
                        setIsModalOpen(false);
                        }}
                />
            </div>
        </div>
    )
}

export default MyNotes;