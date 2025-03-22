document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById('login-btn');
    const userName = localStorage.getItem('userName');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true' && userName) {
        // ✅ ถ้าผู้ใช้ล็อกอินอยู่ ให้แสดงชื่อและรูปโปรไฟล์
        loginBtn.innerHTML = `
            <button onclick="goToProfile()" style="background-color: #004aad; color: white; padding: 10px 20px; border: none; border-radius: 20px; display: flex; align-items: center; cursor: pointer;">
                <img src="/font/image/profile.png" alt="Profile" style="width:30px; height:30px; border-radius:50%; margin-right:10px;">
                ${userName}
            </button>
        `;
    } else {
        // ✅ ถ้ายังไม่ได้ล็อกอิน แสดงปุ่ม "Login"
        loginBtn.innerHTML = `<button onclick="handleLoginLogout()">Login</button>`;
    }
});

function handleLoginLogout() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
        goToProfile(); // ✅ ถ้าล็อกอินอยู่แล้ว ให้ไปหน้าโปรไฟล์
    } else {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = '/font/login.html';
    }
}

// ✅ ฟังก์ชันไปหน้าโปรไฟล์
function goToProfile() {
    window.location.href = '/font/profile.html';
}
