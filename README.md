Sinh Viên : Vũ Duy Cương, Trần Tuấn Phong
-Cấu trúc dự án
<img width="682" height="631" alt="Ảnh chụp màn hình 2025-11-20 174136" src="https://github.com/user-attachments/assets/9ceb1f58-683c-40b7-9009-27e35c106cf7" />
<img width="634" height="752" alt="Ảnh chụp màn hình 2025-11-20 174151" src="https://github.com/user-attachments/assets/36a6ed1a-2db7-4515-a233-bb4a6b46e614" />

-Các bước cài đặt & Demo
Chúng ta đã thực hiện theo quy trình 4 bước:

Bước 1: Giả lập CDN (Môi trường)

Sử dụng Backend (Node.js) để làm máy chủ chứa file tĩnh.

Tạo file fastfood-backend/public/cdn-script.js chứa mã nguồn sạch (console.log).
<img width="434" height="88" alt="Ảnh chụp màn hình 2025-11-20 175423" src="https://github.com/user-attachments/assets/52fc10c3-a921-4eee-811f-a63f8e063587" />

Cấu hình app.use(express.static...) và CORS để Frontend có thể tải file này về.

Bước 2: Tạo "Chữ ký số" (Mã Hash)

Sử dụng thuật toán SHA-384 để băm nội dung file sạch cdn-script.js.

Công cụ sử dụng: OpenSSL hoặc srihash.org.


Kết quả: Một chuỗi ký tự mã hóa (ví dụ: sha384-AbCd...).

Bước 3: Triển khai phòng thủ (Frontend)

Nhúng file script vào fastfood-frontend/index.html.
<img width="867" height="162" alt="Ảnh chụp màn hình 2025-11-20 175529" src="https://github.com/user-attachments/assets/93d99843-5662-4078-8bd0-7f76f3c2bb4f" />

Thêm 2 thuộc tính quan trọng vào thẻ <script>:

integrity="sha384-[MÃ_HASH_VỪA_TẠO]": Để trình duyệt đối chiếu.

crossorigin="anonymous": Để cho phép trình duyệt đọc nội dung file từ domain khác (Backend) nhằm tính toán hash.

Bước 4: Kiểm thử tấn công & Kết quả

Tấn công: Sửa nội dung file trên Backend thành mã độc (alert("HACKED")).

Kết quả:

Trình duyệt tải file về và tự tính toán lại Hash.

Thấy Hash mới (của file độc) KHÁC Hash trong thuộc tính integrity.

Hành động: Trình duyệt CHẶN ĐỨNG file script, không cho chạy.

Bằng chứng: Console báo lỗi đỏ Failed to find a valid digest.... Website an toàn.
<img width="648" height="165" alt="Ảnh chụp màn hình 2025-11-20 175734" src="https://github.com/user-attachments/assets/3c517cab-6be7-4a92-a52f-9ed074bb5a86" />

