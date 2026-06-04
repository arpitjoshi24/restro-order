#  Restro Cafe - QR Based Restaurant Ordering System

A modern restaurant management and ordering platform built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Node.js API integration**.

Customers can scan a QR code placed on their table, browse the menu, place orders, and track order status without waiting for a waiter.

---

##  Features

### Customer Side

- QR Code Based Table Ordering
- Browse Restaurant Menu
- Category-wise Food Listing
- Add Items to Cart
- Place Orders Instantly
- Real-Time Order Status Tracking
- Responsive Mobile-Friendly Interface

### Kitchen Dashboard

- View Incoming Orders
- Update Order Status
- Manage Active Orders
- Track Preparation Workflow

### Admin Dashboard

- Manage Menu Items
- Manage Categories
- View Orders
- Restaurant Analytics
- Staff Management

---

##  Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Axios
- Lucide React Icons

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication

---

##  Project Structure

```bash
app/
├── admin/
├── kitchen/
├── menu/
├── orders/
├── page.tsx
├── layout.tsx

components/
├── ui/
├── shared/

lib/
├── axios.ts

public/
├── assets/
```

---

##  Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Replace the URL with your backend API endpoint.

---

## Installation

### Clone Repository

```bash
git clone (https://github.com/arpitjoshi24/restro-order.git)
cd restro-cafe
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create:

```bash
.env.local
```

and add:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Start Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

##  Backend Requirements

Ensure the backend server is running before starting the frontend.

Example Backend URL:

```bash
http://localhost:5000/api
```

Required APIs:

### Menu

```http
GET /menu
```

### Orders

```http
POST /orders
GET /orders
```

### Kitchen

```http
GET /kitchen/orders
PATCH /kitchen/orders/:id
```

---

##  QR Ordering Flow

1. Customer scans table QR code.
2. Menu opens automatically.
3. Customer adds items to cart.
4. Order is submitted.
5. Kitchen receives order instantly.
6. Order status is updated.
7. Customer receives order.

---

##  UI Features

- Modern Restaurant Landing Page
- Mobile Responsive Design
- Dashboard Analytics
- Fast Navigation
- Optimized Performance

---

##  License

This project is licensed under the MIT License.

---

##  Author

**Arpit Joshi**

