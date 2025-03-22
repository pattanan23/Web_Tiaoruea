document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    fetch('http://localhost:3300/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            localStorage.setItem('userId', data.user.customer_id);
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('isLoggedIn', 'true');

            alert('✅ เข้าสู่ระบบสำเร็จ!');

            // 🔹 ตรวจสอบว่าผู้ใช้เป็นพนักงานหรือไม่
            const employeeAccounts = [
                { email: "employee@gmail.com", password: "123456em" }
            ];

            const isEmployee = employeeAccounts.some(emp => emp.email === email && emp.password === password);

            if (isEmployee) {
                window.location.href = "/font/home_employ.html"; // 🔹 พนักงานไปหน้าจัดการ
            } else {
                window.location.href = "/font/home.html"; // 🔹 ลูกค้าไปหน้า home
            }
        } else {
            alert("❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง!");
        }
    })
    .catch(error => console.error('Error:', error));
});
