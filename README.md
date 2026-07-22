# First FCAJ Project
Dự án được thực hiện bởi nhóm FuhoAWS
Các thành viên bao gồm:
Nguyễn Quốc Vượng  
Cao Bảo Hoàng Nam  
Phạm Tạ Mạnh Lân  
Trần Mỹ Tâm  
Nguyễn Phương Thùy  

**Bảng phân công:**

| Tên | Công việc | Thực hiện |
|---|---|---|
| Cao Bảo Hoàng Nam | AI Prompt, AI Handle, APIKEY, Viết Blog | Đã hoàn thành |
| Nguyễn Quốc Vượng | Backend, PDF, Node.js, AWS, Viết blog, chỉnh sửa lại các lỗi | Đã hoàn thành |
| Phạm Tạ Mạnh Lân | UI, Logo, Hình ảnh, Handle Frontend | Đã hoàn thành |
| Trần Mỹ Tâm | Database, Testing, AI Model Testing | Đã hoàn thành |
| Nguyễn Phương Thùy | Viết blog | Đã hoàn thành |

# LunaGenZ

LunaGenZ là một ứng dụng Web Full-stack sử dụng mô hình Event-Driven Serverless Architecture. 
Mang đến các trải nghiệm tâm linh và khám phá bản thân hiện đại dành cho thế hệ Gen Z. 
Dự án cung cấp các tính năng giải mã Thần số học (Numerology) và bói bài Lenormand, 
kết hợp với sức mạnh của trí tuệ nhân tạo (AI) để đưa ra các phân tích chi tiết và sâu sắc.

---
## Lý do chọn đề tài:

Do có mong muốn cá nhân và cũng như được truyền cảm hứng từ anh Trần Hữu Nghĩa qua buổi meeting ngày 30/05/2026,
tại tòa Bitexco, tầng 26. Qua buổi meeting, sau khi nghe anh ấy giới thiệu và trình bày về web Tử Vi Đại Việt thì
nhóm đã quyết định làm một web tương tự nhưng với phiên bản mang dấu ấn riêng của nhóm. Tuy là không làm về tử vi,
nhưng cũng làm về phần tâm linh, giải mã bản thân và khám phá bản thân. Cũng như là có thể giúp cho các bạn trẻ,
những người có mong muốn tìm hiểu về bản thân mình, về cuộc sống của mình một cách ý nghĩa và sâu sắc hơn. Cũng 
như với những người có đam mê về bộ môn Thần số học và Lenormand như tụi em thì em cũng mong đây là 1 điều giúp ích
cho họ để có thể tham khảo và áp dụng vào cuộc sống của mình.

##  Kiến trúc & Công nghệ

![Sơ đồ kiến trúc LunaGenZ](public/images/architecture.png)

Dự án được chia thành hai phần chính: **Frontend (fe)** và **Backend (be)**.

### Frontend (Thư mục `fe/`)
Giao diện người dùng được xây dựng hiện đại, tối ưu SEO và trải nghiệm mượt mà với các hiệu ứng chuyển động.
- **Framework:** Next.js 14 (App Router)
- **Thư viện UI:** React 18, Tailwind CSS, Framer Motion, Lucide React
- **Quản lý trạng thái:** Zustand
- **Ngôn ngữ:** TypeScript

### Backend (Thư mục `be/`)
Hệ thống API mạnh mẽ, có khả năng mở rộng cao, được triển khai dưới dạng serverless.
- **Framework:** Serverless Framework, Express.js
- **Môi trường chạy:** Node.js 20.x, AWS Lambda
- **Cơ sở dữ liệu & Lưu trữ:** AWS DynamoDB, AWS S3
- **Dịch vụ Email:** AWS SES, Nodemailer
- **AI Integrations:** Tích hợp đa dạng các mô hình ngôn ngữ lớn (Gemini, OpenRouter, Cohere, Cerebras, GitHub Models) để tạo nội dung phân tích.
- **Tiện ích:** Tạo file PDF (pdfkit), gửi email kết quả.
- **Môi trường Local:** Sử dụng LocalStack để mô phỏng các dịch vụ AWS.

## Khó khăn và cách giải quyết

### Khó khăn
Khi ban đầu thiết kế hệ thống, tụi em chưa có kinh nghiệm nhiều với AWS cũng 
như là chưa hiểu rõ về các dịch vụ AWS, nên trong quá trình làm sẽ có nhiều bỡ ngỡ. Đặc biệt là
khi thiết kế sơ đồ hệ thống. Ban đầu tụi em dự định sẽ là có đăng ký đăng nhập, xác thực người dùng,
có sử dụng thanh toán, có lưu trữ thông tin cá nhân, có sử dụng dịch vụ AWS Bedrock để AI xử lý các yêu cầu. 
Thế nhưng rồi tài khoản em có nhiều vấn đề như Operation not allowed. Dù tài khoản đã 
được xác minh danh tính rồi mà vẫn không được. Kể cả khi em viết ticket cho AWS support thì họ 
cũng không giúp đỡ (tính đến thời điểm ngày 13/07/2026 và 22/07/2026 họ có trả lời là đang xử lý cho em và chưa được).
Vậy nên khó khăn vừa về cả thời gian, tài chính lẫn chuyên môn nên cả nhóm đã quyết định là 
làm dự án mà không có xác thực người dùng, không có thanh toán, không lưu trữ thông tin cá nhân và dùng
serverless framework để triển khai, sau đó đã deploy được web ở trên AWS Amplify. Link web em có để ở dưới cùng.

### Cách giải quyết
**Về thời gian:** Như em đã nói ở trên, nhóm tụi em quyết định đổi web thành web tự do, không cần đăng ký đăng nhập,
nhưng vẫn lưu nội dung, thời gian, IP người truy cập vào, để lên CloudWatch có thể xem được lưu lượng.

**Về tài chính:** Do là tài khoản của mỗi người khi tạo AWS được free 200$, thế nhưng tụi em lại chưa biết quản lý
sao cho hiệu quả, đã có bạn làm tiêu 1 nửa chỉ sau 1 tuần. Thế nên em đã quyết định là sử dụng tài nguyên, cái gì
free thì làm sao cho hiệu quả nhất có thể, ví dụ thay vì dùng AWS Bedrock thì em dùng mô hình Gemini 2.0 Flash.
Các API thay vì dùng các dịch vụ có tính phí của AWS thì tụi em tắt bớt những cái nào không sử dụng, để cho budget chi
phí ở tầm khoảng 1-2$, nhưng mà do hosting nên là chi phí dự kiến đã tiêu khoảng 5$/tháng, vượt qua budget so với quy định.

**Về chuyên môn:** Tụi em không có kinh nghiệm về AWS nhiều, nên trong quá trình làm sẽ có nhiều bỡ ngỡ. Đặc biệt là
khi thiết kế sơ đồ hệ thống, ban đầu tụi em dự định sẽ là có đăng ký đăng nhập, xác thực người dùng,
có sử dụng thanh toán, có lưu trữ thông tin cá nhân, có sử dụng dịch vụ AWS Bedrock để AI xử lý các yêu cầu. 
Thế nhưng do lỗi tài khoản Operation not allowed không thể dùng được Cognito và Bedrock, tụi em chọn cách đơn giản hơn là sử dụng
Lambda gọi API của các mô hình AI trực tiếp. Ngoài ra thì tụi em cũng sử dụng LocalStack/Floci để mô phỏng các dịch vụ AWS ở local.



---

##  Hướng dẫn cài đặt và chạy dự án (Local Development)

### Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.x hoặc 20.x
- **Docker & Docker Compose**: Dành cho LocalStack (mô phỏng AWS)
- **AWS CLI**: (Tùy chọn) để tương tác với LocalStack
- **Quản lý package**: `npm`

### 1. Khởi động các dịch vụ AWS cục bộ (LocalStack)
Dự án sử dụng Docker để chạy LocalStack, giúp bạn phát triển các tính năng dùng AWS (S3, DynamoDB, SES) ở môi trường local.
Tại thư mục gốc của dự án, chạy lệnh:
```bash
docker-compose up -d
```
LocalStack sẽ chạy ở cổng `4566`.

### 2. Thiết lập Backend (Serverless API)
Mở một terminal mới và di chuyển vào thư mục `be`:
```bash
cd be
```
- **Cài đặt thư viện:**
  ```bash
  npm install
  ```
- **Cấu hình biến môi trường:**
  Copy file `.env.example` thành `.env` và điền các thông tin cần thiết, đặc biệt là các API Key của các dịch vụ AI (Gemini, v.v.) và thông tin AWS.
- **Khởi động serverless offline:**
  ```bash
  npx serverless offline start
  ```
  API của bạn sẽ chạy tại `http://localhost:8080`.

### 3. Thiết lập Frontend (Next.js)
Mở một terminal khác và di chuyển vào thư mục `fe`:
```bash
cd fe
```
- **Cài đặt thư viện:**
  ```bash
  npm install
  ```
- **Cấu hình biến môi trường:**
  Tạo hoặc chỉnh sửa file `.env.local` nếu cần thiết (để trỏ tới API Backend local `http://localhost:8080`).
- **Khởi động Frontend:**
  ```bash
  npm run dev
  ```
  Ứng dụng web sẽ chạy tại `http://localhost:3000`.

---

## Cấu trúc thư mục

```
LunaGenZ/
│
├── be/                 # Backend codebase (Serverless)
│   ├── handlers/       # Các AWS Lambda handlers (numerology, lenormand, aiHandler)
│   ├── services/       # Xử lý logic nghiệp vụ, gọi AI, tạo PDF, gửi email
│   ├── utils/          # Các hàm hỗ trợ tiện ích
│   ├── data/           # Dữ liệu tĩnh (như numerology_db.json)
│   ├── local-data/     # Dữ liệu test cục bộ
│   ├── serverless.yml  # Cấu hình triển khai Serverless Framework & AWS Resources
│   └── package.json    # Dependencies backend
│
├── fe/                 # Frontend codebase (Next.js)
│   ├── app/            # Next.js App Router (pages, layouts)
│   ├── components/     # Các React components có thể tái sử dụng
│   ├── hooks/          # React hooks tùy chỉnh
│   ├── store/          # Zustand stores quản lý trạng thái
│   ├── lib/            # Các hàm hỗ trợ, cấu hình thư viện
│   ├── types/          # Khai báo TypeScript types/interfaces
│   └── package.json    # Dependencies frontend
│
└── docker-compose.yml  # Cấu hình Docker để chạy LocalStack
```

---

##  Các tính năng chính

1. **Tra cứu Thần số học (Numerology):**
   - Nhập thông tin ngày sinh và họ tên để xuất ra các chỉ số đường đời, vận mệnh, linh hồn, v.v.
   - Ứng dụng AI để diễn giải chi tiết, sâu sắc ý nghĩa của từng con số dựa trên thông tin cá nhân.
   
2. **Trải bài Lenormand:**
   - Hệ thống bói bài Lenormand kỹ thuật số.
   - Nhận thông điệp và lời khuyên hàng ngày thông qua sự hỗ trợ phân tích tình huống từ AI.

3. **Xuất PDF & Gửi Email:**
   - Tạo báo cáo cá nhân hóa dưới định dạng PDF.
   - Tự động gửi kết quả thần số học hoặc bói bài qua email cho người dùng (tích hợp Nodemailer / AWS SES).

---

##  Đóng góp (Contributing)
Nếu bạn muốn đóng góp cho dự án:
1. Fork repository này.
2. Tạo một branch cho tính năng mới (`git checkout -b feature/AmazingFeature`).
3. Commit các thay đổi (`git commit -m 'Add some AmazingFeature'`).
4. Push lên branch (`git push origin feature/AmazingFeature`).
5. Tạo Pull Request.

## Link Demo

**Trải nghiệm ứng dụng tại:** [https://www.lunagenz.sbs](https://www.lunagenz.sbs)
