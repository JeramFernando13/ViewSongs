import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../auth/Login'
import Register from '../auth/Register'

import Layout from '../layout/Layout'
import HomePage from '../pages/home/HomePage'

import Songs from '../pages/songpage/Songs'
import AddSong from '../pages/songpage/AddSong'
import EditSong from '../pages/songpage/EditSong'

import NotFound from '../pages/NotFound'
import Dashboard from '../pages/Dashboard'
import SongView from '../pages/songpage/SongView'
// import Auth from './pages/Auth'
// import Dashboard from './pages/Dashboard'

export function Routing() {
  return (

    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>

          {/* <Route path="/" element={<Auth />} /> */}
          <Route path='/' element= {<HomePage /> } />

          <Route path='/login' element = {<Login />} />
          <Route path='/register' element = {<Register />} />


          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/songs" element={<Songs />} />
          <Route path="/songs/new" element={<AddSong />} />
          <Route path="/songs/:id/edit" element={<EditSong />} />
          <Route path="/songs/:id" element={<SongView />} />

          <Route path="/dashboard" element={<Dashboard />} />

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  
)
}
