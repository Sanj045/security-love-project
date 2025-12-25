# Bước 1: Chọn hệ điều hành nền (Image) có sẵn Node.js phiên bản 20
FROM node:20

# Bước 2: Tạo một thư mục làm việc bên trong máy chủ ảo này
WORKDIR /usr/src/app

# Bước 3: Copy các file quản lý thư viện vào trước
# Việc này giúp Docker cài đặt thư viện nhanh hơn ở các lần sau (Caching)
COPY package*.json ./

# Bước 4: Chạy lệnh cài đặt các thư viện (express, mysql2, bcrypt)
RUN npm install

# Bước 5: Copy toàn bộ mã nguồn từ máy tính của bạn vào trong máy chủ ảo
COPY . .

# Bước 6: Thông báo cho Docker rằng ứng dụng sẽ chạy ở cổng 3000
EXPOSE 3000

# Bước 7: Lệnh cuối cùng để khởi động server khi container bắt đầu chạy
CMD ["node", "server.js"]