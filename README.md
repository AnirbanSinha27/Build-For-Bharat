# MGNREGA District Performance Dashboard

The **MGNREGA District Performance Dashboard** is a web application designed to make government data on the **Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)** easily accessible and understandable for citizens — especially those in rural India with low technical literacy.

## 🌍 Project Overview

The Government of India provides open APIs for the monthly performance of districts under the MGNREGS program. However, these datasets are often difficult for the general public to interpret or access directly.

This project solves that problem by visualizing MGNREGA data through an intuitive, localized, and mobile-friendly dashboard. Citizens can easily:
- View their district’s current performance metrics.
- Compare monthly or yearly trends.
- Understand key statistics through simple charts and visuals.
- (Optional) Automatically detect their district using geolocation.

---

## 🧭 Objectives

- Enable **transparent access** to MGNREGA data for all citizens.
- Design a **simple, intuitive interface** that caters to low-literacy users.
- Ensure **data availability and reliability**, even when APIs are down.
- Create a **production-ready, scalable** web app deployable for large-scale national use.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (React + TypeScript)
- **Styling:** Tailwind CSS, Lucide React Icons
- **Charts:** Recharts
- **API Integration:** MGNREGA Open API (data.gov.in)
- **Backend (optional):** Node.js/Express for caching and failover
- **Database:** MongoDB (for storing and caching API data)
- **Hosting:** Deployed on a VPS/VM environment

---

## ⚙️ Features

- 🔍 **District Selection:** Choose your state and district to view localized data.
- 📊 **Interactive Charts:** Monthly and yearly performance comparisons.
- 🕒 **Historical Data View:** Explore past performance trends.
- 📈 **Comparison Dashboard:** Compare your district’s progress with others.
- 📡 **Offline Cache & Failover:** Handles API downtime gracefully.
- 📍 **Geo-detection (Bonus):** Automatically detects user’s district via geolocation.
- 🌐 **Responsive Design:** Works seamlessly on both desktop and mobile.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/AnirbanSinha27/mgnrega-dashboard.git
cd mgnrega-dashboard
