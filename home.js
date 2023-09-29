let curUser = {};

const setLoading = () => {
    document.getElementById('loading').classList.remove('hidden');
};

const removeLoading = () => {
    document.getElementById('loading').classList.add('hidden');
};

const logout = () => {
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = 'http://localhost:5500/index.html';
};
document.getElementById('logout-btn').addEventListener('click', logout);

function get_cookie(cookie_name) {
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

    const user = await fetch('http://localhost:5000/user', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': token.split(' ')[1]
            }
          })
    
    const userData = await user.json();
    curUser = userData;

    if (userData.isAdmin) {
        document.getElementById('admin-btn').classList.remove('hidden');
    }

    const images = await fetch('http://localhost:5000/images', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: userData.name})
    });

    const imagesData = await images.json();

    document.getElementById('images-container').innerHTML = imagesData.map((image) => {
        return `
            <div class='z-1 my-10 mx-12 rounded-lg m-1 h-80 bg-white w-1/4 max-h-1000 flex flex-col text-center scale-110 hover:scale-125 transition-all ease-out p-2' key={image._id}>
                <img src=${image.img} class='object-cover rounded-lg h-full w-full' />
            </div>`
        });

    console.log(imagesData);

    removeLoading();
};
initialize();


document.getElementById('add-btn').addEventListener('click', () => {
    document.getElementById('add-ui').classList.remove('hidden');
});

document.getElementById('add-close').addEventListener('click', () => {
    document.getElementById('add-ui').classList.add('hidden');
});

const addImage = async () => {

    setLoading();

    const link = document.getElementById('add-inp').value;

    if (link === '') {
        alert('Please enter a link');
      }
      else{
  
        fetch('http://localhost:5000/create', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({img: link ,user: curUser.name})
        })
        .then(res => res.json())
        .then(data => {
          initialize();
        })
        .catch(err => {
          console.log(err);
        })
      }

      document.getElementById('add-ui').classList.add('hidden');

    removeLoading();

};

document.getElementById('add-submit').addEventListener('click', addImage);