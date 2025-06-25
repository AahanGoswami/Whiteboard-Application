/*import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import Toolbox from "./components/Toolbox";
import BoardProvider from "./store/BoardProvider";
import ToolboxProvider from "./store/ToolboxProvider";
*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Profile from './pages/profile';
import CanvasPage from './pages/CanvasPage';

function App() {

  /*const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3031/api/register')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);*/

  return (
    /*<BoardProvider>
      <ToolboxProvider>
        <Toolbar />
        <Board />
        <Toolbox />
      </ToolboxProvider>
    </BoardProvider>*/

    /*<div>
      <h1>Whiteboard</h1>
      <p>{data ? data.message : 'Loading...'}</p>
    </div>*/
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/canvas/:id" element={<CanvasPage />} />
          
      </Routes>
    </Router>
  );
}

export default App;
