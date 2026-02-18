# Class Folio Desk Backend

## 🚀 Advanced Backend for Student Management System

This is a production-ready Node.js/Express backend with TypeScript, MongoDB, and comprehensive security features.

## 📋 Features

### **🔐 Authentication & Authorization**
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Teacher, Staff)
- Password hashing with bcrypt
- Secure token management

### **📊 Student Management**
- Full CRUD operations for students
- Advanced search and filtering
- Pagination and sorting
- Class-wise student organization
- Bulk operations support

### **🛡️ Security Features**
- Rate limiting (multiple levels)
- Input validation with Joi
- CORS configuration
- Helmet security headers
- SQL injection prevention
- XSS protection

### **📈 Performance & Monitoring**
- Database connection pooling
- Request/response compression
- Health check endpoints
- Structured logging
- Error handling

### **🔧 Development Features**
- TypeScript for type safety
- Hot reload with nodemon
- Environment configuration
- Comprehensive error handling
- API documentation ready

## 🏗️ Architecture

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── utils/          # Utility functions
├── validators/     # Input validation schemas
└── server.ts       # Application entry point
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- MongoDB 5.0+
- npm or yarn

### **Installation**

1. **Clone and install dependencies**
```bash
cd backend
npm install
```

2. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB**
```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
npm start
```

## 📡 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### **Students**
- `GET /api/students` - Get all students (with pagination/filtering)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/search` - Search students
- `GET /api/students/class/:classId` - Get students by class
- `GET /api/students/stats` - Get class statistics

### **Health Check**
- `GET /health` - Server health status

## 🔒 Security Features

### **Rate Limiting**
- General API: 100 requests/15 minutes
- Authentication: 5 requests/15 minutes
- Create operations: 10 requests/hour

### **Input Validation**
- All inputs validated with Joi schemas
- SQL injection prevention
- XSS protection
- File upload validation

### **Authentication**
- JWT with expiration
- Refresh token rotation
- Password strength requirements
- Session management

## 📊 Database Schema

### **Student Model**
```typescript
{
  name: string;
  rollNo: string; // unique
  class: string; // 1-10
  section: 'A' | 'B';
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  photo?: string;
  dateOfBirth?: Date;
  parentName?: string;
  contactNumber?: string;
  email?: string;
  admissionDate: Date;
  isActive: boolean;
}
```

### **User Model**
```typescript
{
  username: string; // unique
  email: string; // unique
  password: string; // hashed
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'staff';
  isActive: boolean;
  lastLogin?: Date;
  refreshTokens: string[];
}
```

## 🌍 Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/class-folio-desk
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8080
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 API Usage Examples

### **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### **Create Student**
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "rollNo": "101",
    "class": "1",
    "section": "A",
    "gender": "Male",
    "address": "123 Main St"
  }'
```

### **Search Students**
```bash
curl -X GET "http://localhost:5000/api/students/search?q=John" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Deployment

### **Docker**
```bash
docker build -t class-folio-backend .
docker run -p 5000:5000 class-folio-backend
```

### **Environment Setup**
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure MongoDB with SSL
- Set up reverse proxy (nginx)
- Configure monitoring

## 📈 Monitoring & Logging

- Structured logging with Morgan
- Health check endpoint
- Error tracking
- Performance monitoring ready
- Database connection monitoring

## 🔧 Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Nodemon** - Hot reload
- **Jest** - Testing framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Note**: This backend is designed to work with the Class Folio Desk frontend but can be used independently as a REST API.
