CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45),
    username VARCHAR(50),
    status ENUM('success', 'failed'),
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mật khẩu mặc định là 123456 
INSERT INTO users (username, password_hash) VALUES ('admin', '123456');