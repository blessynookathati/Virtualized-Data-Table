# 🚀 High-Performance Virtualized Data Table

> A production-ready React/Next.js application capable of efficiently rendering **10,000+ records** using **TanStack Virtual** with advanced state management, filtering, sorting, responsive design, accessibility, testing, and Docker support.
---

# 📌 Overview

Modern enterprise applications often display thousands of records simultaneously. Rendering all records directly causes:

- Slow rendering
- High memory consumption
- Browser lag
- Poor scrolling performance

This project solves these challenges by implementing **DOM Virtualization** using **TanStack Virtual**, rendering only the visible rows while maintaining smooth 60 FPS scrolling.

---

# 🎯 Project Objective

Build a highly scalable virtualized data table that can:

- Display **10,000+ records**
- Filter data instantly
- Sort columns efficiently
- Maintain excellent performance
- Provide responsive UI
- Follow accessibility standards
- Support automated testing
- Be deployment-ready with Docker

---

# ✨ Features

## 📊 Data Handling

- Generate 10,000+ mock records using Faker.js
- UUID-based row identification
- Realistic sample dataset

---

## ⚡ Virtualization

- Powered by TanStack Virtual
- Renders only visible rows
- Constant DOM size
- Smooth scrolling
- High performance even with huge datasets

---

## 🔍 Filtering

Filter records by:

- Name
- Category

Features:

- Debounced search
- Instant updates
- Case-insensitive filtering

---

## 📈 Sorting

Supports:

- Ascending
- Descending
- Reset state

Works for:

- Strings
- Numbers
- Dates

---

## 📱 Responsive Design

Optimized for:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive Features:

- Horizontal scrolling
- Flexible layout
- Adaptive controls

---

## ♿ Accessibility

Supports:

- Keyboard navigation
- Screen readers
- aria-label
- aria-sort
- Semantic table roles
- Focus management

---

## ⚙️ State Management

Centralized global state using **Zustand**

Manages:

- Original Data
- Display Data
- Filters
- Sorting
- Loading State
- Error State

---

## 🧪 Testing

Includes:

- Unit Tests
- Integration Tests

Using:

- Jest
- React Testing Library

---

## 🐳 Docker Support

Includes:

- Dockerfile
- Docker Compose
- Production build

---

# 🏗 Architecture

```
                User
                  │
                  ▼
        Filter / Sort Controls
                  │
                  ▼
          Zustand Store
                  │
        Derived Display Data
                  │
                  ▼
        TanStack Virtual
                  │
          Visible Row Slice
                  │
                  ▼
       Virtualized Data Table
```

---

# 🔄 Application Workflow

```
Application Starts
        │
        ▼
Generate 10,000 Mock Records
        │
        ▼
Store Data in Zustand
        │
        ▼
Render Virtualized Table
        │
        ▼
User Scrolls
        │
        ▼
TanStack Calculates Visible Rows
        │
        ▼
Only Visible Rows Rendered
        │
        ▼
User Filters / Sorts Data
        │
        ▼
Store Updates
        │
        ▼
Display Data Recalculated
        │
        ▼
Virtual Table Re-renders Visible Rows
```

---

# 📂 Folder Structure

```
project-root
│
├── public
│
├── src
│   ├── components
│   │   ├── DataTable
│   │   ├── TableControls
│   │   ├── VirtualRow
│   │   ├── Loader
│   │   ├── EmptyState
│   │   └── ErrorBoundary
│   │
│   ├── store
│   │   └── dataTableStore.ts
│   │
│   ├── utils
│   │   └── generateMockData.ts
│   │
│   ├── hooks
│   │   └── useDebounce.ts
│   │
│   ├── types
│   │   └── DataRow.ts
│   │
│   ├── styles
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── tests
│   ├── DataTable.test.tsx
│   └── Store.test.ts
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🛠 Tech Stack

## Frontend

- React
- Next.js / Vite
- TypeScript

## Styling

- CSS
- Tailwind CSS

## State Management

- Zustand

## Virtualization

- TanStack Virtual

## Mock Data

- Faker.js

## Testing

- Jest
- React Testing Library

## Containerization

- Docker
- Docker Compose

---

# 🚀 Installation

Clone repository

```bash
git clone https://github.com/yourusername/virtualized-data-table.git
```

Move into project

```bash
cd virtualized-data-table
```

Install packages

```bash
npm install
```

Run locally

```bash
npm run dev
```

Production build

```bash
npm run build
```

---

# 🐳 Docker

Build

```bash
docker-compose build
```

Run

```bash
docker-compose up
```

Stop

```bash
docker-compose down
```

---

# 🧪 Testing

Run all tests

```bash
npm test
```

Coverage

```bash
npm run test:coverage
```

---

# ⚡ Performance Optimizations

- DOM Virtualization
- React.memo
- useMemo
- Debounced Filtering
- Zustand Selectors
- Minimal Re-rendering
- Efficient State Updates
- Lazy Rendering

---

# ♿ Accessibility

✔ Keyboard Navigation

✔ Screen Reader Support

✔ aria-sort

✔ aria-label

✔ Semantic Roles

✔ Focus Management

---

# 📊 Performance Comparison

| Traditional Table | Virtualized Table |
|-------------------|-------------------|
| 10,000 DOM Nodes | 30–50 DOM Nodes |
| Slow Rendering | Smooth Rendering |
| High Memory Usage | Low Memory Usage |
| Laggy Scrolling | 60 FPS Scrolling |

---

# 🔮 Future Improvements

- Server-side Pagination
- Infinite Scrolling
- Column Resizing
- Column Pinning
- CSV Export
- Dark Mode
- Row Selection
- Drag & Drop Columns
- Multi-column Sorting
- Backend Integration

---

# 📚 Learning Outcomes

This project demonstrates:

- DOM Virtualization
- Enterprise React Architecture
- Performance Optimization
- Global State Management
- Accessibility
- Responsive Design
- Testing Strategies
- Docker Deployment
- Clean Code Practices

---

# 👨‍💻 Author

**Blessy Nookathati**

# ⭐ If you found this project helpful, don't forget to give it a Star!
