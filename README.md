# Doctor Appointment Scheduling Backend

A backend system for managing doctor appointment scheduling. The application allows doctors to announce and update their availability, automatically generates appointment slots, enables patients to book appointments, prevents double booking through concurrency-safe operations, and notifies affected patients when appointments are cancelled due to schedule changes.

## Architecture Overview

Doctor creates availability
        │
        ▼
Generate Slots
        │
        ▼
Patient views available slots
        │
        ▼
Patient books slot
        │
        ▼
Concurrency-safe booking
        │
        ▼
Booking stored


## Features

- Doctor registration and management
- Patient registration and management
- Doctor availability management
- Automatic slot generation based on:
  - Start Time
  - End Time
  - Slot Duration
  - Buffer Time
- View available appointment slots
- Book appointments
- Cancel appointments
- Update doctor availability
- Automatic regeneration of slots after availability updates
- Automatic cancellation of appointments outside the updated availability
- Email notification to affected patients
- Concurrency-safe appointment booking using MongoDB transactions and atomic updates
- Generic CRUD handler for reusable controller logic

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemailer
- bcryptjs
- Morgan
- Cookie Parser

# Slot Generation

Whenever a doctor announces availability, the system automatically generates appointment slots. The generated slots are materialized and stored in the database instead of being computed on every request. This allows faster slot retrieval and simplifies concurrency-safe booking.

Input:

- Start Time
- End Time
- Slot Duration
- Buffer Time

Example

Availability

09:00 AM - 11:00 AM

Slot Duration : 20 minutes

Buffer : 5 minutes

Generated Slots

```
09:00 - 09:20

09:25 - 09:45

09:50 - 10:10

10:15 - 10:35

10:40 - 11:00
```

# Appointment Booking

Patients can book only **Available** slots.

During booking:

- Slot availability is verified.
- Slot status is atomically updated.
- Booking record is created.
- Transaction is committed.

This prevents multiple patients from booking the same slot simultaneously.


# Updating Availability

When a doctor updates availability:

- Existing availability is updated.
- Booked appointments outside the new schedule are identified.
- Affected bookings are cancelled.
- Notification emails are sent.
- Invalid available slots are removed.
- New slots are generated for the updated availability.


# Concurrency Handling

To prevent race conditions and double booking, appointment booking uses:

- MongoDB Transactions
- Atomic `findOneAndUpdate()` operations

This ensures that only one patient can successfully reserve a slot even if multiple booking requests are received simultaneously.


# API Endpoints

## Doctor

|   Method   | Endpoint             | Description                     |
| :--------: | -------------------- | ------------------------------- |
|  **POST**  | `/api/v1/doctor`     | Register a new doctor           |
|   **GET**  | `/api/v1/doctor`     | Retrieve all registered doctors |
|   **GET**  | `/api/v1/doctor/:id` | Retrieve a doctor by ID         |
| **DELETE** | `/api/v1/doctor/:id` | Delete a doctor by ID           |


## Patient

|   Method   | Endpoint              | Description                      |
| :--------: | --------------------- | -------------------------------- |
|  **POST**  | `/api/v1/patient`     | Register a new patient           |
|   **GET**  | `/api/v1/patient`     | Retrieve all registered patients |
|   **GET**  | `/api/v1/patient/:id` | Retrieve a patient by ID         |
| **DELETE** | `/api/v1/patient/:id` | Delete a patient by ID           |


## Availability

|   Method  | Endpoint                   | Description                                                                                 |
| :-------: | -------------------------- | ------------------------------------------------------------------------------------------- |
|  **POST** | `/api/v1/availability`     | Announce a doctor's availability and generate appointment slots                             |
| **PATCH** | `/api/v1/availability/:id` | Update an existing availability, regenerate slots, and notify affected patients if required |



## Slot

|  Method | Endpoint       |Description                                                                                   |
| --------| ---------------| -------------------------------------------------------------------------------------------  |
| **GET** | `/api/v1/slot` | Retrieve all appointment slots (supports filtering, sorting, field limiting, and pagination) |


---

## Booking

|   Method  | Endpoint              | Description                                                |
| :-------: | --------------------- | ---------------------------------------------------------- |
|  **POST** | `/api/v1/booking`     | Book an available appointment slot                         |
|  **GET**  | `/api/v1/booking`     | Retrieve all appointment bookings                          |
| **PATCH** | `/api/v1/booking/:id` | Cancel an existing appointment and release the booked slot |


# Assumptions

- One booking is allowed per slot.
- Each slot belongs to only one doctor.
- Passwords are securely hashed before storage.
- Availability updates may automatically cancel conflicting appointments.
- Slots are generated automatically from doctor availability.
- Doctor availability currently spans a single calendar day.
- The system does not support priority booking.

# Future Improvements

- Waiting List Management
- Variable Appointment Duration based on appointment type
- JWT Authentication & Authorization
- SMS Notifications
- Admin Dashboard
- Real-time Notifications using WebSockets
