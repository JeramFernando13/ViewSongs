import './App.css'
import { supabase } from './supabase/supabaseClient'

function App() {
  async function testSupabase() {
    const { data, error } = await supabase.from('test').select()
    console.log(data, error)
  }

  return (
    <>
      <div className='text-center my-4'>
        <h1 className='text-3xl font-bold underline text-red-500'>Hello</h1>
        <button
          onClick={testSupabase}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Supabase
        </button>
      </div>
    </>
  )
}

export default App