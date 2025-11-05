# Anima Project

Welcome! # BookIt: Experiences & Slots

A complete end-to-end web application for booking travel experiences with slot management.

## 🚀 Features

### Frontend
- ✅ **React + TypeScript** with Vite
- ✅ **TailwindCSS** for styling
- ✅ **Dynamic Data**: All experiences fetched from backend APIs
- ✅ **Complete Flow**: Home → Details → Checkout → Result
- ✅ **Form Validation**: Email, name validation with error feedback
- ✅ **Promo Codes**: Real-time validation (SAVE10, FLAT100, WELCOME20)
- ✅ **Loading States**: Spinners and feedback across all pages
- ✅ **Error Handling**: Graceful error messages and fallbacks
- ✅ **Mobile Responsive**: Works on all device sizes

### Backend
- ✅ **Node.js + Express** server
- ✅ **PostgreSQL** database (via Supabase)
- ✅ **REST API Endpoints**:
  - `GET /api/experiences` - List all experiences
  - `GET /api/experiences/:id` - Get experience details with schedules
  - `POST /api/bookings` - Create booking with validation
  - `POST /api/promo/validate` - Validate promo codes
- ✅ **Double-booking Prevention**: Database-level slot management
- ✅ **Data Validation**: Comprehensive input validation
- ✅ **Transaction Safety**: Atomic booking operations

## 📁 Project Structure

```
project/
├── backend/                 # Node.js/Express backend
│   ├── routes/             # API routes
│   ├── db/                 # Database connection
│   ├── package.json        # Backend dependencies
│   └── index.js           # Server entry point
├── src/                    # React frontend
│   ├── components/ui/      # Reusable UI components
│   ├── hooks/             # Custom React hooks for data fetching
│   ├── services/          # API service layer
│   ├── screens/           # Page components
│   │   ├── Main/          # Home page
│   │   ├── ExperienceDetail/ # Details page
│   │   ├── Checkout/      # Checkout page
│   │   └── Result/        # Confirmation page
├── supabase/              # Database migrations
└── package.json           # Frontend dependencies
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Supabase recommended)

### 1. Clone and Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### 2. Database Setup

You have two options:

#### Option A: Use Mock Data (Quickstart - No Database Required)
The application will automatically use mock data if PostgreSQL is not available. Just start the backend server and it will work with sample data.

#### Option B: Set up Local PostgreSQL Database

1. **Install PostgreSQL** from [postgresql.org](https://www.postgresql.org/downloads/)
2. **Update Configuration**: Edit `backend/.env` and set your PostgreSQL password:
   ```env
   DB_PASSWORD=your_actual_postgres_password
   ```
3. **Create Database and Tables**:
   ```bash
   # Create the database
   psql -U postgres -c "CREATE DATABASE bookit_db;"
   
   # Set up tables and sample data
   cd backend
   psql -U postgres -d bookit_db -f setup-database.sql
   ```

**Alternative for Windows**: Run `backend/setup-db.bat` for step-by-step instructions.

### 3. Environment Configuration

Create `backend/.env`:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

**Get your DATABASE_URL from**: Supabase Dashboard → Settings → Database → Connection string

### 4. Start Development Servers

#### Option A: Automated (Recommended)
```bash
# Windows
start-dev.bat

# macOS/Linux  
chmod +x start-dev.sh
./start-dev.sh
```

#### Option B: Manual
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
npm run dev
```

### 5. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🔄 Complete User Flow

1. **Home Page** (`/`) - Browse available experiences
2. **Experience Details** (`/experience/:id`) - Select date, time, and quantity
3. **Checkout** (`/checkout`) - Enter personal info and apply promo codes
4. **Result** (`/result`) - View booking confirmation

## 🎯 API Endpoints

### Experiences
```http
GET /api/experiences
Response: { success: true, data: [Experience[]] }

GET /api/experiences/:id  
Response: { success: true, data: ExperienceWithSchedules }
```

### Bookings
```http
POST /api/bookings
Body: {
  experienceId: string,
  scheduleId: string, 
  fullName: string,
  email: string,
  quantity: number,
  totalAmount: number,
  promoCode?: string
}
Response: { success: true, data: { bookingId, referenceId, message } }
```

### Promo Codes
```http
POST /api/promo/validate
Body: { promoCode: string, amount: number }
Response: { success: true, data: { discount, finalAmount, description } }
```

**Available Promo Codes:**
- `SAVE10` - 10% off
- `FLAT100` - ₹100 off  
- `WELCOME20` - 20% off

## 🎨 Design Features

- **Pixel-perfect** UI matching Figma designs
- **Consistent spacing** and typography
- **Loading states** with spinners
- **Error handling** with user-friendly messages
- **Form validation** with real-time feedback
- **Sold-out indicators** for unavailable slots
- **Mobile-first** responsive design

## 🔒 Security Features

- **Input validation** on both frontend and backend
- **SQL injection protection** via parameterized queries
- **XSS prevention** through proper input sanitization
- **Rate limiting** ready for production
- **Environment variables** for sensitive data

## 🧪 Testing the Application

1. **Browse Experiences**: Visit home page to see dynamic experience list
2. **Select Experience**: Click "View Details" to see schedules
3. **Choose Slot**: Select available date/time (note sold-out states)
4. **Checkout Process**: Fill form with validation
5. **Apply Promo**: Try codes like "SAVE10" or "FLAT100"
6. **Complete Booking**: Get confirmation with reference ID

## 📱 Mobile Responsiveness

- **Breakpoints**: Supports sm, md, lg, xl screen sizes
- **Touch-friendly**: Buttons and inputs optimized for mobile
- **Navigation**: Mobile-first navigation patterns
- **Performance**: Optimized for mobile networks

## 🚀 Production Deployment

### Backend (Node.js)
- Deploy to **Vercel**, **Railway**, or **Heroku**
- Configure production DATABASE_URL
- Set NODE_ENV=production

### Frontend (React)
- Deploy to **Vercel**, **Netlify**, or **AWS S3**
- Update API_BASE_URL to production backend
- Configure build optimizations

## 📊 Performance

- **Lazy Loading**: Components loaded on demand
- **API Caching**: Intelligent caching strategies  
- **Bundle Optimization**: Tree-shaking and code splitting
- **Database Indexing**: Optimized queries for scale

## 🐛 Troubleshooting

### Backend Won't Start
- Check if PORT 3001 is available
- Verify DATABASE_URL is correct
- Run `npm install` in backend directory

### Frontend API Errors
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify API endpoints are accessible

### Database Connection Issues
- Double-check Supabase connection string
- Ensure database migrations have been run
- Verify firewall/network settings

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React, TypeScript, Node.js, and PostgreSQL**

## Getting started

> **Prerequisites:**
> The following steps require [NodeJS](https://nodejs.org/en/) to be installed on your system, so please
> install it beforehand if you haven't already.

To get started with your project, you'll first need to install the dependencies with:

```
npm install
```

Then, you'll be able to run a development version of the project with:

```
npm run dev
```

After a few seconds, your project should be accessible at the address
[http://localhost:5173/](http://localhost:5173/)


If you are satisfied with the result, you can finally build the project for release with:

```
npm run build
```
