import React, { useState } from "react";
import axios from 'axios'
const App = () => {
  const [notes, setnotes] = useState([
   
  ]);

  axios.get('http://localhost:3000/notes')
    .then((res) => {
      setnotes(res.data.notes)
  })

  return (
    <div>
      <div className="notes">
        {notes.map((elem, index) => (
          <div className="note" key={index}>
            <h1>{elem.title}</h1>
            <p>{elem.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
