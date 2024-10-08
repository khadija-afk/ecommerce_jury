import React from 'react'

const LogoutButton = () => {

    const handleLogout = async () =>{
        try{
            const response = await fetch('http://localhost:9090/api/Log/logout', {
                method: 'POST',
                credentials: 'include',
              });

              if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Affiche "Logout successful"
                window.location.href = '/login'; // Redirection vers la page de connexion
              } else {
                const error = await response.json();
                console.error('Logout error:', error.message);
              }

        }catch(error) {
            console.error('Network error', error);
        }

    }

  return <button onClick={handleLogout}>Logout</button>;
  
}

export default LogoutButton