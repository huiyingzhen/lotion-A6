import Layout from './Layout';
import Edit from './Edit';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return(
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Layout/>}>
          <Route path='/notes/:id/edit' element={<Edit/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
