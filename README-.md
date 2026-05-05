# Saha Event - Reservation Management System

A modern event space reservation platform built with React, Vite, Tailwind CSS, and Supabase.


## Mapping of Theme and Data Model

Saha Event is a reservation management system for event venues such as weddings, conferences, seminars, and private celebrations. The platform allows clients to create an account, browse available halls, choose an event date, submit a reservation request, receive payment instructions, and upload a payment receipt. Administrators can then review each request, validate payments, reject invalid reservations, and manage client feedback.

To facilitate correction, the project data model is mapped as follows:

### Table A – `profiles`

This table represents the users of the application, including clients and administrators. It stores the user identity and contact information:

- `id`: unique user identifier linked to Supabase Auth.
- `full_name`: full name of the user.
- `email`: email address used for authentication and communication.
- `phone`: phone number of the user.
- `role`: defines whether the user is a client or an administrator.

This table is important because each reservation must be linked to a specific client.

### Table B – `salles`

This table represents the event halls available for booking. Each hall contains structured information that helps users compare venues:

- `name`: name of the hall.
- `city`: location of the hall.
- `price_per_day`: fixed daily reservation price.
- `price_per_guest`: additional price calculated according to the number of guests.
- `capacity`: maximum number of guests accepted.
- `description`: textual description of the hall.
- `available`: indicates whether the hall can currently be booked.
- `images`: list of image URLs representing the hall.
- `amenities`: list of available services or equipment.
- `event_types`: list of event categories accepted by the hall.

This table represents the catalog of venues displayed to users.

### Table C – `reservations`

This table links a client from Table A to a hall from Table B. It stores the details and current state of each reservation request:

- `salle_id`: identifier of the selected hall.
- `client_id`: identifier of the client making the reservation.
- `event_date`: date selected for the event.
- `event_type`: type of event requested by the client.
- `guests_count`: number of expected guests.
- `total_price`: final calculated price of the reservation.
- `status`: current reservation state, such as pending, confirmed, payment uploaded, validated, or rejected.
- `notes`: optional message from the client.
- `admin_feedback`: optional response from the administrator.
- `receipt_url`: link to the uploaded payment receipt file when available.

This table is the central business table because it connects users, halls, dates, prices, and payment validation.

### File – Payment Receipt PDF

The file required in the project corresponds to the payment receipt uploaded by the client after receiving CCP payment instructions. This file is usually a PDF document stored in the Supabase `receipts` storage bucket. The `receipt_url` field in the `reservations` table points to this uploaded file.

Unlike the database tables, the receipt PDF is not structured in relational columns. It is a document file used as proof of payment.

## Architecture Analysis – Vercel + Supabase

### 1. Financial Choice: OPEX vs CAPEX

Using Vercel and Supabase is financially more logical for launching Saha Event than using a classical physical server because it follows an **OPEX** model instead of a heavy **CAPEX** model. With a traditional server or a local data center, the project owner must invest money before launch in machines, racks, storage, networking equipment, electricity, security, maintenance, and cooling. These are capital expenses because the infrastructure must be bought and managed directly.

With Vercel and Supabase, the project pays for services according to usage or subscription. This means the cost becomes operational and flexible. For a new reservation platform, user traffic is uncertain at the beginning, so it is safer to start with managed cloud services instead of buying expensive infrastructure. Vercel hosts the frontend, while Supabase provides the database, authentication, and file storage. This reduces the financial risk and allows the project to grow progressively.

### 2. Scalability: Vercel Compared to a Local Data Center

Vercel manages scalability automatically through cloud infrastructure and a global edge network. Static files are distributed and served close to users, while serverless functions can scale according to demand. If many users visit the application at the same time, Vercel can allocate more resources without the developer manually adding servers.

In a physical local data center, scalability is more complex. The owner must predict the required capacity, buy additional servers, install racks, configure networking, provide electricity, and maintain air conditioning to avoid overheating. This creates technical and financial pressure. Vercel removes most of these constraints because the infrastructure is managed by the cloud provider.

### 3. Structured and Unstructured Data in the Application

In Saha Event, structured data is represented by the relational tables stored in Supabase Postgres. Examples include users in `profiles`, halls in `salles`, and reservations in `reservations`. These data elements have clear fields, types, relationships, and can be searched, filtered, sorted, and linked using database queries.

Unstructured data is represented by uploaded files and media. The best example is the client payment receipt, usually uploaded as a PDF and stored in the Supabase `receipts` bucket. Hall images are represented in the database as image URLs, but the actual image files remain binary resources. These files do not have relational columns like a table, so they are considered unstructured data. Therefore, the application combines structured storage for business entities and file storage for documents and media.

