
# 🛡️ Security Lab & Secret Love Project ❤️

![Status](https://img.shields.io/badge/Status-Completed-success)
![Technology](https://img.shields.io/badge/Technology-Docker%20|%20NodeJS%20|%20MySQL-blue)

Dự án này là sự kết hợp giữa bài thực hành về **An toàn thông tin** (Giám sát hệ thống & Chống Brute Force) và một món quà bất ngờ dành cho người thương.

## 🌟 Tính năng chính

### 1. Hệ thống Bảo mật & Giám sát (Dashboard)
- **Quản lý đăng nhập:** Hệ thống ghi lại toàn bộ lịch sử đăng nhập bao gồm: Tên tài khoản, địa chỉ IP, thời gian và trạng thái (Thành công/Thất bại).
- **Phòng chống Brute Force:** Tự động phát hiện và chặn các IP thử sai mật khẩu quá 5 lần trong vòng 1 phút.
- **Theo dõi thời gian thực:** Dashboard cho phép Admin giám sát ai đang truy cập vào hệ thống.

### 2. Không gian bí mật (The Love Page)
- **Phân loại người dùng:** - Tài khoản `admin` -> Chuyển hướng về Dashboard quản trị.
  - Tài khoản người yêu -> Chuyển hướng đến trang `love.html` với giao diện tỏ tình lãng mạn.
- **Bắt IP "Nàng thơ":** Hệ thống sẽ ghi nhận và thông báo trên Dashboard ngay khi người ấy truy cập vào trang tỏ tình.

## 🛠️ Công nghệ sử dụng
- **Backend:** Node.js (Express)
- **Database:** MySQL 8.0
- **Containerization:** Docker & Docker Compose
- **Security:** Middleware chống tấn công Brute Force, CORS Policy.
- **Tunneling:** Ngrok (Để đưa trang web lên Internet).

## 🚀 Cách cài đặt và khởi chạy

1. **Yêu cầu:** Máy tính đã cài đặt Docker và Docker Compose.
2. **Khởi chạy hệ thống:**
   ```bash
   docker-compose up --build
   Mở cổng kết nối công khai (Ngrok):
