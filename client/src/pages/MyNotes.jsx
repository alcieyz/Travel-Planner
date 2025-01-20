import {useState} from "react";
import './MyNotes.css';

const MyNotes = () => {
    const [notes, setNotes] = useState([
        {
            id: 1,
            title: "note title 1",
            content: "content 1",
        },
    ]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [selectedNote, setSelectedNote] = useState(null);

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
    }

    const handleAddNote = (event) => {
        event.preventDefault();

        const newNote = {
            id: notes.length + 1,
            title: title,
            content: content,
        };

        setNotes([newNote, ...notes]);
        setTitle("");
        setContent("");
    };

    const handleUpdateNote = (event) => {
        event.preventDefault();

        if(!selectedNote) {
            return;
        }

        const updatedNote = {
            id: selectedNote.id,
            title: title,
            content: content,
        }

        const updatedNotesList = notes.map((note) => note.id === selectedNote.id ? updatedNote : note)

        setNotes(updatedNotesList);
        setTitle("");
        setContent("");
        setSelectedNote(null);
    };

    const handleCancel = () => {
        setTitle("");
        setContent("");
        setSelectedNote(null);
    }

    const deleteNote = (event, noteId) => {
        event.stopPropagation();

        const updatedNotes = notes.filter((note) => note.id !== noteId);
        setNotes(updatedNotes);
    };


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
                        onChange={(event) =>
                            setContent(event.target.value)
                        }
                        placeholder="Content" rows={10} required>
                    </textarea>

                        {selectedNote ? (<div className="edit-buttons">
                            <button type="submit">Save</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                        ) : (
                            <button type="submit">Add Note</button>
                        )}
                </form>
                <div className="notes-grid">
                    {notes.map((note)=> (
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
        </div>
    )
}

export default MyNotes;
