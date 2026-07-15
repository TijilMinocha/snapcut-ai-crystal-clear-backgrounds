# SnapCut AI - Crystal Clear Backgrounds

Remove backgrounds with clean, high-quality results, no complex tools required.

---

## About the Project

SnapCut AI is a modern web application that enables instant background removal using AI-powered APIs, combined with a thoughtfully designed workflow for speed, reliability, and usability.

This is a *vibe-coded* project - but not the kind where you just sit back and watch. It’s a deliberate mix of leveraging AI tools efficiently and making hands-on engineering decisions to ensure everything works seamlessly in a real-world setup.

---

## Live Demo

[Checkout the Website](https://snapcut-ai-bg-remover.vercel.app/)

---

## Features

* One-click background removal
* Fast processing using AI APIs
* Cloud storage for processed images
* Secure authentication and user management
* Easy download of processed images
* Automated backend workflows
* Clean and responsive UI

---

## Tech Stack

### Frontend

* React with TypeScript
* Tailwind CSS

### Backend & Automation

* n8n (workflow automation)

### Services & APIs

* Clipdrop API (background removal)
* Cloudinary (image storage & delivery)
* Supabase (database, authentication, authorization)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TijilMinocha/snapcut-ai-crystal-clear-backgrounds.git
cd snapcut-ai-crystal-clear-backgrounds
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file and add:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIPDROP_API_KEY=
```

### 4. Run the development server

```bash
npm run dev
```

---

## Future Plans

* Batch image processing
* Custom background replacement
* Payment gateway integration for Pro plan upgrades

---

## Final Note

SnapCut AI brings together automation, AI capabilities, and practical engineering to solve a real problem efficiently. While AI tools accelerated parts of the development, the system design, integration, and overall execution required deliberate thinking and hands-on work-making it a balanced blend of smart tooling and solid development.
