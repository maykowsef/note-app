//insert emotes
import React from 'react'
import { Route,Routes } from 'react-router-dom'
import LoginSignUp from './loginSignUp'
import Notes from './notes'
function NoteApp() {
  return (
    <div className='noteApp'>
      {/* <LoginSignUp/> */}
<Routes>
<Route path="/" element={<LoginSignUp />} index >
         </Route>
<Route path="/login" element={<LoginSignUp />} index >
         </Route>
<Route path="/notes" element={<Notes/>} />
</Routes>

    </div>
  )
}

export default NoteApp
