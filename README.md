# Bypass.ai - Executive Escalation Service

A professional consumer advocacy platform that helps UK customers bypass automated customer service systems and force companies to respond with human representatives.

## 🚀 Features

- **Company Database**: Curated list of top 50 UK brands with success rates
- **AI-Powered Escalation**: Automated professional email generation
- **Real-time Tracking**: Unique IDs for following escalation progress
- **Premium Services**: PayPal-integrated "Executive Strike" options
- **Admin Dashboard**: Complete case management with pagination
- **Security First**: Authentication, rate limiting, input sanitization

## 🛠 Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Email**: Resend API
- **Payments**: PayPal integration
- **Styling**: Tailwind CSS
- **Security**: Rate limiting, input sanitization, security headers

## 📋 Prerequisites

- Node.js 18.18.0+ (Required for Prisma 7)
- npm or yarn
- SQLite (included with Prisma)

## 🚀 Quick Start (Development)

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd bypass-ai
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Create admin user**
   ```bash
   node scripts/seed-admin.mjs
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Main site: http://localhost:3000
   - Admin login: http://localhost:3000/login
   - Admin dashboard: http://localhost:3000/admin

## 🔐 Admin Access

Default admin credentials:
- **Email**: admin@bypass.ai
- **Password**: admin123

⚠️ **Change the default password immediately in production!**

## 🏗 Production Deployment

### 📤 Pushing to GitHub

1. **Run Validation**: Ensure your environment variables and prisma schema are correct.
   ```bash
   npm run deploy-check
   ```
2. **Push Code**:
   ```bash
   git add .
   git commit -m "Initial production-ready commit"
   git push origin main
   ```

### Environment Setup

1. **Configure environment variables** (see `.env.example`)
   ```bash
   DATABASE_URL="file:./prod.db"
   JWT_SECRET="your-production-jwt-secret"
   RESEND_API_KEY="your-resend-api-key"
   NEXTAUTH_URL="https://yourdomain.com"
   ```

2. **Database migration**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

3. **Build and start**
   ```bash
   npm run build
   npm start
   ```

### Recommended Production Setup

- **VPS/Cloud**: DigitalOcean, AWS EC2, or Vercel
- **Database**: PostgreSQL for production (update `DATABASE_URL`)
- **SSL**: Required for payment processing
- **Monitoring**: Set up error tracking (Sentry recommended)
- **Backups**: Regular database backups

## 🔒 Security Features

- **Authentication**: JWT-based admin authentication
- **Rate Limiting**: API request throttling
- **Input Sanitization**: XSS protection with DOMPurify
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **SQL Injection Protection**: Prisma ORM
- **Password Hashing**: bcrypt with salt rounds

## 📊 API Endpoints

### Public Endpoints
- `GET /api/admin/companies` - Company database
- `POST /api/escalate` - Submit escalation
- `GET /api/track/[id]` - Track escalation status
- `POST /api/companies/request` - Request new company

### Protected Endpoints (Admin Only)
- `GET /api/admin/escalation/list` - All escalations
- `PATCH /api/admin/escalation/[id]` - Update status
- `DELETE /api/admin/escalation/[id]` - Delete escalation
- `POST /api/admin/companies` - Add/edit companies

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run API workflow test:
```bash
node scripts/test-api.mjs
```

## 📈 Monitoring & Analytics

### Error Tracking
Configure Sentry in production:
```bash
npm install @sentry/nextjs
# Follow Sentry setup instructions
```

### Analytics
Add your analytics provider (Mixpanel, Google Analytics, etc.) to `lib/monitoring.ts`

## 🚨 Legal & Compliance

- **GDPR Compliant**: Privacy policy and data deletion features
- **UK Consumer Law**: Templates based on Consumer Rights Act 2015
- **Terms of Service**: Clear liability limitations
- **Data Retention**: Configurable data retention policies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- **Issues**: GitHub Issues
- **Security**: security@bypass.ai
- **General**: support@bypass.ai

## 📄 License

This project is proprietary software. See LICENSE file for details.

---

**Built with ❤️ for UK consumers**

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
