function addToCart(productId, name, price) {
    fetch('http://localhost:3300/add-to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, name, price }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        alert("✅ เพิ่มลงตะกร้าสำเร็จ!");
    })
    .catch(error => console.error('Error adding to cart:', error));
}

function goToProduct2(image, name, price, menuId) {
    localStorage.setItem('cartImage', image);
    localStorage.setItem('cartProductName', name);
    localStorage.setItem('cartProductPrice', price);
    localStorage.setItem('cartMenuId', menuId); // ต้องบันทึก menu_id ด้วย
    window.location.href = 'product2.html';
}


