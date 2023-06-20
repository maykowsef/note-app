import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@mui/icons-material';
import { Delete } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import { Add } from '@mui/icons-material';



import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteConfirmationDialog from '../dialoguePopUp';

import "./notes.css"
function Notes() {
  const [notes, setNotes] = useState([]);
  const [id, setId] = useState('');
  const [un, setUn] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showPopup, setShowPopup] = useState(false);
  const [isDeleteDialogOpen,setIsDeleteDialogOpen]=useState(false)
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
  });
  const [selectedNote, setSelectedNote] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const authenticated = token !== null;

  useEffect(() => {
    if (authenticated) {
      const decodedToken = jwt_decode(token);
setUn(decodedToken.userName)
      setId(decodedToken.userId);
    }
  }, [authenticated, token]);

  useEffect(() => {
    if (id) {
      fetchNotes();
    }
  }, [id]);

  const fetchNotes = () => {
    fetch(`http://localhost:3001/notes/${id}`)
      .then((response) => response.json())
      .then((data) => setNotes(data))
      .catch((error) => console.error('Error fetching notes:', error));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const handleAddNote = () => {
    setSelectedNote(null);
    setShowPopup(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
    });
    setShowPopup(true);
  };

  const handleDeleteNote = (noteId) => {
    fetch(`http://localhost:3001/notes/${noteId}/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setIsDeleteDialogOpen(false)
        fetchNotes();
      })
      .catch((error) => console.error('Error deleting note:', error));

  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedNote(null);
    setNewNote({
      title: '',
      content: '',
    });
  };

  const handleNoteChange = (e) => {
    setNewNote({
      ...newNote,
      [e.target.name]: e.target.value,
    });
  };

  const handleNoteSave = () => {
    const { title, content } = newNote;

    if (selectedNote) {
      fetch(`http://localhost:3001/notes/${selectedNote.note_id}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      })
        .then(() => {
          fetchNotes();
          handlePopupClose();
        })
        .catch((error) => console.error('Error updating note:', error));
    } else {
      fetch(`http://localhost:3001/notes/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          user_id: id,
        }),
      })
        .then(() => {
          fetchNotes();
          handlePopupClose();
        })
        .catch((error) => console.error('Error saving note:', error));
    }
    notify()
  };


  const notify = () =>  toast.success('🦄 Your note has been saved successfully.', {
    position: "bottom-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });

  ;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Intl.DateTimeFormat(undefined, options).format(date);
  };

  const formatContent = (content) => {
    const maxLength = 25; // Maximum length of the content to show
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    } else {
      return content;
    }
  };




  return (
    <>
    <div className='note-dashboard'>


       <ToastContainer/>
      <div className='menu'>
        <div className='user'>
         <div> {un}</div>
          <div onClick={handleLogout} className='logout'><LogoutOutlined/></div>
         </div>
       </div>
       <div className='notes-container'>
      {notes.map((note) => (
        <div key={note.note_id} className="note-box">
          <div className='note-title'>🦄 {formatContent(note.title)} 🦄</div>
           <div className='note-content'>{formatContent(note.content)}</div>

          <div className='edit-delete-container'>
            <Edit  onClick={() => handleEditNote(note)}/>
            <div className='note-date'>Last modified at :<br/> {formatDate(note.modified_at)}</div>

            <Delete onClick={()=>{setIsDeleteDialogOpen(true);setSelectedNote(note.note_id)}}/>


            </div>
        </div>


      ))}


</div>

<div className='add-note' onClick={handleAddNote}>
<div>
<Add  />
Add a note
</div>
</div>
{setIsDeleteDialogOpen&&(   <DeleteConfirmationDialog
  open={isDeleteDialogOpen}
  onClose={() => setIsDeleteDialogOpen(false)}
  onConfirm={() => handleDeleteNote(selectedNote)}
/>
)}




    </div>

{showPopup && (
  <div className="popup">
    <div className="popup-content ">
      <div className="popup-header-text" >{selectedNote ? 'Edit Note' : 'Add Note'}</div>

        <input
          type="text"
          name="title"
          placeholder='note-name'
          value={newNote.title}
          onChange={handleNoteChange}
        />

        <textarea
          placeholder='note-content'
          name="content"
          value={newNote.content}
          onChange={handleNoteChange}
        />

      <div className='popup-actions-wrapper'>
        <div className="save-button popup-actions-button" onClick={handleNoteSave}>Save</div>
        <div className="cancel-button popup-actions-button"  onClick={handlePopupClose}>Cancel</div>
      </div>
    </div>
  </div>
)}
</>
  );
}

export default Notes;
