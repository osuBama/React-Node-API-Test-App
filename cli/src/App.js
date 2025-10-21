import React, {useEffect, useState} from 'react';


function App() {

  const [backendData, setBackendData] = useState([{}])

  useEffect(() =>{
    fetch("/api/alive").then(
      response => response.json()
    ).then(
      data =>{
        setBackendData(data)
      }
    )
    
  },[])

  return (
    <div>
     
    </div>
  );
}

export default App;
