fetch('http://localhost:3300/menu')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const menuList = document.getElementById('menu-list');
        menuList.innerHTML = ''; // ล้างรายการเก่าก่อน

        data.forEach(item => {
            const menuItem = document.createElement('li');
            menuItem.innerHTML = `
                <h3>${item.menu_name}</h3>
                <p>ราคา: ${item.price} บาท</p>
                <button onclick="goToProduct2('${item.image}', '${item.menu_name}', ${item.price})">เลือก</button>
            `;
            menuList.appendChild(menuItem);
        });
    })
    .catch(error => console.error('Error fetching menu:', error));
