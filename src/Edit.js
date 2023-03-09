import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import DateTimeP from 'react-datetime-picker';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Edit(){
    const [ getActiveNote, notes] = useOutletContext(); 
    const { id } = useParams();
    const [note, setNote] = useState(null);

    useEffect(() => {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        const index = notes.findIndex((n) => n.id === id);
        if(index >= 0){
            setNote(notes[index]);
        }
    }, [id]);

    useEffect(() => {
        if (notes) {
            const index = notes.findIndex((n) => n.id === id);
            if (index >= 0) {
                setNote(notes[index]);
            }
        }
    }, [id, notes]);

    useEffect(() => {
        if (note) {
            const notes = JSON.parse(localStorage.getItem("notes")) || [];
            const index = notes.findIndex((n) => n.id === note.id);
            if (index >= 0) {
                notes[index] = note;
            } else {
                notes.push(note);
            }
            localStorage.setItem("notes", JSON.stringify(notes));
        }
    }, [note]);

    const handleTitleChange = (event) => {
        setNote({
            ...note,
            title: event.target.value,
            lastModified: new Date().toLocaleString(),
        });
    };

    const handleContentChange = (content) => {
        setNote({
            ...note,
            content,
            lastModified: new Date().toLocaleString(),
        });
    };

    const handleSave = () => {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        const index = notes.findIndex((n) => n.id === note.id);
        if (index >= 0) {
            // Update the existing note in the sidebar list with the new content
            notes[index] = note;
        } else {

            notes.push(note);
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        setIsEditMode(false);
        
        // Set the new note as the active note in the outlet context
        getActiveNote(note);
    }

    const handleDelete = () => {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        const index = notes.findIndex((n) => n.id === note.id);
        if(index >= 0){
            notes.splice(index, 1);
            localStorage.setItem("notes", JSON.stringify(notes));
            window.location.replace(`/notes/`);
        }
    };

    const [isEditMode, setIsEditMode] = useState(true);

    return(
        <>

            <div className="main-notes">
            <div className="main-header">
                {isEditMode ? (
                    <div className="header-left">
                        <div className="header-title">
                            <input type="text" value={note?.title} onChange={handleTitleChange}></input>
                        </div>
                        <div >
                            <DateTimeP value={new Date()} onChange={() => {}}/>
                        </div>
                    </div>
                ) : (
                <div className="header-left">
                    <div className="header-title">
                        <p>{note.title}</p>
                    </div>
                    <div>
                        <small>{note.lastModified}</small>
                    </div>
                </div>
                )}

                <div className="header-right">
                    {isEditMode ? (
                        <button className="header-buttons" onClick={handleSave}>Save</button>
                    ) : (
                        <button className="header-buttons" onClick={() => setIsEditMode(true)}>Edit</button>
                    )}
                    <button className="header-buttons" onClick={() => handleDelete(note.id)}>Delete</button>
                </div>
            </div>

            {isEditMode ? (
                <div className="main-quill">
                    <ReactQuill theme="snow" value={note?.content} onChange={handleContentChange}/>
                </div>
            ) : (
                <div className="main-note">
                    <p>{note.content.toString().replace( /(<([^>]+)>)/ig, '')}</p>
                </div>
            )}
        </div>

        </>
    )
}

export default Edit;

