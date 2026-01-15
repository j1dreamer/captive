document.getElementById('connectBtn').addEventListener('click', function() {
    // 1. Lấy cái nút và đổi giao diện sang "Đang xoay..."
    const btn = this;
    const originalText = btn.innerHTML; // Lưu lại chữ cũ lỡ lỗi thì hiện lại
    
    // Đổi nút thành biểu tượng xoay (Spinner)
    btn.innerHTML = 'Connecting... <i class="fa fa-spinner fa-spin"></i>';
    btn.disabled = true; // Khóa nút không cho bấm liên tục

    // 2. Chuẩn bị dữ liệu "Text ẩn" để đẩy đi
    const formData = new FormData();
    formData.append("Aruba.InstantOn.Acknowledge", "1");

    // ĐỊA CHỈ CONTROLLER ARUBA (QUAN TRỌNG)
    // Khi chạy thật, Aruba thường chặn và tự hứng gói tin port 80/443
    // Hoặc bạn phải điền IP Gateway của mạng Wifi đó, ví dụ: http://192.168.1.1:8081/cgi-bin/login
    // Ở đây mình để link mẫu, bạn cần thay bằng link action thật của thiết bị nếu biết.
    const targetUrl = "http://192.168.1.1/auth"; 

    // 3. Thực hiện đẩy text ngầm (Silent Push)
    // Dùng setTimeout 1.5s để người dùng kịp nhìn thấy hiệu ứng xoay cho đẹp
    setTimeout(() => {
        fetch(targetUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // CỰC QUAN TRỌNG: Giúp đẩy đi mà không cần Server cho phép (bắn mù)
        })
        .then(response => {
            // TRƯỜNG HỢP 1: Đẩy đi thành công (Mạng thông hoặc thiết bị đã nhận)
            console.log("Đã bắn text Aruba.InstantOn.Acknowledge thành công!");
            window.location.href = 'success.html'; // Chuyển qua trang Success
        })
        .catch(error => {
            // TRƯỜNG HỢP 2: Lỗi mạng hoặc không tìm thấy thiết bị
            console.error("Lỗi đẩy text:", error);
            
            // Tùy bạn: Muốn cho qua luôn hay bắt thử lại?
            // Nếu muốn strict:
            // window.location.href = 'error.html';
            
            // Nếu muốn giả lập demo cho sếp xem thì mở comment dòng dưới ra:
             window.location.href = 'success.html'; 
        })
        .finally(() => {
            // Khôi phục nút (nếu không chuyển trang)
            // btn.innerHTML = originalText;
            // btn.disabled = false;
        });
    }, 1500); // Delay 1.5 giây giả lập độ trễ mạng
});