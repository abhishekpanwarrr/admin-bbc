# FoodHub - Restaurant Management System

A modern full-stack restaurant management application built with Next.js, featuring separate interfaces for users and administrators.

## Features

- **User Authentication**: Register and login as user or admin
- **Menu Management**: Admin can add, edit, and delete menu items with image uploads
- **Image Uploads**: Integrated Cloudinary for seamless image management
- **Order Management**: Users can browse menu and place orders; admins can manage order status
- **Real-time Updates**: Order status tracking and management
- **Role-Based Access**: Different interfaces for users and administrators

## Setup Instructions

### Prerequisites

- Node.js 16+ installed
- Cloudinary account (for image uploads)
- Backend API running (see Backend Setup)

### Frontend Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

3. **Get Cloudinary Credentials**
   - Go to [Cloudinary Dashboard](https://cloudinary.com/console)
   - Copy your Cloud Name
   - Create an unsigned upload preset in Settings > Upload > Upload presets
   - Note: Create an unsigned preset to allow uploads without backend authentication

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── page.tsx                 # Home/landing page
├── layout.tsx              # Root layout with metadata
├── globals.css             # Global styles and theme
├── auth/
│   ├── login/page.tsx      # Login page
│   └── register/page.tsx   # Registration page
├── admin/
│   ├── layout.tsx          # Admin layout with navigation
│   ├── dashboard/page.tsx  # Admin dashboard
│   ├── menu/page.tsx       # Menu management
│   └── orders/page.tsx     # Order management
└── user/
    ├── layout.tsx          # User layout with navigation
    ├── menu/page.tsx       # User menu browsing
    └── orders/page.tsx     # User order tracking

components/
├── admin/
│   └── add-menu-item-dialog.tsx  # Menu item form modal
├── cloudinary-uploader.tsx       # Image upload component
└── ui/                           # shadcn/ui components

lib/
├── auth.ts                 # Authentication utilities and API calls

types/
├── menu.ts                 # Menu and MenuItem types
└── order.ts               # Order and OrderItem types
```

## API Endpoints

The application expects the following API endpoints:

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Menu (User)
- `GET /api/v1/menu` - Get all menu items
- `GET /api/v1/menu/featured` - Get featured items
- `GET /api/v1/menu/categories` - Get all categories
- `GET /api/v1/menu/category/:id` - Get items by category

### Menu (Admin)
- `POST /api/v1/menu` - Add new menu item
- `DELETE /api/v1/menu/:id` - Delete menu item
- `PATCH /api/v1/menu/:id` - Update menu item

### Orders (User)
- `POST /api/v1/orders` - Place new order
- `GET /api/v1/orders/me` - Get user's orders
- `GET /api/v1/orders/status` - Get order status

### Orders (Admin)
- `GET /api/v1/admin/orders` - Get all orders
- `GET /api/v1/admin/orders/pending` - Get pending orders
- `GET /api/v1/admin/orders/today` - Get today's orders
- `PATCH /api/v1/admin/orders/:id` - Update order status

## Cloudinary Setup Guide

### Create Cloudinary Account

1. Visit [Cloudinary](https://cloudinary.com)
2. Click "Sign Up" and create a free account
3. Go to your Dashboard

### Get Your Cloud Name

1. In Cloudinary Dashboard, you'll see your **Cloud Name** at the top
2. Copy this value

### Create Upload Preset

1. Go to Settings (gear icon)
2. Navigate to Upload tab
3. Scroll to "Upload presets"
4. Click "Add upload preset"
5. Set the following:
   - **Preset name**: `foodhub` (or any name)
   - **Signing mode**: Unsigned (allows frontend uploads)
   - **Save to folder**: Optional, e.g., `foodhub/menu`
6. Click "Save"

### Add to Environment Variables

Update `.env.local`:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=foodhub
```

## Authentication Flow

1. User registers as **User** or **Admin**
2. JWT token is returned and stored in browser's localStorage
3. Token is automatically included in all authenticated API requests
4. Admin users are redirected to admin dashboard
5. Regular users are redirected to menu browsing page
6. Token persists across page refreshes

## Usage

### As a User

1. Register with "User" role
2. Browse restaurant menu by category
3. Add items to cart
4. Place orders
5. Track order status in "My Orders"

### As an Admin

1. Register with "Admin" role
2. Go to Menu Management
3. Click "Add Menu Item"
4. Upload image to Cloudinary
5. Fill in item details and save
6. Go to Orders to manage customer orders
7. Update order status as items are prepared

## Troubleshooting

### Image Upload Not Working
- Check Cloudinary Cloud Name and Upload Preset are correct in `.env.local`
- Ensure upload preset is set to "Unsigned"
- Clear browser cache and try again

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` matches your backend server
- Check backend server is running on the correct port
- Ensure CORS is enabled on your backend

### Authentication Issues
- Check localStorage has `auth_token` stored (open browser DevTools)
- Verify backend is returning valid JWT tokens
- Logout and login again to refresh token

## Deployment

When deploying to production:

1. Update `NEXT_PUBLIC_API_URL` to your production backend URL
2. Ensure Cloudinary credentials are added to your hosting platform's environment variables
3. Update CORS settings in backend if needed
4. Test authentication and image uploads in production

## Technologies Used

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Image Hosting**: Cloudinary
- **State Management**: React hooks
- **API Integration**: Fetch API with token-based auth
# admin-bbc
