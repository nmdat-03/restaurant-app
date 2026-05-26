# 🍽️ Restaurant App

A modern full-stack restaurant management and ordering platform built with Next.js 15, React 19, Prisma, and Clerk Authentication.

This project consists of two applications:

- Website → Customer-facing restaurant website

Demo: https://demo-restaurant-app.vercel.app/

- Admin Dashboard → Restaurant management system

Demo: https://demo-admin-restaurant-app.vercel.app/

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop
- Tablet
- Mobile devices

## 🚀 Tech Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- Zustand
- React Hook Form
- Zod

### Backend & Database

- Prisma ORM
- PostgreSQL (recommended)
- Clerk Authentication
- Cloudinary

### UI & Charts

- Radix UI
- Recharts
- Lucide React
- Swiper

## ✨ Features

### 🌐 Website

- Modern responsive restaurant UI
- Menu browsing
- Food categories
- Product detail pages
- Authentication with Clerk
- Dynamic filtering
- Form validation with Zod
- State management with Zustand

### ⚙️ Admin Dashboard

- Secure admin authentication
- Dashboard analytics
- Product management
- Category management
- Image upload with Cloudinary
- Form handling with React Hook Form
- Charts with Recharts
- Real-time UI updates

## 🛠️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/nmdat-03/restaurant-app.git
cd restaurant-app
```

### 2. Install Dependencies

- Root

```bash
pnpm install
```

- Website

```bash
cd website
pnpm install
```

- Admin

```bash
cd admin
pnpm install
```

## ⚙️ Environment Variables

This project uses 3 environment files:

### Create `.env.local` inside root folder `restaurant_app/`

```env
DATABASE_URL=""
```

### Create `.env.local` inside folder `website/`

```env
# App URL
NEXT_PUBLIC_BASE_URL=

# Clerk Authentication
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# VNPay
VNP_TMN_CODE=
VNP_HASH_SECRET=
```

### Create `.env.local` inside folder `admin/`

```env
# App URL
NEXT_PUBLIC_BASE_URL=

# Clerk Authentication
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# VNPay
VNP_TMN_CODE=
VNP_HASH_SECRET=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## 🗄️ Database Setup

### Generate Prisma Client

```bash
pnpm prisma generate
pnpm prisma db seed
```

## ▶️ Run Development Servers

### Start Website

```bash
cd website
pnpm dev
```

### Start Admin Dashboard

```bash
cd admin
pnpm dev
```
