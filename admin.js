
const logout = () => {
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = 'http://localhost:5500/index.html';
};
document.getElementById('logout-btn').addEventListener('click', logout);

const setLoading = () => {
    document.getElementById('loading').classList.remove('hidden');
};

const removeLoading = () => {
    document.getElementById('loading').classList.add('hidden');
};

const get_cookie = (cookie_name) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + cookie_name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

const initialize = async () => {

    setLoading();

    const token = get_cookie('token');

    if (!token) {
        logout();
    }

    const users = await fetch('http://localhost:5000/users', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'auth-token': token.split(' ')[1]
      }
    });

    const usersData = await users.json();

    document.getElementById('users-container').innerHTML = usersData.map((user) => {
        return(`<div class="user-card bg-white rounded-lg shadow-lg w-1/2 m-5 flex justify-between items-center p-5">
                        <h2 class='text-xl font-bold my-2'>${user.name}</h2>
                        <button onclick="deleteUser('${user._id}')" class='bg-red-500 text-white p-2 rounded-lg w-1/3 hover:bg-red-700 hover:scale-110 transition-all ease-out' type="button">Delete</button>
        </div>`)
    }).join('');

    removeLoading();
};

initialize();


const deleteUser = async (id) => {

    if (confirm("The user will be deleted") == true) {
        setLoading();
    
        const token = get_cookie('token');
        
        if (!token) {
            logout();
        }
        
        const res = await fetch('http://localhost:5000/deleteUser', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token.split(' ')[1]
            },
            body: JSON.stringify({id: id})
        });
        
        const result = await res.json();
        
        if (res.ok) {
            initialize();
        }else {
            alert('Something went wrong!');
            console.log(result);
        }
        
        removeLoading();
    } else {
        
    }
    
    
}