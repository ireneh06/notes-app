import { useState, useEffect } from 'react'
import './App.css'
import editIcon from './assets/edit.png'
import deleteIcon from './assets/delete.png'

type Note = {
  id: string;
  title: string;
  content: string;
}



function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      return JSON.parse(savedNotes); //if notes not empty: return stored notes json . parse
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])   //dependency list-> exec when notes change, [] -> only exec on start

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")

  function newNote() {
    setNewTitle("")
    setNewContent("")
    setEditingIndex(-1)
  }

  function changeNote(index: number) {
    setEditingIndex(index);
    setNewTitle(notes[index].title)
    setNewContent(notes[index].content)
  }

  function save() {
    if (newTitle.trim() === "" && newContent.trim() === "") {
      setEditingIndex(null)
      return
    }

    if (editingIndex === -1) {
      const note: Note = {
        id: crypto.randomUUID(),
        title: newTitle,
        content: newContent
      }
      setNotes([...notes, note]) //neue note hinzufügen
    }
    else {
      //wrong: notes[editingIndex] = note; react expects a new array
      const updatesNotes = [...notes];
      updatesNotes[editingIndex!] = {
        ...updatesNotes[editingIndex!],  //... > copy all existing fields
        title: newTitle,
        content: newContent
      };
      setNotes(updatesNotes);
    }
    setNewTitle("")
    setNewContent("")
    setEditingIndex(null)
  }

  function deleteNote(indexToDelete: number) {
    setNotes(notes.filter((_, index) => index !== indexToDelete))
  }

  return (
    <div className='body'>
      {editingIndex === null &&
        <div className='displayNoteDiv'>

          {notes.map((note, index) => (
            <div className='noteCard' key={note.id}>
              <div className='noteContent'>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
              </div>
              <div className='noteButtons'>
                {/* rather use img in button div -> otherwise no tab stop */}

                <img className='icon' src={editIcon} alt="Bearbeiten" onClick={() => changeNote(index)} />
                <img className='icon' src={deleteIcon} alt="Löschen" onClick={() => deleteNote(index)} />
              </div>
            </div>
          ))}

          <button className='btn' onClick={newNote}>Neue Notiz erstellen</button>
        </div>
      }

      {editingIndex !== null &&
        <div className='newNoteDiv'>
          <input className='input' type="text" placeholder='Titel' value={newTitle} onChange={(e) => {
            setNewTitle(e.target.value)
          }} />
          <textarea className='input content' placeholder='Inhalt' value={newContent} onChange={(e) =>
            setNewContent(e.target.value)
          } />

          <button className='btn' onClick={save}>Speichern</button>
          <button className='btn' onClick={() => setEditingIndex(null)}>Abbrechen</button>

        </div>
      }
    </div>
  )
}

export default App;
