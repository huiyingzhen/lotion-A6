import { v4 as uuid } from "uuid";
import { useState, useEffect } from "react";
import { Outlet, Link} from "react-router-dom";

function Layout() {
  const [toggle, setToggle] = useState(true);

  const [notes, setNotes] = useState(
    localStorage.notes ? JSON.parse(localStorage.notes) : []
  );

  //localStorage.clear();

  const [activeNote, setActiveNote] = useState(false);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const onAddNote = () => {
    const newNote = {
      id: uuid(),
      title: "Untitled",
      content: "",
      lastModified: Date.now(),
    };

    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
  };

  const getActiveNote = () => {
    return notes.find(({ id }) => id === activeNote);
  };

  return (
    <>
      <div className="header">
        <button id="menu" onClick={() => setToggle(!toggle)}>
          &#9776;
        </button>
        <div id="title">
          <h2>Lotion</h2>
          <h6>Like Notion, but worse.</h6>
        </div>
      </div>

      <div className="main">
        {toggle && (
          <>
            <div className="sidebar">
              <div id="sidebar-header">
                <h3>Notes</h3>
                <button className="add-note" onClick={() => onAddNote()}>
                  &#43;
                </button>
              </div>

              <div className="sidebar-notes">
                {notes.length === 0 ? (
                  <p>No notes yet.</p>
                ) : (
                  notes.map((note) => (
                    <Link to={`/notes/${note.id}/edit`} key={note.id} style={{textDecoration: 'none', color: 'black'}}>
                      <div className={`sidebar-note ${note.id === activeNote && "active"}`} onClick={() => setActiveNote(note.id)}>
                        <strong>{note.title}</strong>
                        <small>{note.lastModified}</small>
                        {note.content && note.content.toString().replace( /(<([^>]+)>)/ig, '').substring(0, 100) + "..."}
                        
                      </div>
                    </Link>
                  ))
                )}
              </div>

            </div>
          </>
        )}
          {notes.length === 0 ? (
            <p>Select a note, or create a new one.</p>
          ) : (
            <Outlet context={[ getActiveNote, notes]}/>
          )}
      </div>
    </>
  );
}

export default Layout;
