import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [notes, setnotes] = useState([]);
 
  console.log("hello integratrion");
  


  function fetchNotes() {
    axios.get("http://localhost:3000/notes").then((res) => {
      setnotes(res.data.notes);
    });
  }

  useEffect(() => {
    fetchNotes()
  }, []);

  function handleSubmit(e) {
    e.preventDefault()      

    const { title, description } = e.target.elements
    
    console.log(title.value,description.value);
    
    axios.post("http://localhost:3000/notes",{
      title: title.value,
      description:description.value
    })

      .then(res => {
        console.log(res.data);
        fetchNotes()
      
    })

  }

  function deleteHandle(id) {
    console.log(id);

    axios.delete("http://localhost:3000/notes/" + id)
      .then(res => {
        console.log(res.data);
        fetchNotes()
      })
    
  }


  return (
    <div>

      <form className="form-note" onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter title" name="title" />
        <input type="text" placeholder="Enter description" name="description" id="" />
        <button>Create Note</button>
      </form>

      <div className="notes">
        {notes.map((elem, index) => (
          <div className="note" key={index}>
            <h1>{elem.title}</h1>
            <p>{elem.description}</p>
            <button onClick={() => {
              deleteHandle(elem._id)
            }}>delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
