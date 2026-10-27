# ✨ EventSpark

**Make room for what's next.**

EventSpark is a web portal for a technology festival. Visitors can explore events, workshops, speakers, and festival information in one place. Attendees can create an account, register for events, and keep track of their activity. Event organizers can publish events and manage the events they own.

The project is designed for festival attendees, student communities, and organizers who need a single, easy-to-use place to discover activities and coordinate participation.

## 🎨 The look and feel

EventSpark uses a **cyberpunk-inspired, high-end tech-festival** visual theme: dark atmospheric surfaces, bright cyan and pink accents, glowing details, immersive imagery, and motion. The welcome screen introduces the experience; signing in opens the main festival portal.

## ⭐ Highlights

- **Welcome landing page:** A pre-authentication splash screen introduces the portal before visitors sign in or create an account.
- **Event discovery:** Browse and filter seeded events, view event details, and register for an event.
- **Organizer controls:** Signed-in users can publish events. Event creators and the configured admin can delete eligible events; the server enforces the ownership check.
- **Interactive profile:** View registrations and helpdesk activity, and open a registration to inspect its submitted details.
- **Festival content:** Browse a three-day schedule, speakers, highlights, statistics, sponsors, FAQs, and contact information.
- **Ready-to-explore sample data:** The backend seeds example events and festival content into MongoDB when it starts.
- **Account security:** Passwords are hashed, protected API routes use JWT authentication, and password recovery can be enabled with SMTP settings.

## 🧰 Technology

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Fetch API, Framer Motion |
| Backend | Node.js, Express, Mongoose, bcryptjs, JWT, Nodemailer |
| Database | MongoDB — default URI: `mongodb://localhost:27017/eventspark` |

## 📁 Project structure

```text
PRN-25070521030/
├── client/
│   ├── public/                 # Static files served by Vite
│   └── src/
│       ├── components/         # Shared navigation, layout, and UI
│       ├── pages/              # Application screens
│       ├── utils/              # Shared frontend helpers and fallback data
│       ├── App.jsx             # Routes and providers
│       └── api.js              # Frontend API requests
├── server/
│   ├── models/                 # Mongoose schemas
│   ├── .env.example            # Backend configuration template
│   ├── seedData.js             # Example festival records
│   ├── seed.js                 # Repeat-safe database seeder
│   └── server.js               # Express API and application startup
├── .gitignore
└── README.md
```

## 🚀 Set up and run locally

These instructions are for Windows PowerShell. Keep the backend and frontend running in **two separate terminal windows**.

### 1. Install the prerequisites

Install:

- **Node.js 20.19 or newer** (or Node.js 22.12 or newer). This includes `npm`.
- **MongoDB Community Server** for the local database.
- **MongoDB Compass** (optional) to view and inspect your database.

> Compass is a database viewer and connection tool; it does not replace MongoDB Community Server. Start the MongoDB server before starting EventSpark. The default local connection is `mongodb://localhost:27017/eventspark`.

If you already have this project open in VS Code, open a terminal at the project folder. Otherwise, clone the repository and enter its folder:

```powershell
git clone https://github.com/<YOUR-USERNAME>/PRN-25070521030.git
cd PRN-25070521030
```

Replace `<YOUR-USERNAME>` with the GitHub account or organization that hosts the repository.

### 2. Start MongoDB

Start the **MongoDB Community Server** service using the method available on your computer. If MongoDB Compass is installed, connect to:

```text
mongodb://localhost:27017
```

Compass should connect successfully before you continue. EventSpark uses the `eventspark` database on this server and creates its collections as needed.

If you installed MongoDB as a Windows service and it is stopped, you can check and start it from an elevated PowerShell window:

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

Starting the service may require Administrator permission. If the service has a different name on your computer, use the MongoDB installation's service name instead.

### 3. Configure and start the backend

In the first terminal, move into the server folder and create your local environment file:

```powershell
cd server
Copy-Item .env.example .env
```

Open `server/.env` and check these settings:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eventspark
JWT_SECRET=replace-this-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
EVENT_ADMIN_EMAIL=
```

Change `JWT_SECRET` to a long, unique value before using the app beyond local development. You can generate one with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Optionally set `EVENT_ADMIN_EMAIL` to the email address of the administrator account. The admin can manage seeded events; other users can manage events they created. Keep `.env` private and never commit it.

Install dependencies and run the API:

```powershell
npm install
npm start
```

The backend runs at <http://localhost:5000>. On startup it connects to MongoDB and seeds the example festival data.

### 4. Install and start the frontend

Open a **second** terminal at the project root and run:

```powershell
cd client
npm install
npm run dev
```

Open the address printed by Vite, usually <http://localhost:5173>. The Vite development server forwards `/api` requests to the backend on port `5000`.

### 5. Try the application

1. Open <http://localhost:5173> to see the welcome page.
2. Choose **Sign in** or create an account at `/signup`.
3. Browse the events, schedule, speakers, and festival information.
4. Register for an event and check your profile for the registration details.
5. To publish an event, sign in and open `/add-event`. Manage events at `/manage`.

## 🗃️ Sample data and database seeding

The backend automatically seeds MongoDB when it starts. To run the repeat-safe seeder manually, open a terminal and run:

```powershell
cd server
npm run seed
```

Seed content includes:

- Example events across hackathons, AI/ML, cybersecurity, physics, design, robotics, and workshops
- A three-day schedule with 14 time slots
- Four speaker profiles
- Festival description, statistics, and image-backed highlights
- Six illustrative sponsors across title, tech, media, and community tiers

The seed operation is repeat-safe: it avoids duplicating seeded events, speakers, schedule days, and sponsors. Event IDs are created by MongoDB, so event links and registrations use database records.

Sponsor names and `.example` websites are illustrative demo content, not real companies or confirmed endorsements. Event and highlight photos use Unsplash URLs, so displaying those photos requires internet access. Cards retain their visual styling when an image fails to load; sponsor logos use monogram fallbacks.

## 🧭 Application pages

| Route | Page |
| --- | --- |
| `/` | Welcome splash |
| `/signin`, `/login` | Sign in |
| `/signup` | Create account |
| `/forgot-password` | Request or complete a password reset |
| `/home` | Festival landing page and countdown |
| `/events` | Searchable, filterable event catalog |
| `/events/:id` | Event details |
| `/register-event` | Event registration |
| `/schedule` | Three-day festival schedule |
| `/speakers` | Speaker profiles |
| `/about` | Festival information, statistics, and highlights |
| `/add-event` | Publish an event |
| `/manage` | Organizer event management |
| `/profile` | Account, registrations, and helpdesk history |
| `/sponsors` | Sponsors and partners |
| `/gallery` | Festival highlights |
| `/contact` | Helpdesk contact form |
| `/faq` | Frequently asked questions |
| `/developer` | Project creator information |

## 🔌 API overview

The backend API runs at `http://localhost:5000`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Create an account |
| `POST` | `/api/auth/login` | Authenticate and issue a JWT |
| `POST` | `/api/auth/forgot-password` | Request a password-reset email |
| `POST` | `/api/auth/reset-password` | Set a password with a valid reset token |
| `GET` | `/api/events` | List active events |
| `GET` | `/api/events/:id` | Fetch event details |
| `POST` | `/api/events` | Create an event (sign-in required) |
| `DELETE` | `/api/events/:id` | Delete as the event creator or configured admin |
| `GET` | `/api/schedule` | Fetch the festival schedule |
| `GET` | `/api/speakers` | Fetch active speakers |
| `GET` | `/api/festival-info` | Fetch festival description, stats, and highlights |
| `GET` | `/api/sponsors` | Fetch active sponsor and partner listings |
| `POST` | `/api/register` | Register for an event |
| `POST` | `/api/contact` | Submit a helpdesk query |
| `GET` | `/api/user/activity?email=USER_EMAIL` | Fetch the signed-in user's registrations and queries |

## ✅ Validate your setup

In the `client` folder, run the available lint and production-build checks:

```powershell
npm run lint
npm run build
```

In the `server` folder, check the main backend files for JavaScript syntax errors:

```powershell
node --check server.js
node --check seed.js
node --check seedData.js
```

There is not currently an automated backend test suite. For a basic local API check, with MongoDB and the backend running, visit <http://localhost:5000/> and check that `/api/events`, `/api/schedule`, `/api/speakers`, `/api/festival-info`, and `/api/sponsors` return JSON successfully.

Build and syntax checks do not test every user flow. Database-backed actions require MongoDB to be running. Password recovery additionally requires valid SMTP settings.

## ✉️ Optional email configuration

Password recovery requires an SMTP email account. Configure these values in `server/.env`:

```dotenv
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=EventSpark <no-reply@example.com>
```

Reset tokens are stored as hashes, expire after 15 minutes, and can be used once. Without working SMTP credentials, password-reset email delivery will not work.

## 🧱 MongoDB collections

The application creates these collections as needed:

- `users`
- `events`
- `registrations`
- `contacts`
- `speakers`
- `scheduledays`
- `festivalinfos`
- `sponsors`




Do **not** commit `node_modules`, `server/.env`, passwords, or production secrets. The checked-in `server/.env.example` contains placeholders for local configuration.
