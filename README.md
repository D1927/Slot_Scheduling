# Doctor Appointment Scheduling Backend

A backend system for managing doctor appointment scheduling. The application allows doctors to announce and update their availability, automatically generates appointment slots, enables patients to book appointments, prevents double booking through concurrency-safe operations, and notifies affected patients when appointments are cancelled due to schedule changes.

---

# Architecture Overview

```
Doctor
   │
   ▼
Creates Availability
   │
   ▼
Generate Appointment Slots
   │
   ▼
Patient Views Available Slots
   │
   ▼
Patient Books Slot
   │
   ▼
Concurrency-safe Booking
   │
   ▼
Booking Stored
```

---

# Features

- Doctor registration and management
- Patient registration and management
- Doctor availability management
- Automatic slot generation
- Configurable slot duration
- Configurable buffer time
- View available appointment slots
- Book appointments
- Cancel appointments
- Update doctor availability
- Automatic regeneration of slots after availability updates
- Automatic cancellation of conflicting appointments
- Email notification to affected patients
- Concurrency-safe booking using MongoDB Transactions and Atomic Updates
- Generic CRUD handler for reusable controller logic

---

# Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemailer
- bcryptjs
- Morgan
- Cookie Parser

---

# Database Design

```
Doctor
   │
   │ 1:N
   ▼
Availability
   │
   │ 1:N
   ▼
Slot
   │
   │ 1:1
   ▼
Booking
   ▲
   │ N:1
Patient
```

---

# Setup Instructions

```bash
git clone <repository-url>

cd doctor-appointment-scheduling

npm install
```

Create a `.env` file:

```env
PORT=
MONGO_URI=
MAIL-HOST=
MAIL-PORT=
MAIL_USER=
MAIL-FROM=
MAIL_PASSWORD=
```

Run the server:


---

# Slot Generation

Whenever a doctor announces availability, the system automatically generates appointment slots.

Generated slots are **materialized** and stored in the database instead of being generated dynamically on every request. This improves read performance and simplifies concurrency-safe booking.

### Input

- Start Time
- End Time
- Slot Duration
- Buffer Time

### Example

Availability

```
09:00 AM - 11:00 AM
```

Slot Duration

```
20 Minutes
```

Buffer

```
5 Minutes
```

Generated Slots

```
09:00 - 09:20

09:25 - 09:45

09:50 - 10:10

10:15 - 10:35

10:40 - 11:00
```

---

# Appointment Booking

Patients can book only **Available** slots.

Booking flow:

- Verify slot availability.
- Start a MongoDB transaction.
- Atomically update slot status.
- Create the booking.
- Commit the transaction.

If any step fails, the transaction is rolled back.

This prevents multiple patients from booking the same appointment simultaneously.

---

# Updating Availability

When a doctor updates availability:

- Existing availability is updated.
- Booked appointments outside the updated schedule are identified.
- Conflicting bookings are cancelled.
- Notification emails are sent to affected patients.
- Invalid available slots are removed.
- New appointment slots are generated.

---

# Concurrency Handling

To prevent race conditions and double booking, appointment booking uses:

- MongoDB Transactions
- Atomic `findOneAndUpdate()` operations

The slot is updated only if its current status is **Available**. If another booking request has already reserved the slot, the update fails, ensuring only one booking succeeds.

---

# API Endpoints

## Doctor

| Method | Endpoint | Description |
|:------:|----------|-------------|
| POST | `/api/v1/doctor` | Register a doctor |
| GET | `/api/v1/doctor` | Retrieve all doctors |
| GET | `/api/v1/doctor/:id` | Retrieve doctor by ID |
| DELETE | `/api/v1/doctor/:id` | Delete doctor |

---

## Patient

| Method | Endpoint | Description |
|:------:|----------|-------------|
| POST | `/api/v1/patient` | Register a patient |
| GET | `/api/v1/patient` | Retrieve all patients |
| GET | `/api/v1/patient/:id` | Retrieve patient by ID |
| DELETE | `/api/v1/patient/:id` | Delete patient |

---

## Availability

| Method | Endpoint | Description |
|:------:|----------|-------------|
| POST | `/api/v1/availability` | Create doctor availability and generate slots |
| PATCH | `/api/v1/availability/:id` | Update availability, regenerate slots and notify affected patients |

---

## Slot

| Method | Endpoint | Description |
|:------:|----------|-------------|
| GET | `/api/v1/slot` | Retrieve appointment slots (supports filtering, sorting, field limiting and pagination) |

---

## Booking

| Method | Endpoint | Description |
|:------:|----------|-------------|
| POST | `/api/v1/booking` | Book an appointment slot |
| GET | `/api/v1/booking` | Retrieve bookings |
| PATCH | `/api/v1/booking/:id` | Cancel booking and release slot |

---

# Assumptions

- One booking is allowed per slot.
- Each slot belongs to only one doctor.
- Passwords are securely hashed before storage.
- Slots are generated automatically whenever availability is created or updated.
- Availability updates may automatically cancel conflicting appointments.
- Doctor availability currently spans a single calendar day.
- The system does not support priority booking.
- Appointment slots are materialized and stored in the database.

---

# Design Decisions

- Availability and Slot are modeled as separate entities.
- Appointment slots are generated during availability creation instead of being computed on demand.
- Booking references a Slot instead of storing duplicate appointment information.
- MongoDB references are used to maintain relationships between entities.
- Generic CRUD handlers are used where applicable to reduce duplicate controller logic.

---

# Trade-offs

- Materialized slots increase storage usage but simplify booking and improve read performance.
- Only single-day availability is supported to keep scheduling logic manageable.
- Email notifications are implemented, while SMS and push notifications are deferred.
- Authentication and authorization are intentionally omitted to keep the focus on scheduling logic and concurrency.

---

# Future Improvements

- JWT Authentication & Authorization
- Recurring Weekly Availability
- Waiting List Management
- Variable Appointment Duration
- SMS Notifications
- Real-time Notifications using WebSockets
- Admin Dashboard