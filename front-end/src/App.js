import React from 'react'
import "./api/api.js"
import Chat from './components/chat.js'
import T from './components/tts.js'
import YouTubePlaylist from './components/playlistdownloader.js'
import NoteApp from './components/noteApp/noteApp.js'
import RandomWordGenerator from './components/randomwordgenerator.js'
import Affirmations from './components/affirmationsSwapper.js'
import SongGenerator from './components/SongGenerator.js'

import jwt_decode from 'jwt-decode';
import "./App.css"
function App() {
   const  ytbapi="AIzaSyD-TaFjI0WNb32yTDj9pO7i8x78IgXL19I"
  return (
    <div className='App'>

{/* <Affirmations/> */}
     {/* <Chat/> */}
{/* <SongGenerator/> */}
     {/* <YouTubePlaylist/> */}
     {/* <RandomWordGenerator/> */}
     <NoteApp/>
     {/* <T/> */}
    </div>
  )
}

export default App
