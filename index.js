
const getStatus = async () =>{

    const status = document.getElementById('server-status');

    await fetch('http://localhost:5000/')
        .then(res => res.json())
        .then(data => {
            if (data.backend === true) {

                const serverStatus = document.createElement('p');
                serverStatus.innerHTML = '<i class="fa-solid fa-circle text-green-400"></i>&nbsp; Backend Online';
                serverStatus.classList.add('bg-white', 'text-gray-500', 'rounded-lg', 'p-2', 'm-1', 'animate-slideIn', 'opacity-0');
                status.appendChild(serverStatus);
            }
            else
            {

                const serverStatus = document.createElement('p');
                serverStatus.innerHTML = '<i class="fa-solid fa-circle text-red-400"></i>&nbsp; Backend Offline';
                serverStatus.classList.add('bg-white', 'text-gray-500', 'rounded-lg', 'p-2', 'm-1', 'animate-slideIn', 'opacity-0');
                status.appendChild(serverStatus);
            }


            if (data.db === true) {

                const dbStatus = document.createElement('p');
                dbStatus.innerHTML = '<i class="fa-solid fa-circle text-green-400"></i>&nbsp; Database Online';
                dbStatus.classList.add('bg-white', 'text-gray-500', 'rounded-lg', 'p-2', 'm-1', 'animate-slideIn', 'opacity-0');
                status.appendChild(dbStatus);
            }
            else
            {

                const dbStatus = document.createElement('p');
                dbStatus.innerHTML = '<i class="fa-solid fa-circle text-red-400"></i>&nbsp; Database Offline';
                dbStatus.classList.add('bg-white', 'text-gray-500', 'rounded-lg', 'p-2', 'm-1', 'animate-slideIn', 'opacity-0');
                status.appendChild(dbStatus);
            }
        })
        .catch(err => {
            console.log(err);

            const serverStatus = document.createElement('p');
            serverStatus.innerHTML = '<i class="fa-solid fa-circle text-red-400"></i>&nbsp; Backend Offline';
            serverStatus.classList.add('bg-white', 'text-gray-500', 'rounded-lg', 'p-2', 'm-1', 'animate-slideIn', 'opacity-0');
            status.appendChild(serverStatus);

            const dbStatus = document.createElement('p');
            dbStatus.innerHTML = '<i class="fa-solid fa-circle text-red-400"></i>&nbsp; Database Offline';
            dbStatus.classList.add('bg-white', 'text-gray-500', 'rounded-lg', 'p-2', 'm-1', 'animate-slideIn', 'opacity-0');
            status.appendChild(dbStatus);

        })
};

getStatus();

const get_cookie = (cookie_name) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + cookie_name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

const token = get_cookie('token');


if (token) {
    window.location.href = 'http://localhost:5500/home.html';
}

const setLoading = () => {
    document.getElementById('loading').classList.remove('hidden');
};

const removeLoading = () => {
    document.getElementById('loading').classList.add('hidden');
};



const login = async () => {

    setLoading();

    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log(email, password);

        const res = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email: email, password: password})
                });

        if (res.status !== 200) {
            alert('Invalid Credentials');
        }
        else{
            const data = await res.json();

            document.cookie = `token=${data.token}; path=/; max-age=86400`;

            window.location.href = 'http://localhost:5500/home.html';
        }
    } catch (error) {
        console.log(error);
    }

    removeLoading();

}

const signup = async () => {

    setLoading();

    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        const res = await fetch('http://localhost:5000/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({name: name, email: email, password: password})
                });
    
        if (res.status !== 201) {
            alert('Invalid Credentials');
        }
        else{
            const data = await res.json();
    
            document.cookie = `token=${data.token}; path=/; max-age=86400`;
    
            window.location.href = 'http://localhost:5500/home.html';
        }
    } catch (error) {
        console.log(error);
    }

   
    removeLoading();
}

const submitHadnler = async (event) => {
    event.preventDefault();
    const logIntitle = document.getElementById('login-title');
    const signUptitle = document.getElementById('signup-title');

    if (logIntitle) {
        await login();
    }
    else if (signUptitle) {
        await signup();
    }

};
document.getElementById('auth-form').addEventListener('submit', submitHadnler);

const toggleForm = () => {
    const logIntitle = document.getElementById('login-title');
    const signUptitle = document.getElementById('signup-title');

    console.log(logIntitle, signUptitle);

    if (logIntitle) {

        logIntitle.id = 'signup-title';  
        logIntitle.innerText = 'Sign Up';

        document.getElementById('form-btn').innerText = 'Signup';

        const formToggleBtn = document.getElementById('form-toggle-btn');
        formToggleBtn.textContent = 'Login';

        document.getElementById('form-toggle').innerHTML = 'Already have an account? ' + formToggleBtn.outerHTML;
        document.getElementById('form-toggle-btn').addEventListener('click', toggleForm);

        const inputs = document.getElementById('form-inputs');
        const nameInput = document.createElement('input');
        nameInput.id = 'name';
        nameInput.type = 'text';
        nameInput.placeholder = 'Name';
        nameInput.classList.add('border-2', 'border-gray-300', 'rounded-lg', 'w-full', 'my-4', 'p-3');
        nameInput.required = true;

        inputs.insertBefore(nameInput, inputs.childNodes[0]);
    }
    else if (signUptitle) {
            
            signUptitle.id = 'login-title';
            signUptitle.innerText = 'Login';
    
            document.getElementById('form-btn').innerText = 'Login';
    
            const formToggleBtn = document.getElementById('form-toggle-btn');
            formToggleBtn.innerText = 'Sign Up';
    
            document.getElementById('form-toggle').innerHTML = 'Don\'t have an account? ' + formToggleBtn.outerHTML;
            document.getElementById('form-toggle-btn').addEventListener('click', toggleForm);
    
            const inputs = document.getElementById('form-inputs');
            inputs.removeChild(inputs.childNodes[0]);
    }
}
document.getElementById('form-toggle-btn').addEventListener('click', toggleForm);