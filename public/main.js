let currentMode = 'login';
let currentUser = null;

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-rose-500';
  const icon = type === 'success' 
    ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
    : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';

  toast.className = `${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in-right transform transition-all duration-300 font-bold text-sm tracking-wide`;
  toast.innerHTML = `
    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full">${icon}</div>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-[100%]');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function showAuthMsg(message, type = 'error') {
  const msgBox = document.getElementById('auth-msg');
  msgBox.innerText = message;
  msgBox.className = `mb-6 p-4 rounded-2xl text-sm font-bold transition-all ${
    type === 'error' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
  }`;
  msgBox.classList.remove('hidden');
}

function hideAuthMsg() {
  const msgBox = document.getElementById('auth-msg');
  if (msgBox) msgBox.classList.add('hidden');
}

function showAuth(mode) {
  currentMode = mode;
  hideAuthMsg();
  document.getElementById('modal-title').innerText = mode === 'login' ? 'Welcome Back' : 'Create Account';
  document.getElementById('auth-btn-text').innerText = mode === 'login' ? 'Login' : 'Register';
  document.getElementById('auth-toggle-text').innerHTML = mode === 'login' 
    ? `Don't have an account? <a href="#" onclick="toggleAuth(event)" class="text-emerald-400 hover:text-emerald-300 hover:underline font-bold">Register here</a>`
    : `Already have an account? <a href="#" onclick="toggleAuth(event)" class="text-emerald-400 hover:text-emerald-300 hover:underline font-bold">Login here</a>`;
  document.getElementById('auth-modal').classList.remove('hidden');
}

function hideAuth() {
  document.getElementById('auth-modal').classList.add('hidden');
  document.getElementById('auth-form').reset();
  hideAuthMsg();
}

function toggleAuth(e) {
  e.preventDefault();
  showAuth(currentMode === 'login' ? 'register' : 'login');
}

async function handleAuth(e) {
  e.preventDefault();
  hideAuthMsg();
  const username = document.getElementById('auth-username').value;
  const password = document.getElementById('auth-password').value;
  const endpoint = currentMode === 'login' ? '/login' : '/register';
  
  // Loading state
  const btn = document.getElementById('auth-submit');
  const spinner = document.getElementById('auth-spinner');
  const btnText = document.getElementById('auth-btn-text');
  btn.disabled = true;
  btnText.classList.add('opacity-50');
  spinner.classList.remove('hidden');
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.error) {
      showAuthMsg(data.error);
    } else {
      if (currentMode === 'login') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        checkLogin();
        hideAuth();
        showToast(`Welcome back, ${username}!`);
      } else {
        showAuthMsg('Account created! Logging you in...', 'success');
        // Auto login after register
        const loginRes = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const loginData = await loginRes.json();
        if (loginData.token) {
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('username', username);
          setTimeout(() => {
            checkLogin();
            hideAuth();
            showToast('Registration & Login successful!');
          }, 1000);
        }
      }
    }
  } catch (err) {
    showAuthMsg('Connection error. Is the server running?');
    console.error(err);
  } finally {
    btn.disabled = false;
    btnText.classList.remove('opacity-50');
    spinner.classList.add('hidden');
  }
}

function checkLogin() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  if (token && username) {
    currentUser = { username, token };
    document.getElementById('username-display').innerText = username;
    document.getElementById('user-avatar').innerText = username[0].toUpperCase();
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('auth-buttons').classList.add('hidden');
  } else {
    currentUser = null;
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('auth-buttons').classList.remove('hidden');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  checkLogin();
  showToast('Logged out successfully', 'success');
}

async function run() {
  checkLogin();
  const tbl = document.getElementById("tbl");
  tbl.innerHTML = "";
  try {
    const res = await fetch("/seats");
    const resarray = await res.json();
    const j = resarray.sort((a, b) => a.id - b.id);
    let tr;
    for (let i = 0; i < j.length; i++) {
      if (i % 8 === 0) {
        tr = document.createElement("tr");
        tbl.appendChild(tr);
      }

      const td = document.createElement("td");
      const baseClasses = "w-24 h-24 rounded-[1.5rem] text-center align-middle text-2xl font-bold transition-all duration-500 select-none relative group";

      if (j[i].isbooked) {
        td.className = `${baseClasses} bg-slate-800 text-slate-600 border border-slate-700/50 cursor-not-allowed opacity-50`;
        td.innerHTML = `
                <span class="relative z-10">${j[i].id}</span>
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-5 py-3 bg-slate-900 border border-slate-700 text-xs text-slate-400 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 pointer-events-none font-bold scale-90 group-hover:scale-100 uppercase tracking-widest border-t-rose-500/50">
                  Booked by: <span class="text-white ml-2">${j[i].name}</span>
                  <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[6px] border-transparent border-t-slate-700"></div>
                </div>
            `;
      } else {
        td.className = `${baseClasses} bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-110 hover:-translate-y-2 hover:shadow-emerald-500/40 active:scale-90 border-2 border-emerald-400/30`;
        td.innerHTML = `<span class="relative z-10">${j[i].id}</span>`;
      }

      td.addEventListener("click", async function (e) {
        if (td.classList.contains("cursor-not-allowed")) return;

        if (!currentUser) {
          showToast('Please login to book a seat', 'error');
          showAuth('login');
          return;
        }

        try {
          const id = j[i].id;
          const res = await fetch(`/${id}/token_user`, { 
            method: "PUT",
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
          });
          const data = await res.json();

          if (data.error) {
            showToast(data.error, 'error');
            run();
          } else {
            showToast(`Seat ${id} booked! Enjoy the show!`);
            run();
          }
        } catch (ex) {
          showToast("Connection failed!", 'error');
        }
      });
      tr.appendChild(td);
    }
  } catch (err) {
    console.error(err);
  }
}

// Initial run
run();
