# GreyAtom Logistics - Delivery Exception Management Dashboard

A professional, fully functional internal operations dashboard built with **Vanilla HTML, CSS, and JavaScript**. Designed for logistics managers to track and resolve delivery issues in real-time.

## 🚀 Features

- **Dynamic Dashboard**: Overview of total, resolved, and pending exceptions with SVG charts.
- **Full CRUD Support**: Add, view, edit, and delete exceptions with immediate LocalStorage persistence.
- **Advanced Filtering**: Search by tracking ID/customer and filter by status or priority.
- **Analytics deep-dive**: Visual distribution of issues by priority and partner performance using custom SVG charts.
- **Responsive Design**: Optimized for Desktop, Tablet, and Mobile with a sliding sidebar menu.
- **Dark/Light Mode**: Seamless theme toggling that persists across sessions.
- **Activity Log**: Automatically tracks every action taken in the dashboard.
- **Export to CSV**: Download filtered exception lists for external reporting.
- **Keyboard Shortcuts**:
  - `Alt + N`: New Exception
  - `Alt + S`: Focus Search

## 📁 Project Structure

```text
greyatom-dashboard/
│
├── index.html          # Dashboard Home (Analytics + Activity)
├── style.css           # Global Design System & Variables
├── script.js           # Core Logic & Storage Manager
│
├── pages/
│   ├── exceptions.html # Table view + CRUD Operations
│   └── analytics.html  # Performance & Status Trends
│
├── assets/             # Icons and static images
└── README.md           # Documentation
```

## 🛠️ Setup Instructions

1. **Clone/Download** the project folder.
2. Open `index.html` in any modern web browser.
3. No server or build step required.
4. Data is stored in your browser's **LocalStorage**.

## 🎨 UI Theme
- **Primary Colors**: Dark Navy (#0f172a), Royal Blue (#2563eb).
- **Accents**: Orange Alerts (#f59e0b), Success Green (#10b981).
- **Aesthetics**: Glassmorphic cards, smooth shadows, and micro-animations.

## 🔮 Future Improvements
- Integration with live Logistics APIs.
- User authentication and role-based access.
- PDF generation for individual exception reports.
- Real-time notifications via WebSockets.
