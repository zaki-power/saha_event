# Saha Event - Reservation Management System

A modern event space reservation platform built with React, Vite, Tailwind CSS, and Supabase.

## 🚀 Deployment on Vercel

To deploy this project on Vercel, follow these steps:

1. **Push your code to GitHub.**
2. **Create a new project on Vercel** and import your repository.
3. **Configure Environment Variables:** In the Vercel dashboard, add the following variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous API key.
4. **Build Settings:** Vercel should automatically detect Vite, but if not:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## 🛠 Features

- **User Authentication:** Sign up/Login via Supabase Auth.
- **Reservation Workflow:** Users can book salles, admins can approve/reject.
- **CCP Payment Integration:** Users receive CCP details upon approval and can upload PDF receipts.
- **Admin Dashboard:** Full management of reservations and feedback.
- **Modern UI:** Glassmorphism design with Vanta.js backgrounds.

## 📦 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
