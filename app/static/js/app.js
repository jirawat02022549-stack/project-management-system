const API = {
  async request(path, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(path, { ...options, headers });
    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(typeof body === 'string' ? body : (body.detail || 'Request failed'));
    }

    return body;
  }
};

const authView = document.getElementById('authView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const projectForm = document.getElementById('projectForm');
const taskForm = document.getElementById('taskForm');
const taskProjectId = document.getElementById('taskProjectId');

const tabs = document.querySelectorAll('.tab');

function showAuth() {
  authView.classList.remove('hidden');
  dashboardView.classList.add('hidden');
  logoutBtn.classList.add('hidden');
}

function showDashboard() {
  authView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
}

function isLoggedIn() {
  return Boolean(localStorage.getItem('token'));
}

function setActiveTab(tabName) {
  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  loginForm.classList.toggle('hidden', tabName !== 'login');
  registerForm.classList.toggle('hidden', tabName !== 'register');
}

function loadSummary() {
  API.request('/api/dashboard')
    .then((data) => {
      document.getElementById('totalProjects').textContent = data.total_projects;
      document.getElementById('totalTasks').textContent = data.total_tasks;
      document.getElementById('completedTasks').textContent = data.completed_tasks;
      document.getElementById('activeTasks').textContent = data.active_tasks;

      const projectsList = document.getElementById('projectsList');
      const tasksList = document.getElementById('tasksList');

      projectsList.innerHTML = (data.projects || []).map((project) => `
        <div class="list-item">
          <h4>${project.name}</h4>
          <div>
            <span class="badge">${project.status}</span>
            <span>${project.description || 'No description'}</span>
          </div>
        </div>
      `).join('') || '<p>No projects yet.</p>';

      tasksList.innerHTML = (data.tasks || []).map((task) => `
        <div class="list-item">
          <h4>${task.title}</h4>
          <div>
            <span class="badge">${task.status}</span>
            <span class="badge">${task.priority}</span>
            <span>${task.description || 'No description'}</span>
          </div>
        </div>
      `).join('') || '<p>No tasks yet.</p>';

      const projectOptions = (data.projects || []).map((project) => `
        <option value="${project.id}">${project.name}</option>
      `).join('');
      taskProjectId.innerHTML = projectOptions || '<option value="">No projects available</option>';
    })
    .catch((err) => {
      console.error(err);
      alert(err.message);
    });
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const result = await API.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('token', result.access_token);
    showDashboard();
    loadSummary();
  } catch (err) {
    alert(err.message);
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const full_name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    await API.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name, email, password }),
    });

    alert('Account created successfully. Please log in.');
    setActiveTab('login');
  } catch (err) {
    alert(err.message);
  }
});

projectForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await API.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        status: document.getElementById('projectStatus').value,
      }),
    });

    projectForm.reset();
    loadSummary();
  } catch (err) {
    alert(err.message);
  }
});

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const projectId = taskProjectId.value;

  try {
    await API.request(`/api/projects/project/${projectId}`, {
      method: 'POST',
      body: JSON.stringify({
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value,
        priority: document.getElementById('taskPriority').value,
        due_date: document.getElementById('taskDueDate').value || null,
      }),
    });

    taskForm.reset();
    loadSummary();
  } catch (err) {
    alert(err.message);
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  showAuth();
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
});

if (isLoggedIn()) {
  showDashboard();
  loadSummary();
} else {
  showAuth();
  setActiveTab('login');
}
