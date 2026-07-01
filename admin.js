// ==========================================
// SEVA CONNECT — Admin Dashboard (Production)
// ==========================================

// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhl7wmLYoCJKcnibjx3AfIUeyj5nCp6QI",
  authDomain: "seva-connect-65af9.firebaseapp.com",
  projectId: "seva-connect-65af9",
  storageBucket: "seva-connect-65af9.firebasestorage.app",
  messagingSenderId: "243452092362",
  appId: "1:243452092362:web:088dae160b14bd7c1b7933",
  measurementId: "G-RKM71RV63B"
};

// 2. Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 3. Common UI Elements
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const adminBody = document.getElementById('adminBody');
const userEmailDisplay = document.getElementById('userEmail');
const loginBtn = document.querySelector('.btn-login');

// =============================================
// AUTH PAGE LOGIC (auth.html)
// =============================================
if (loginForm) {

  const loginSuccess = document.getElementById('loginSuccess');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const passwordInput = document.getElementById('password');
  const eyeShow = document.getElementById('eyeShow');
  const eyeHide = document.getElementById('eyeHide');
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');

  // Auto-redirect if already logged in
  auth.onAuthStateChanged((user) => {
    if (user) window.location.href = 'admin.html';
  });

  // Login Form Submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Verifying...';
    loginBtn.disabled = true;

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error.code, error.message);
      loginError.style.display = 'block';
      if (loginSuccess) loginSuccess.style.display = 'none';

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        loginError.textContent = 'Invalid email or password.';
      } else if (error.code === 'auth/operation-not-allowed') {
        loginError.textContent = 'Email/Password auth is not enabled in Firebase Console.';
      } else {
        loginError.textContent = 'Authentication error: ' + error.message;
      }

      loginBtn.textContent = originalText;
      loginBtn.disabled = false;

      loginForm.style.animation = 'none';
      setTimeout(() => loginForm.style.animation = 'shake 0.4s', 10);
    }
  });

  // Password Visibility Toggle
  if (togglePasswordBtn && passwordInput && eyeShow && eyeHide) {
    togglePasswordBtn.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeShow.style.display = 'none';
        eyeHide.style.display = 'block';
      } else {
        passwordInput.type = 'password';
        eyeShow.style.display = 'block';
        eyeHide.style.display = 'none';
      }
    });
  }

  // Forgot Password
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', async () => {
      const email = document.getElementById('email').value;
      if (!email) {
        loginError.textContent = 'Please enter your email address first.';
        loginError.style.display = 'block';
        if (loginSuccess) loginSuccess.style.display = 'none';
        return;
      }

      const originalText = forgotPasswordBtn.textContent;
      forgotPasswordBtn.textContent = 'Sending...';

      try {
        await auth.sendPasswordResetEmail(email);
        loginError.style.display = 'none';
        if (loginSuccess) {
          loginSuccess.textContent = 'Password reset link sent to ' + email + '. Check your inbox!';
          loginSuccess.style.display = 'block';
        }
      } catch (error) {
        console.error('Password reset error:', error);
        if (loginSuccess) loginSuccess.style.display = 'none';
        loginError.style.display = 'block';
        if (error.code === 'auth/user-not-found') {
          loginError.textContent = 'No account found with this email.';
        } else {
          loginError.textContent = 'Failed to send reset email: ' + error.message;
        }
      } finally {
        forgotPasswordBtn.textContent = originalText;
      }
    });
  }
}

// =============================================
// ADMIN DASHBOARD LOGIC (admin.html)
// =============================================
if (adminBody) {

  // Guard: check auth state
  auth.onAuthStateChanged((user) => {
    if (user) {
      adminBody.style.display = 'flex';
      if (userEmailDisplay) userEmailDisplay.textContent = user.email;

      // Populate settings
      const settingsEmail = document.getElementById('settingsEmail');
      const settingsCreated = document.getElementById('settingsCreated');
      const settingsLastLogin = document.getElementById('settingsLastLogin');
      if (settingsEmail) settingsEmail.textContent = user.email;
      if (settingsCreated && user.metadata.creationTime) {
        settingsCreated.textContent = new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      if (settingsLastLogin && user.metadata.lastSignInTime) {
        settingsLastLogin.textContent = new Date(user.metadata.lastSignInTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
      }

      // Load all data
      loadRequestsTable();
      loadEventsTable();
      loadVolunteersTable();
      loadBloodTable();
      loadStatCounts();
    } else {
      window.location.href = 'auth.html';
    }
  });

  // ========================================
  // SPA NAVIGATION
  // ========================================
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-view]');
  const views = document.querySelectorAll('.admin-view');
  const pageTitle = document.getElementById('pageTitle');

  const viewTitles = {
    'view-dashboard': 'Dashboard',
    'view-volunteers': 'Volunteers',
    'view-events': 'Events',
    'view-blood': 'Blood Requests',
    'view-settings': 'Settings'
  };

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.view;

      // Update sidebar active state
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Switch view
      views.forEach(v => v.classList.remove('active'));
      const targetView = document.getElementById(targetId);
      if (targetView) targetView.classList.add('active');

      // Update header title
      if (pageTitle) pageTitle.textContent = viewTitles[targetId] || 'Dashboard';
    });
  });

  // ========================================
  // LOGOUT
  // ========================================
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try { await auth.signOut(); }
      catch (error) { console.error("Error signing out:", error); }
    });
  }

  // ========================================
  // CHANGE PASSWORD (Settings)
  // ========================================
  const btnResetPassword = document.getElementById('btnResetPassword');
  const settingsAlert = document.getElementById('settingsAlert');
  if (btnResetPassword) {
    btnResetPassword.addEventListener('click', async () => {
      const user = auth.currentUser;
      if (!user) return;
      btnResetPassword.textContent = 'Sending...';
      btnResetPassword.disabled = true;
      try {
        await auth.sendPasswordResetEmail(user.email);
        settingsAlert.textContent = '✓ Password reset email sent to ' + user.email;
        settingsAlert.style.display = 'block';
        settingsAlert.style.background = '#ECFDF5';
        settingsAlert.style.color = '#059669';
        settingsAlert.style.border = '1px solid #A7F3D0';
      } catch (error) {
        settingsAlert.textContent = '✗ ' + error.message;
        settingsAlert.style.display = 'block';
        settingsAlert.style.background = '#FEF2F2';
        settingsAlert.style.color = '#DC2626';
        settingsAlert.style.border = '1px solid #FECACA';
      } finally {
        btnResetPassword.textContent = 'Change Password';
        btnResetPassword.disabled = false;
      }
    });
  }

  // ========================================
  // LOAD: REQUESTS TABLE (Dashboard)
  // ========================================
  async function loadRequestsTable() {
    const tbody = document.getElementById('requestsTableBody');
    if (!tbody) return;
    try {
      const snapshot = await db.collection('requests').orderBy('timestamp', 'desc').limit(10).get();
      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem; color:#94A3B8;">No requests yet. You are all caught up!</td></tr>';
        return;
      }
      tbody.innerHTML = '';
      snapshot.forEach(doc => {
        const d = doc.data();
        let bc = 'badge-active';
        if (d.status === 'Urgent') bc = 'badge-urgent';
        if (d.status === 'Resolved') bc = 'badge-muted';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${d.name || 'Unknown'}</strong></td>
          <td>${d.type || 'Inquiry'}</td>
          <td>${d.email || d.phone || d.location || '—'}</td>
          <td><span class="badge ${bc}">${d.status || 'Pending'}</span></td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem; color:#EF4444;">Error loading data. Is Firestore enabled?</td></tr>';
    }
  }

  // ========================================
  // LOAD: VOLUNTEERS TABLE
  // ========================================
  async function loadVolunteersTable() {
    const tbody = document.getElementById('volunteersTableBody');
    if (!tbody) return;
    try {
      const snapshot = await db.collection('volunteers').orderBy('timestamp', 'desc').limit(50).get();
      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem; color:#94A3B8;">No volunteers registered yet. Volunteer sign-ups from the website will appear here.</td></tr>';
        return;
      }
      tbody.innerHTML = '';
      snapshot.forEach(doc => {
        const d = doc.data();
        const joined = d.timestamp ? new Date(d.timestamp.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${d.name || 'Unknown'}</strong></td>
          <td>${d.email || d.phone || '—'}</td>
          <td>${d.skills || d.interest || '—'}</td>
          <td>${joined}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem; color:#EF4444;">Error loading volunteers.</td></tr>';
    }
  }

  // ========================================
  // LOAD: BLOOD REQUESTS TABLE
  // ========================================
  async function loadBloodTable() {
    const tbody = document.getElementById('bloodTableBody');
    if (!tbody) return;
    try {
      const snapshot = await db.collection('requests').where('type', '>=', '').orderBy('type').limit(50).get();
      const bloodDocs = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        if (d.type && d.type.toLowerCase().includes('blood')) bloodDocs.push(d);
      });
      if (bloodDocs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem; color:#94A3B8;">No blood donation requests at this time.</td></tr>';
        return;
      }
      tbody.innerHTML = '';
      bloodDocs.forEach(d => {
        let bc = 'badge-active';
        if (d.status === 'Urgent') bc = 'badge-urgent';
        if (d.status === 'Resolved') bc = 'badge-muted';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${d.name || 'Unknown'}</strong></td>
          <td>${d.type || '—'}</td>
          <td>${d.location || d.email || '—'}</td>
          <td><span class="badge ${bc}">${d.status || 'Pending'}</span></td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error fetching blood requests:", error);
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem; color:#EF4444;">Error loading blood requests.</td></tr>';
    }
  }

  // ========================================
  // LOAD: STAT COUNTS (Dashboard)
  // ========================================
  async function loadStatCounts() {
    try {
      const [volunteers, requests, events] = await Promise.all([
        db.collection('volunteers').get(),
        db.collection('requests').get(),
        db.collection('events').get()
      ]);
      const sv = document.getElementById('statVolunteers');
      const sb = document.getElementById('statBlood');
      const se = document.getElementById('statEvents');
      if (sv) sv.textContent = volunteers.size;
      if (sb) sb.textContent = requests.size;
      if (se) se.textContent = events.size;
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }

  // ========================================
  // EVENT MANAGEMENT (CRUD)
  // ========================================
  const btnCreateEvent = document.getElementById('btnCreateEvent');
  const eventModal = document.getElementById('eventModal');
  const modalClose = document.getElementById('modalClose');
  const modalCancel = document.getElementById('modalCancel');
  const eventForm = document.getElementById('eventForm');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubmitBtn = document.getElementById('modalSubmitBtn');
  const eventDocId = document.getElementById('eventDocId');

  // Open Modal (Create)
  if (btnCreateEvent) {
    btnCreateEvent.addEventListener('click', () => {
      eventForm.reset();
      eventDocId.value = '';
      modalTitle.textContent = 'Create New Event';
      modalSubmitBtn.textContent = 'Create Event';
      eventModal.classList.add('active');
    });
  }

  // Close Modal
  function closeModal() { eventModal.classList.remove('active'); }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalCancel) modalCancel.addEventListener('click', closeModal);
  if (eventModal) eventModal.addEventListener('click', (e) => { if (e.target === eventModal) closeModal(); });

  // Submit Event (Create / Update)
  if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      modalSubmitBtn.textContent = 'Saving...';
      modalSubmitBtn.disabled = true;

      const eventData = {
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value || '',
        location: document.getElementById('eventLocation').value,
        status: document.getElementById('eventStatus').value,
        description: document.getElementById('eventDesc').value || '',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      try {
        const docId = eventDocId.value;
        if (docId) {
          await db.collection('events').doc(docId).update(eventData);
        } else {
          eventData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          await db.collection('events').add(eventData);
        }
        closeModal();
        loadEventsTable();
        loadStatCounts();
      } catch (error) {
        console.error('Error saving event:', error);
        alert('Error saving event. Please check if Firestore is enabled in your Firebase Console.');
      } finally {
        modalSubmitBtn.textContent = eventDocId.value ? 'Update Event' : 'Create Event';
        modalSubmitBtn.disabled = false;
      }
    });
  }

  // Load Events Table
  async function loadEventsTable() {
    const tbody = document.getElementById('eventsTableBody');
    if (!tbody) return;
    try {
      const snapshot = await db.collection('events').orderBy('date', 'desc').get();
      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:#94A3B8;">No events yet. Click "+ Create New Event" to add your first event!</td></tr>';
        return;
      }
      tbody.innerHTML = '';
      snapshot.forEach(doc => {
        const d = doc.data();
        const dateFmt = d.date ? new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
        let bc = 'badge-active';
        let bs = '';
        if (d.status === 'Action Required') bc = 'badge-urgent';
        if (d.status === 'Completed') bc = 'badge-muted';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${d.title || 'Untitled'}</strong></td>
          <td>${dateFmt}</td>
          <td>${d.location || '—'}</td>
          <td>${d.time || '—'}</td>
          <td><span class="badge ${bc}">${d.status || 'Upcoming'}</span></td>
          <td>
            <a href="#" class="btn-edit edit-event" data-id="${doc.id}">Edit</a>
            <button class="btn-delete delete-event" data-id="${doc.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Edit handlers
      document.querySelectorAll('.edit-event').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          const docSnap = await db.collection('events').doc(btn.dataset.id).get();
          if (docSnap.exists) {
            const d = docSnap.data();
            document.getElementById('eventTitle').value = d.title || '';
            document.getElementById('eventDate').value = d.date || '';
            document.getElementById('eventTime').value = d.time || '';
            document.getElementById('eventLocation').value = d.location || '';
            document.getElementById('eventStatus').value = d.status || 'Upcoming';
            document.getElementById('eventDesc').value = d.description || '';
            eventDocId.value = btn.dataset.id;
            modalTitle.textContent = 'Edit Event';
            modalSubmitBtn.textContent = 'Update Event';
            eventModal.classList.add('active');
          }
        });
      });

      // Delete handlers
      document.querySelectorAll('.delete-event').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (confirm('Are you sure you want to delete this event?')) {
            try {
              await db.collection('events').doc(btn.dataset.id).delete();
              loadEventsTable();
              loadStatCounts();
            } catch (error) { console.error('Error deleting:', error); }
          }
        });
      });
    } catch (error) {
      console.error('Error loading events:', error);
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:#EF4444;">Error loading events. Is Firestore enabled?</td></tr>';
    }
  }
}

// Global CSS animation for login shake
const style = document.createElement('style');
style.textContent = `@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }`;
document.head.appendChild(style);
