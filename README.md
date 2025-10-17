# CSCI6313 Final Project – Web Development by IZHI CHEN

### 📚 Course Information
**Course:** CSCI 6313_01 – Web Development  
**Instructor:** Oklahoma City University  
**Project Type:** Final Examination (100 pts Total)  
**Author:** IZHI CHEN  

---

## 🧭 Overview
This repository contains my final web project for **CSCI6313**, which demonstrates responsive web design, form validation, Google Maps API integration, and accessibility optimization.  
The project is fully deployed on **GitHub Pages** and organized according to the five required parts of the final assignment.

---

## 🧩 Project Structure

| Part | Description | Key Features |
|------|--------------|---------------|
| **Part 01 – Home Page with CSS** | `index.html` | Semantic HTML, responsive layout, images with alt text, clean navigation header (`<site-header>`), and adaptive typography. |
| **Part 02 – Contact Form with Validation** | `contact.html` | Client-side validation for current, new, and confirm password fields. Enforces 9+ characters, 2 uppercase letters, and 1 special symbol. Includes “Change Address” button with alert feedback. |
| **Part 03 – Map with Top 5 Results** | `map.html` | Integrated **Google Maps JavaScript API + Places Library**. Displays top 5 nearby places (e.g., restaurants, bars) with numbered markers and clickable cards that focus the map marker. |
| **Part 04 – SEO & Accessibility Optimization** | `index.html` | Improved `<title>` and `<meta name="description">`, single `<h1>` hierarchy, logical `<h2>` usage, high-contrast color theme (≥4.5:1), keyboard-accessible navigation, and ARIA labels for buttons. |
| **Part 05 – GitHub Hosting + Documentation** | `/docs/` | Deployed via **GitHub Pages**. Includes screenshots and test reports (Lighthouse + WAVE). |

---

## 🌗 Additional Features
- **Responsive Design** — Works seamlessly on desktop and mobile screens.  
- **Theme Toggle** — Dark/Light mode switch implemented in `<site-header>` using CSS variables.  
- **Custom Web Component** — Reusable `<site-header>` element for consistent navigation across all pages.  
- **JavaScript Module Architecture** — Separate `.js` files for map, form, and header logic.  

---

## 🗂️ Documentation Path
All visual evidence and testing reports are located in the `/docs/` folder.

``` bash
/docs.html ← displays all screenshots & demo video
/docs/
├── screens/
│ ├── part01_home_desktop.png
│ ├── part01_home_mobile.png
│ ├── part02_form_invalid.png
│ ├── part02_form_valid.png
│ ├── part03_map_results.png
│ ├── part04_lighthouse.png
│ ├── part04_wave.png
│ └── part05_deployed_site.png
└── demo.mp4 ← recorded walkthrough of all features
```

---
You can also visit **`docs.html`** to view embedded screenshots and a short demo video showing each implemented feature.

---

## 🚀 Deployment
The site is hosted on **GitHub Pages**.  
You can view it here (example link):  
👉 [https://chairchen.github.io/CSCI6313_Final_IZHICHEN/](https://chairchen.github.io/CSCI6313_Final_IZHICHEN/)

---

## 🧠 Technologies Used
- **HTML5** (semantic structure)
- **CSS3** (Flexbox, media queries, OKLCH color model)
- **JavaScript (ES Modules)**
- **Google Maps JavaScript API + Places Library**
- **WCAG 2.1 AA Compliance**
- **GitHub Pages Deployment**

---

## ✅ Accessibility & SEO Reports
- Lighthouse score: *Accessibility 100 / SEO 100*  
- WAVE report: *0 Errors, 0 Contrast Issues*  
- All buttons and interactive elements have accessible names and visible focus states.

---

## 🏁 Author
**Name:** IZHI CHEN  
**Email:** izhi.chen@my.okcu.edu
**Date:** October 2025  
**Course:** CSCI6313 – Web Development

---

> “Built with semantic code, aesthetic design, and accessibility in mind.”