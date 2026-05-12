/**
 * GreyAtom Logistics Pvt. Ltd. - Delivery Exception Dashboard (v2.0)
 * Features: Auth, Theme Toggle, Persistent Storage
 */

// --- Constants & Config ---
const CONFIG = {
    STORAGE_EXCEPTIONS: 'greyatom_v2_exceptions',
    STORAGE_USERS: 'greyatom_v2_users',
    STORAGE_SESSION: 'greyatom_v2_session',
    STORAGE_THEME: 'greyatom_v2_theme'
};

// --- In-Memory State ---
let exceptions = [];
let currentUser = null;

// --- DOM Elements ---
const views = {
    auth: document.getElementById('auth-view'),
    dashboard: document.getElementById('dashboard-view')
};

const cards = {
    login: document.getElementById('login-card'),
    register: document.getElementById('register-card')
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    AuthManager.init();
    
    // View Switching
    document.getElementById('go-to-register').onclick = () => showCard('register');
    document.getElementById('go-to-login').onclick = () => showCard('login');
    
    // Forms
    document.getElementById('login-form').onsubmit = handleLogin;
    document.getElementById('register-form').onsubmit = handleRegister;
    document.getElementById('exception-form').onsubmit = handleAddException;
    document.getElementById('logout-btn').onclick = AuthManager.logout;
    
    // Filters
    document.getElementById('filter-type').onchange = applyFilters;
    document.getElementById('filter-status').onchange = applyFilters;
    
    // Table Actions (Event Delegation)
    document.getElementById('table-body').addEventListener('click', handleTableClick);
    
    // Theme
    document.getElementById('theme-toggle').onclick = ThemeManager.toggle;
});

// --- Theme Manager ---
const ThemeManager = {
    init() {
        const saved = localStorage.getItem(CONFIG.STORAGE_THEME) || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        this.updateIcon(saved);
    },
    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(CONFIG.STORAGE_THEME, next);
        ThemeManager.updateIcon(next);
    },
    updateIcon(theme) {
        const icon = document.getElementById('theme-icon');
        if (theme === 'dark') {
            icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        } else {
            icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
    }
};

// --- Auth Manager ---
const AuthManager = {
    init() {
        // Create default admin if no users exist
        if (!localStorage.getItem(CONFIG.STORAGE_USERS)) {
            localStorage.setItem(CONFIG.STORAGE_USERS, JSON.stringify([
                { name: 'Admin User', email: 'admin@greyatom.com', password: 'password', role: 'admin' }
            ]));
        }
        
        const session = localStorage.getItem(CONFIG.STORAGE_SESSION);
        if (session) {
            currentUser = JSON.parse(session);
            this.showDashboard();
        } else {
            this.showAuth();
        }
    },
    showAuth() {
        views.auth.classList.add('active');
        views.dashboard.classList.remove('active');
    },
    showDashboard() {
        views.auth.classList.remove('active');
        views.dashboard.classList.add('active');
        document.getElementById('display-name').textContent = currentUser.name;
        
        const roleLabel = currentUser.role === 'admin' ? 'Administrator' : 'Operations User';
        document.querySelector('.user-role').textContent = roleLabel;
        
        const dashboardTitle = currentUser.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard';
        document.getElementById('dashboard-title').textContent = dashboardTitle;
        
        loadData();
        renderTable();
        updateStats();
    },
    logout() {
        localStorage.removeItem(CONFIG.STORAGE_SESSION);
        location.reload();
    }
};

function showCard(cardName) {
    cards.login.style.display = cardName === 'login' ? 'block' : 'none';
    cards.register.style.display = cardName === 'register' ? 'block' : 'none';
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    
    const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_USERS) || '[]');
    const user = users.find(u => u.email === email && u.password === pass);
    
    if (user) {
        localStorage.setItem(CONFIG.STORAGE_SESSION, JSON.stringify(user));
        currentUser = user;
        AuthManager.showDashboard();
    } else {
        alert("Invalid email or password!");
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-password').value;
    const role = 'user'; // All new accounts default to user
    
    const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_USERS) || '[]');
    if (users.some(u => u.email === email)) {
        alert("User already exists!");
        return;
    }
    
    const newUser = { name, email, password: pass, role };
    users.push(newUser);
    localStorage.setItem(CONFIG.STORAGE_USERS, JSON.stringify(users));
    
    alert("Registration successful! Please login.");
    showCard('login');
}

// --- Data Logic ---
function loadData() {
    const saved = localStorage.getItem(CONFIG.STORAGE_EXCEPTIONS);
    if (saved) {
        exceptions = JSON.parse(saved);
    } else {
        // Initial Dummy Data
        exceptions = [
            { id: "DEL-88291", customerName: "Aaryan Sharma", issueType: "Address Not Found", priority: "High", status: "Open", notes: "Driver cannot find entrance." },
            { id: "DEL-44512", customerName: "Suresh Kumar", issueType: "Payment Issue", priority: "Low", status: "Resolved", notes: "Resolved." }
        ];
        saveData();
    }
}

function saveData() {
    localStorage.setItem(CONFIG.STORAGE_EXCEPTIONS, JSON.stringify(exceptions));
}

function renderTable() {
    const tableBody = document.getElementById('table-body');
    const emptyMsg = document.getElementById('empty-msg');
    tableBody.innerHTML = '';
    
    if (exceptions.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }
    
    emptyMsg.style.display = 'none';
    exceptions.forEach(ex => {
        const tr = document.createElement('tr');
        tr.id = `row-${ex.id}`;
        tr.dataset.type = ex.issueType;
        tr.dataset.status = ex.status;
        
        if (ex.status === 'Resolved') tr.classList.add('status-resolved');
        if (ex.priority === 'High') tr.classList.add('high-priority-row');

        const resolveBtnHTML = currentUser.role === 'admin'
            ? `<button class="btn resolve-btn" data-id="${ex.id}" ${ex.status === 'Resolved' ? 'disabled' : ''}>Resolve</button>`
            : '';

        const deleteBtnHTML = currentUser.role === 'admin' 
            ? `<button class="btn delete-btn" data-id="${ex.id}">Delete</button>` 
            : '';

        tr.innerHTML = `
            <td><strong>${ex.id}</strong></td>
            <td>${ex.customerName}</td>
            <td>${ex.issueType}</td>
            <td><span class="priority-${ex.priority.toLowerCase()}">${ex.priority}</span></td>
            <td><span class="status-badge">${ex.status}</span></td>
            <td>
                ${resolveBtnHTML}
                ${deleteBtnHTML}
            </td>
        `;
        tableBody.appendChild(tr);
    });
    applyFilters();
}

function handleAddException(e) {
    e.preventDefault();
    const id = document.getElementById('delivery-id').value.trim();
    if (exceptions.some(ex => ex.id === id)) {
        alert("Delivery ID already exists!");
        return;
    }
    
    const newEx = {
        id: id,
        customerName: document.getElementById('customer-name').value.trim(),
        issueType: document.getElementById('issue-type').value,
        priority: document.querySelector('input[name="priority"]:checked').value,
        status: "Open",
        notes: document.getElementById('notes').value.trim()
    };
    
    exceptions.unshift(newEx);
    saveData();
    renderTable();
    updateStats();
    e.target.reset();
}

function handleTableClick(e) {
    if (e.target.classList.contains('resolve-btn')) {
        handleResolveIssue(e.target.dataset.id);
    } else if (e.target.classList.contains('delete-btn')) {
        handleDeleteIssue(e.target.dataset.id);
    }
}

function handleResolveIssue(id) {
    const ex = exceptions.find(e => e.id === id);
    if (ex) {
        ex.status = 'Resolved';
        saveData();
        renderTable();
        updateStats();
    }
}

function handleDeleteIssue(id) {
    if (confirm(`Delete exception ${id}?`)) {
        exceptions = exceptions.filter(e => e.id !== id);
        saveData();
        renderTable();
        updateStats();
    }
}

function applyFilters() {
    const typeVal = document.getElementById('filter-type').value;
    const statusVal = document.getElementById('filter-status').value;
    const rows = document.querySelectorAll('#table-body tr');
    
    rows.forEach(row => {
        const matchesType = typeVal === 'all' || row.dataset.type === typeVal;
        const matchesStatus = statusVal === 'all' || row.dataset.status === statusVal;
        row.style.display = (matchesType && matchesStatus) ? '' : 'none';
    });
}

function updateStats() {
    document.getElementById('open-count').textContent = exceptions.filter(ex => ex.status === 'Open').length;
    document.getElementById('resolved-count').textContent = exceptions.filter(ex => ex.status === 'Resolved').length;
}
