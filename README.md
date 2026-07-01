# Expense-ify 💰

A comprehensive expense management system that leverages AI to help you track, categorize, and analyze your expenses efficiently.

## 🌟 Features

- **AI-Powered Expense Categorization**: Uses Cohere AI to automatically categorize expenses into predefined categories
- **Receipt Upload**: Upload and store receipt images for expense tracking
- **AI-Generated Summaries**: Get intelligent summaries of your expenses using Cohere AI
- **Export Functionality**: Download your expenses as PDF or CSV files
- **Data Analytics**: 
  - Daily expense tracking
  - Monthly expense analysis
  - Category-wise expense breakdown
- **User Authentication**: Secure user registration and login system
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface
- **Deployed on Vercel**

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Deployed on AWS EC2**

### Database
- **MySQL** - Data storage
- **Hosted on AWS EC2**

### Cloud Services
- **AWS S3** - Receipt storage
- **AWS EC2** - Backend and database hosting

### AI Integration
- **Cohere AI** - Expense categorization and summary generation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager
- AWS Account with EC2 and S3 access
- Cohere AI API key

### AWS Setup

Before setting up the application, you'll need to configure AWS services:

#### 1. AWS EC2 Instance Setup
1. Launch an EC2 instance (Ubuntu 20.04 LTS recommended)
2. Configure security groups to allow:
   - Port 22 (SSH)
   - Port 5000 (Backend API)
   - Port 3306 (MySQL)
   - Port 80/443 (HTTP/HTTPS)
3. Install Node.js and MySQL on the EC2 instance
4. Note down the EC2 instance public IP or domain

#### 2. AWS S3 Bucket Setup
1. Create an S3 bucket for receipt storage
2. Configure bucket permissions for public read access (for receipt images)
3. Create IAM user with S3 permissions
4. Generate Access Key ID and Secret Access Key
5. Note down the bucket name and region

#### 3. MySQL Installation on EC2
```bash
# Update system packages
sudo apt update

# Install MySQL
sudo apt install mysql-server

# Secure MySQL installation
sudo mysql_secure_installation

# Configure MySQL for remote connections
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Change bind-address from 127.0.0.1 to 0.0.0.0

# Restart MySQL
sudo systemctl restart mysql

# Create database user
sudo mysql -u root -p
CREATE USER 'your_username'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON expense_ify.* TO 'your_username'@'%';
FLUSH PRIVILEGES;
```

### Database Setup

1. **Create Database**
   ```sql
   CREATE DATABASE expense_ify;
   USE expense_ify;
   ```

2. **Create Users Table**
   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(100) NOT NULL UNIQUE,
       password_hash VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Create Categories Table**
   ```sql
   CREATE TABLE categories (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL UNIQUE
   );
   ```

4. **Insert Default Categories**
   ```sql
   INSERT INTO categories (name) VALUES 
   ('Food'),
   ('Transport'),
   ('Groceries'),
   ('Entertainment'),
   ('Utilities'),
   ('Healthcare'),
   ('Travel'),
   ('Subscription'),
   ('Education'),
   ('Shopping'),
   ('Personal Care'),
   ('Rent'),
   ('Bills'),
   ('Savings'),
   ('Miscellaneous');
   ```

5. **Create Expenses Table**
   ```sql
   CREATE TABLE expenses (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT NOT NULL,
       amount DECIMAL(10, 2) NOT NULL,
       description TEXT,
       category_id INT,
       date DATE NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       receipt_url VARCHAR(1000),
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
       FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
   );
   ```

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodinJack/Expense-ify.git
   cd Expense-ify
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   DB_HOST=your_ec2_instance_ip_or_domain
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=expense_ify
   PORT=5000
   COHERE_API_KEY=your_cohere_api_key
   FRONTEND_URL=http://localhost:8080
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET_NAME=your_s3_bucket_name
   ```

5. **Start the backend server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Start the frontend development server**
   ```bash
   npm start
   ```

## 📊 Usage

1. **Register/Login**: Create an account or log in to access the expense tracker
2. **Add Expenses**: 
   - Manually enter expense details
   - Upload receipts for automatic data extraction
   - Let AI categorize your expenses automatically
3. **View Analytics**: 
   - Check daily, monthly, and category-wise expense breakdowns
   - View visual charts and graphs
4. **Generate Reports**: 
   - Get AI-powered expense summaries
   - Export data as PDF or CSV files

## 🌐 Deployment

### Backend (AWS EC2)
1. **Prepare EC2 Instance**:
   - Launch Ubuntu 20.04 LTS EC2 instance
   - Install Node.js, npm, and MySQL
   - Configure security groups

2. **Deploy Backend**:
   ```bash
   # Clone repository on EC2
   git clone https://github.com/CodinJack/Expense-ify.git
   cd Expense-ify/backend
   
   # Install dependencies
   npm install
   
   # Install PM2 for process management
   npm install -g pm2
   
   # Start application with PM2
   pm2 start server.js --name "expense-ify-backend"
   pm2 startup
   pm2 save
   ```

3. **Configure Environment**:
   - Update `.env` file with production values
   - Set `DB_HOST` to your EC2 instance IP
   - Configure AWS S3 credentials
   - Set `FRONTEND_URL` to your Vercel domain

### Frontend (Vercel)
1. **Connect GitHub Repository**:
   - Import your repository to Vercel
   - Configure build settings for React/Vite project

2. **Environment Variables**:
   - Set `VITE_API_BASE_URL` to your EC2 backend URL
   - Example: `https://your-ec2-domain.com` or `http://your-ec2-ip:5000`

3. **Deploy**:
   - Vercel will automatically deploy on every push to main branch

### AWS S3 Configuration
- Create S3 bucket with public read access for receipt images
- Configure CORS policy for frontend access
- Set up IAM user with appropriate S3 permissions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Expenses
- `GET /api/expenses` - Get all expenses for logged-in user
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories
- `GET /api/categories` - Get all categories

### Analytics
- `GET /api/analytics/daily` - Daily expense data
- `GET /api/analytics/monthly` - Monthly expense data
- `GET /api/analytics/category` - Category-wise expense data

### Export
- `GET /api/export/pdf` - Export expenses as PDF
- `GET /api/export/csv` - Export expenses as CSV

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
