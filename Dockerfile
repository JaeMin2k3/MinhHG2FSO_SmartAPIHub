# Dùng môi trường Node.js (bản 18 nhỏ gọn)
FROM node:22-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy các file cấu hình thư viện vào trước
COPY package*.json ./

# Cài đặt các thư viện (node_modules)
RUN npm install

# Copy toàn bộ code còn lại vào container
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Lệnh khởi chạy app (Đảm bảo trong package.json của bạn có lệnh "start")
# Nếu bạn dùng lệnh khác như "npm run dev", hãy sửa lại ở đây
CMD ["npm", "start"]