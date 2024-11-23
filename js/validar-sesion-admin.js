async function verifyUser (){
  if (! await verifyToken()) { 
    window.location.href = "../index.html";
  }else {
    let userName = localStorage.getItem('userName');
    document.querySelector('.user-name').innerHTML = userName;
  }
}

verifyUser ()

async function verifyToken() {
  const token = localStorage.getItem('access_token');
  if (!token) return false;

  const response = await fetch('http://127.0.0.1:8000/verify-token', {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`
      }
  });

  return response.ok;

  
}

const logout = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('access_token');
  localStorage.removeItem('rol');
  window.location.href = "../index.html";
}