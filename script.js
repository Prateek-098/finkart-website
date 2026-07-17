// Formatter for Indian Rupee currency
const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
});

// Auth Modal Logic
const modal = document.getElementById('auth-modal');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const appPopup = document.getElementById('app-popup');
let popupTimer = null;

function showPopup(message, type = 'error') {
    if (!appPopup) {
        return;
    }
    appPopup.innerText = message;
    appPopup.classList.remove('success', 'error', 'show');
    appPopup.classList.add(type === 'success' ? 'success' : 'error');
    appPopup.classList.add('show');

    if (popupTimer) {
        clearTimeout(popupTimer);
    }
    popupTimer = setTimeout(() => {
        appPopup.classList.remove('show');
    }, 2600);
}

function openModal(mode = 'login') {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    switchAuthMode(mode);
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function openForgotPasswordModal(prefillEmail = '') {
    if (!forgotPasswordModal) return;
    const forgotEmailInput = document.getElementById('forgot-email');
    if (forgotEmailInput) {
        forgotEmailInput.value = prefillEmail;
    }
    forgotPasswordModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeForgotPasswordModal() {
    if (!forgotPasswordModal) return;
    forgotPasswordModal.classList.remove('active');
    document.body.style.overflow = '';
}

function switchAuthMode(mode) {
    const isLogin = mode === 'login';
    
    // Manage tabs
    document.getElementById('tab-login').classList.toggle('active', isLogin);
    document.getElementById('tab-signup').classList.toggle('active', !isLogin);
    
    // Manage forms
    document.getElementById('form-login').classList.toggle('active', isLogin);
    document.getElementById('form-signup').classList.toggle('active', !isLogin);
}

// Close modal on click outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

if (forgotPasswordModal) {
    forgotPasswordModal.addEventListener('click', function(e) {
        if (e.target === forgotPasswordModal) {
            closeForgotPasswordModal();
        }
    });
}

// EMI Calculator Logic
const P_input = document.getElementById('principal');
const R_input = document.getElementById('interest');
const N_input = document.getElementById('tenure');

const P_display = document.getElementById('principal-display');
const R_display = document.getElementById('interest-display');
const N_display = document.getElementById('tenure-display');

const emi_result = document.getElementById('emi-result');
const interest_result = document.getElementById('interest-result');
const total_result = document.getElementById('total-result');

function calculateEMI() {
    const P = parseFloat(P_input.value);
    const R = parseFloat(R_input.value);
    const N = parseFloat(N_input.value);
    
    // Update labels
    P_display.innerText = currencyFormatter.format(P);
    R_display.innerText = R.toFixed(1) + '%';
    N_display.innerText = N + ' Yrs';
    
    // Mathematics
    // R is annual interest rate. Monthly interest r = R / 12 / 100
    const r = R / 12 / 100;
    // N is tenure in years. Months n = N * 12
    const n = N * 12;
    
    // EMI Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const factor = Math.pow(1 + r, n);
    let E = 0;
    
    if (r === 0) {
        E = P / n; // 0% interest case
    } else {
        E = P * r * factor / (factor - 1);
    }
    
    const totalAmount = E * n;
    const totalInterest = totalAmount - P;
    
    // Animate to new values
    animateValueUpdate(emi_result, currencyFormatter.format(E));
    animateValueUpdate(interest_result, currencyFormatter.format(totalInterest));
    animateValueUpdate(total_result, currencyFormatter.format(totalAmount));
}

function animateValueUpdate(element, newValue) {
    // Check if value actually changed to prevent excessive animation
    if (element.innerText !== newValue) {
        element.innerText = newValue;
        
        // Remove and re-add class to trigger animation
        element.classList.remove('animate-value');
        // Trigger reflow
        void element.offsetWidth;
        element.classList.add('animate-value');
    }
}

// Attach Event Listeners to Sliders
[P_input, R_input, N_input].forEach(input => {
    input.addEventListener('input', calculateEMI);
});

// Initial Calculation
calculateEMI();

// Expert Modal Logic
const expertModal = document.getElementById('expert-modal');

function openExpertModal() {
    expertModal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeExpertModal() {
    expertModal.classList.remove('active');
    document.body.style.overflow = '';
}

expertModal.addEventListener('click', function(e) {
    if (e.target === expertModal) {
        closeExpertModal();
    }
});

// Inquiry Modal Logic
const inquiryModal = document.getElementById('inquiry-modal');

function openInquiryModal(loanType = '') {
    const inquiryTypeField = document.getElementById('inquiry-type');
    inquiryTypeField.value = loanType || '';
    inquiryModal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeInquiryModal() {
    inquiryModal.classList.remove('active');
    document.body.style.overflow = '';
}

inquiryModal.addEventListener('click', function(e) {
    if (e.target === inquiryModal) {
        closeInquiryModal();
    }
});

// Open inquiry form from bank cards and let user choose loan type.
document.querySelectorAll('.rate-card').forEach((card) => {
    card.addEventListener('click', function() {
        const bankName = card.querySelector('.bank-name')?.innerText?.trim() || 'selected partner bank';
        const inquiryDescriptionField = document.getElementById('inquiry-desc');
        if (inquiryDescriptionField) {
            inquiryDescriptionField.value = 'Interested in offers from ' + bankName + '.';
        }
        openInquiryModal('');
    });
});

document.getElementById('form-inquiry').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerText = "Submitting...";
    btn.disabled = true;

    const inquiryName = document.getElementById('inquiry-name').value.trim();
    const inquiryPhone = document.getElementById('inquiry-phone').value.trim();
    const inquiryEmail = document.getElementById('inquiry-email').value.trim();
    const inquiryAge = document.getElementById('inquiry-age').value.trim();
    const inquiryType = document.getElementById('inquiry-type').value.trim();
    const inquiryDescription = document.getElementById('inquiry-desc').value.trim();

    // Use URLSearchParams so Google Apps Script e.parameter reads values reliably.
    const payload = new URLSearchParams();
    payload.append('Action_Type', 'Loan_Inquiry');
    payload.append('Name', inquiryName);
    payload.append('Phone', inquiryPhone);
    payload.append('Email', inquiryEmail);
    payload.append('Age', inquiryAge);
    payload.append('Loan_Type', inquiryType);
    payload.append('Description', inquiryDescription);
    payload.append('Timestamp', new Date().toLocaleString());

    // Backward-compatible aliases in case Apps Script expects different key names.
    payload.append('actionType', 'Loan_Inquiry');
    payload.append('loanType', inquiryType);

    fetch(LOAN_INQUIRY_SCRIPT_URL, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        mode: 'no-cors'
    })
        .then(() => {
		saveLeadToFirebase({
    		formType: "Website Inquiry",
    		name: inquiryName,
    		phone: inquiryPhone,
    		email: inquiryEmail,
    		age: inquiryAge,
    		loanType: inquiryType,
    		description: inquiryDescription,
    		createdAt: new Date().toISOString()
	});
            showPopup('Your ' + inquiryType + ' inquiry has been submitted! Our experts will contact you shortly.', 'success');
            closeInquiryModal();
            this.reset();
            btn.innerHTML = originalText;
            btn.disabled = false;
        })
        .catch(error => {
            console.error('Error!', error.message);
            showPopup('Network error submitting your inquiry. Please try again later.');
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
});

/* =========================================
   Google Sheets & Excel Data Export Logic
   ========================================= */

// NOTE: You must replace this URL with your custom Google Apps Script Web App URL!
// Follow the instructions in the chat to generate it.
const LOAN_INQUIRY_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyaF3qVcFh3O-VTntaMHhKsd6MQAXUSa9XAEJTzNtL0I24f1-od8oQiL9Iuw4zfczqs/exec";
// Use one verified endpoint for all form submissions to avoid mismatch between deployments.
const GOOGLE_SHEETS_SCRIPT_URL = LOAN_INQUIRY_SCRIPT_URL;

// Authentication State Manager
function checkAuthState() {
    const username = localStorage.getItem('finkart_user');
    const navSection = document.getElementById('nav-auth-section');
    
    if (username && navSection) {
        // User is logged in
        navSection.innerHTML = `
            <span style="font-weight: 700; font-family: var(--font-heading); color: var(--text-dark); margin-right: 15px;">Hi, ${username}! 👋</span>
            <button class="btn-outline" onclick="logoutUser()">Log Out</button>
        `;
    } else if (navSection) {
        // User is logged out
        navSection.innerHTML = `
            <button class="btn-outline" onclick="openModal('login')">Log In</button>
            <button class="btn-primary" onclick="openModal('signup')">Sign Up</button>
        `;
    }
}

function logoutUser() {
    localStorage.removeItem('finkart_user');
    checkAuthState();
}

// Check state on load
document.addEventListener('DOMContentLoaded', checkAuthState);
checkAuthState(); // Run immediately as well just in case

const USERS_STORAGE_KEY = 'finkart_users';

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function normalizePhone(phone) {
    return phone.trim();
}

function getStoredUsers() {
    try {
        const data = localStorage.getItem(USERS_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error parsing stored users:', error);
        return [];
    }
}

function saveStoredUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function sendAuthEvent(data) {
    const payload = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
        payload.append(key, value == null ? '' : String(value));
    });

    return fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        mode: 'no-cors'
    });
}

function isStrongPassword(password) {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

const forgotPasswordLink = document.getElementById('forgot-password-link');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        const loginEmailValue = document.getElementById('login-email').value.trim();
        openForgotPasswordModal(loginEmailValue);
    });
}

const forgotPasswordForm = document.getElementById('form-forgot-password');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = document.getElementById('forgot-email');
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showPopup('Please enter a valid email address.');
            return;
        }

        const users = getStoredUsers();
        const userExists = users.some(user => user.email === normalizeEmail(email));
        if (!userExists) {
            showPopup('No account found with this email. Please sign up first.');
            return;
        }

        const payload = new URLSearchParams();
        payload.append('Action_Type', 'Password_Reset_Request');
        payload.append('Name', 'N/A');
        payload.append('Email', email);
        payload.append('Phone', 'N/A');
        payload.append('Password', 'N/A');
        payload.append('Timestamp', new Date().toLocaleString());
        payload.append('actionType', 'Password_Reset_Request');

        fetch(GOOGLE_SHEETS_SCRIPT_URL, {
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            mode: 'no-cors'
        })
            .then(() => {
                closeForgotPasswordModal();
                this.reset();
                showPopup('Password reset request sent. Our team will contact you shortly on your registered email.', 'success');
            })
            .catch(error => {
                console.error('Error!', error.message);
                showPopup('Could not send reset request right now. Please try again later.');
            });
    });
}

document.getElementById('form-signup').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "Saving Account...";
    btn.disabled = true;

    const rawName = document.getElementById('signup-name').value.trim();
    const rawEmail = document.getElementById('signup-email').value;
    const rawPhone = document.getElementById('signup-phone').value;
    const rawPassword = document.getElementById('signup-password').value;
    const normalizedEmail = normalizeEmail(rawEmail);
    const normalizedPhone = normalizePhone(rawPhone);
    const users = getStoredUsers();

    if (!isStrongPassword(rawPassword)) {
        showPopup('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
        btn.innerText = originalText;
        btn.disabled = false;
        return;
    }

    const duplicateEmail = users.some(user => user.email === normalizedEmail);
    const duplicatePhone = users.some(user => user.phone === normalizedPhone);

    if (duplicateEmail || duplicatePhone) {
        showPopup('An account already exists with this email or phone number. Please log in.');
        btn.innerText = originalText;
        btn.disabled = false;
        return;
    }

    const payload = new URLSearchParams();
    payload.append('Action_Type', 'Signup');
    payload.append('Name', rawName);
    payload.append('Email', rawEmail);
    payload.append('Phone', rawPhone);
    payload.append('Password', rawPassword);
    payload.append('Timestamp', new Date().toLocaleString());
    payload.append('actionType', 'Signup');

    // Fix for Google Sheets CORS issue: use mode: 'no-cors'
    fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        mode: 'no-cors'
    })
        .then(() => {
            // Because of no-cors, we assume success here if the network request didn't outright fail
            
            // Extract first name for the navbar
            const firstName = rawName.split(' ')[0];
            users.push({
                name: rawName,
                email: normalizedEmail,
                phone: normalizedPhone,
                password: rawPassword
            });
            saveStoredUsers(users);
            localStorage.setItem('finkart_user', firstName);
            
            showPopup('Account created successfully!', 'success');
            closeModal();
            this.reset();
            btn.innerText = originalText;
            btn.disabled = false;
            checkAuthState(); // Update navbar
        })
        .catch(error => {
            console.error('Error!', error.message);
            showPopup('Network error communicating with Google Sheets. Please check your internet or URL.');
            btn.innerText = originalText;
            btn.disabled = false;
        });
});

document.getElementById('form-login').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "Logging in...";
    btn.disabled = true;

    const rawEmail = document.getElementById('login-email').value;
    const loginPassword = document.getElementById('login-password').value;
    const normalizedEmail = normalizeEmail(rawEmail);
    const users = getStoredUsers();
    const matchedUser = users.find(
        user => user.email === normalizedEmail && user.password === loginPassword
    );

    if (!matchedUser) {
        sendAuthEvent({
            Action_Type: 'Login_Attempt',
            actionType: 'Login_Attempt',
            Login_Status: 'Failed',
            Name: 'N/A',
            Email: rawEmail,
            Phone: 'N/A',
            Password: 'N/A',
            Device_Info: navigator.userAgent,
            Page_URL: window.location.href,
            Timestamp: new Date().toLocaleString()
        }).catch(error => console.error('Error!', error.message));

        showPopup('Invalid email or password. Please try again.');
        btn.innerText = originalText;
        btn.disabled = false;
        return;
    }

    sendAuthEvent({
        Action_Type: 'Login_Attempt',
        actionType: 'Login_Attempt',
        Login_Status: 'Success',
        Name: matchedUser.name || 'N/A',
        Email: rawEmail,
        Phone: matchedUser.phone || 'N/A',
        Password: 'N/A',
        Device_Info: navigator.userAgent,
        Page_URL: window.location.href,
        Timestamp: new Date().toLocaleString()
    })
        .then(() => {
            const firstName = matchedUser.name.split(' ')[0];
            localStorage.setItem('finkart_user', firstName);
            
            closeModal();
            this.reset();
            btn.innerText = originalText;
            btn.disabled = false;
            checkAuthState(); // Update navbar
        })
        .catch(error => {
            console.error('Error!', error.message);
            showPopup('Network error communicating with Google Sheets.');
            btn.innerText = originalText;
            btn.disabled = false;
        });
});

// Blog Consultation Callback Form Submission
const blogConsultationForm = document.getElementById('form-blog-consultation');
if (blogConsultationForm) {
    blogConsultationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerText = "Submitting...";
        btn.disabled = true;

        const name = document.getElementById('blog-name').value.trim();
        const phone = document.getElementById('blog-phone').value.trim();
        const email = document.getElementById('blog-email').value.trim();
        const loanType = document.getElementById('blog-loan-type').value.trim();

        const payload = new URLSearchParams();
        payload.append('Action_Type', 'Blog_Callback_Request');
        payload.append('Name', name);
        payload.append('Phone', phone);
        payload.append('Email', email);
        payload.append('Loan_Type', loanType);
        payload.append('Timestamp', new Date().toLocaleString());
        
        payload.append('actionType', 'Blog_Callback_Request'); // Compatibility alias

        fetch(LOAN_INQUIRY_SCRIPT_URL, {
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            mode: 'no-cors'
        })
            .then(() => {
		saveLeadToFirebase({
   		formType: "Blog Consultation",
   		name: name,
    		phone: phone,
    		email: email,
    		loanType: loanType,
    		createdAt: new Date().toISOString()
		});
                showPopup('Thank you! Your callback request has been submitted. Our expert will contact you shortly.', 'success');
                this.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            })
            .catch(error => {
                console.error('Error!', error.message);
                showPopup('Network error. Please check your internet connection and try again.');
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
    });
}
