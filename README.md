# Backend MiniProject API

Du an Backend cung cap cac API phuc vu cho he thong, duoc xay dung bang Node.js (TypeScript) va co so du lieu PostgreSQL. Du an duoc tich hop san cau hinh Docker de de dang trien khai va Swagger de cung cap tai lieu API truc quan.

## Cong nghe su dung

- Runtime: Node.js (v22)
- Framework: Express.js
- Ngon ngu: TypeScript
- Co so du lieu: PostgreSQL (v15)
- Query Builder: Knex.js (pg)
- Tai lieu API: Swagger UI
- Trien khai: Docker va Docker Compose

## Yeu cau moi truong

De khoi chay du an nay tren may tinh, vui long dam bao ban da cai dat:
1. Node.js (Phien ban >= 18, khuyen nghi su dung v22)
2. Docker Desktop

## Cai dat bien moi truong

Tao mot file .env o thu muc goc cua du an (ngang hang voi file package.json) va dien cac thong tin sau:

DB_CLIENT=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=postgres

Luu y quan trong: 
Doi DB_HOST=db neu ban muon dong goi va chay toan bo he thong bang Docker (theo huong dan o Cach 2 ben duoi).

## Huong dan khoi chay du an

Ban co the khoi chay du an theo 2 cach phu thuoc vao muc dich su dung.

### Cach 1: Chay moi truong Development (Khuyen dung khi viet code)

Cach nay giup ban sua code den dau, server se tu dong cap nhat den do (thong qua nodemon) ma khong can phai build lai Docker.

1. Khoi dong rieng co so du lieu bang Docker:
docker compose up -d db

2. Cai dat cac thu vien can thiet:
npm install

3. Khoi chay server Node.js:
npm start

### Cach 2: Chay Full Docker (Dong goi hoan chinh)

Cach nay se dong ho toan bo code Node.js va Database vao ben trong moi truong mang noi bo cua Docker. Thich hop de trien khai len may chu.

1. Build image va khoi chay toan bo he thong:
docker compose up -d --build

2. Kiem tra log de dam bao server da chay khong co loi:
docker compose logs -f app

3. Lenh dung toan bo he thong:
docker compose down

## Tai lieu API (Swagger)

Sau khi server khoi chay thanh cong, ban co the xem tai lieu chi tiet va kiem thu (test) truc tiep cac API thong qua giao dien UI cua Swagger tai duong dan:
http://localhost:3000/api-docs

## Danh sach cac API chinh

1. Nhom API xac thuc (Khong yeu cau Token)
- POST /auth/SignUp: Dang ky tai khoan moi (Quyen mac dinh la customer).
- POST /auth/login: Dang nhap va nhan ma xac thuc (JWT Token).

2. Nhom API nghiep vu (Yeu cau Bearer Token)
- GET /api/products: Lay danh sach san pham (Ho tro tim kiem theo query 'q').
- POST /api/products: Them san pham moi (Yeu cau quyen Admin).
- PATCH /api/products/{id}: Cap nhat mot phan thong tin san pham (gia, so luong).
- DELETE /api/products/{id}: Xoa vinh vien san pham.
- GET /api/orders: Lay danh sach don hang (Ho tro query '_expand=users').
- GET /api/users: Lay danh sach nguoi dung (Ho tro query '_embed=orders').

## Huong dan kiem thu (Test) API bang Swagger

1. Truy cap vao http://localhost:3000/api-docs.
2. Tim mo API POST /auth/login, nhap email va password de dang nhap.
3. Copy doan Token ma server tra ve (khong copy dau ngoac kep).
4. Cuon len dau trang, bam vao nut Authorize.
5. Dan doan Token vua copy vao o trong va bam xac nhan.
6. Bay gio ban da co quyen de mo va kiem thu tat ca cac API con lai cua he thong.
