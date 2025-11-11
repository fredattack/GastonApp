# API Documentation

This document provides comprehensive documentation for the GastonApp backend API endpoints, request/response formats, and data models.

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Data Models](#data-models)
- [API Endpoints](#api-endpoints)
  - [Events API](#events-api)
  - [Models API (Pets)](#models-api-pets)
  - [AI API](#ai-api)
- [Request Examples](#request-examples)
- [Response Examples](#response-examples)

---

## Overview

The GastonApp API is a RESTful API built with Laravel that provides endpoints for managing pets, events, and AI-powered features. All responses are returned in JSON format.

### API Version

Current Version: **1.0** (Unreleased)

### Content Type

All requests must include:
```
Content-Type: application/json
```

---

## Base URL

The base URL varies by environment:

| Environment | Base URL |
|-------------|----------|
| **Development** | `http://localhost:8000` |
| **Production** | `https://api.gastonapp.com` (example) |

Configure the base URL in your `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

---

## Authentication

**Current Status**: Authentication is in development. The current implementation uses a placeholder owner ID.

**Future Implementation**: Firebase Authentication with JWT tokens

### Planned Authentication Flow

```http
Authorization: Bearer <firebase-jwt-token>
```

All authenticated requests will require a valid Firebase token in the Authorization header.

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `204` | No Content | Request succeeded, no content to return |
| `400` | Bad Request | Invalid request parameters |
| `401` | Unauthorized | Authentication required or failed |
| `404` | Not Found | Resource not found |
| `422` | Unprocessable Entity | Validation errors |
| `500` | Internal Server Error | Server error |

### Error Handling in Client

```typescript
try {
  const response = await axiosClient.get('/events');
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error(error.response.data.message);
  } else if (error.request) {
    // No response received
    console.error('Network error');
  } else {
    // Other error
    console.error(error.message);
  }
}
```

---

## Data Models

### Pet (Model)

```typescript
interface Pet {
  id: string;                    // Unique identifier
  name: string;                  // Pet name (unique per owner)
  species: "dog" | "cat" | string;  // Pet species
  breed: string;                 // Pet breed
  birthDate: string;             // Birth date (YYYY-MM-DD)
  ownerId: string;               // Owner's user ID
  isActive: boolean;             // Active status (default: true)
  order: number;                 // Display order
  photo?: string;                // Profile photo URL
  galerie?: string[];            // Photo gallery URLs
  created_at: string;            // Creation timestamp
  pivot?: PetDetails[];          // Related event details
}
```

### Event

```typescript
interface Event {
  id: string;                    // Unique identifier
  master_id: string;             // Master event ID (for recurring events)
  petId: string;                 // Associated pet ID
  title: string;                 // Event title
  type: "medical" | "feeding" | "appointment" | "training" | "social";
  start_date: Date | string;     // Start date/time
  end_date?: Date | string;      // End date/time (optional)
  is_full_day: boolean;          // All-day event flag
  is_recurring: boolean;         // Recurring event flag
  is_done: boolean;              // Completion status
  recurrence?: Recurrence;       // Recurrence pattern
  event_items?: EventItem[];     // Associated items
  notes?: string;                // Additional notes
  pets: Pet[];                   // Associated pets
  created_at: Date;              // Creation timestamp
}
```

### Recurrence

```typescript
interface Recurrence {
  frequency_type: "daily" | "weekly" | "monthly" | string;
  frequency: number;             // Interval (e.g., every 2 days)
  end_date?: Date | string;      // End date for recurrence
  occurrences?: number;          // Number of occurrences
  days?: string[];               // Days of week (for weekly recurrence)
}
```

### EventItem

```typescript
interface EventItem {
  type: "medication" | "food" | "prestataire" | "other";
  id: string;                    // Item identifier
  parent_id: string;             // Parent item identifier
  unit: string;                  // Unit of measurement
  quantity: string;              // Quantity
  notes: string;                 // Additional notes
}
```

### AI Response

```typescript
interface AIResponse {
  score: number;                 // Confidence score (0-1)
  requestType: "createEvent" | "updateEvent" | "deleteEvent" | "query";
  description: string;           // Human-readable description
  data: AIEventData;             // Structured event data
}
```

---

## API Endpoints

### Events API

#### 1. Get Events for Period

Fetch events within a specific date range for calendar display.

**Endpoint**: `GET /events/for-calendar`

**Query Parameters**:
```typescript
{
  filters: {
    start_date: string;  // ISO date string (e.g., "2025-11-01T00:00:00Z")
    end_date: string;    // ISO date string (e.g., "2025-11-30T23:59:59Z")
  }
}
```

**Request Example**:
```http
GET /events/for-calendar?filters[start_date]=2025-11-01T00:00:00Z&filters[end_date]=2025-11-30T23:59:59Z
```

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "evt_123",
      "master_id": "evt_master_456",
      "title": "Morning Walk",
      "type": "training",
      "petId": "pet_789",
      "start_date": "2025-11-11T08:00:00Z",
      "end_date": "2025-11-11T08:30:00Z",
      "is_full_day": false,
      "is_recurring": true,
      "is_done": false,
      "recurrence": {
        "frequency_type": "daily",
        "frequency": 1,
        "days": []
      },
      "pets": [
        {
          "id": "pet_789",
          "name": "Max",
          "species": "dog",
          "breed": "Golden Retriever"
        }
      ],
      "notes": "Bring water",
      "created_at": "2025-11-01T10:00:00Z"
    }
  ]
}
```

**Errors**:
- `400 Bad Request` - Missing or invalid date parameters
- `500 Internal Server Error` - Server error

---

#### 2. Change Event Completion Status

Toggle the completion status of an event.

**Endpoint**: `POST /events/change-done-status`

**Request Body**:
```json
{
  "id": "evt_123",
  "master_id": "evt_master_456",
  "is_done": true,
  "date": "2025-11-11T08:00:00Z"
}
```

**Response**: `200 OK`
```json
{
  "id": "evt_123",
  "is_done": true
}
```

**Errors**:
- `400 Bad Request` - Invalid request body
- `404 Not Found` - Event not found
- `500 Internal Server Error` - Server error

---

#### 3. Update Event

Update an existing event, optionally including all recurrences.

**Endpoint**: `PUT /events/:id`

**Path Parameters**:
- `id` - Event ID or master_id for recurring events

**Query Parameters**:
- `with_recurrences` (boolean) - Update all recurrences (default: false)
- `date` (string) - Specific date for single occurrence update

**Request Body**:
```json
{
  "id": "evt_123",
  "master_id": "evt_master_456",
  "title": "Evening Walk",
  "type": "training",
  "petId": "pet_789",
  "start_date": "2025-11-11T18:00:00Z",
  "end_date": "2025-11-11T18:30:00Z",
  "is_full_day": false,
  "is_recurring": true,
  "recurrence": {
    "frequency_type": "daily",
    "frequency": 1
  },
  "notes": "Updated walk time",
  "pets": [
    {
      "id": "pet_789",
      "pivot": {
        "item": "leash",
        "quantity": "1",
        "notes": "Blue leash"
      }
    }
  ]
}
```

**Response**: `200 OK`
```json
{
  "message": "Event updated successfully"
}
```

**Errors**:
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Event not found
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

---

#### 4. Delete Event

Delete an event.

**Endpoint**: `DELETE /events/:id`

**Path Parameters**:
- `id` - Event ID to delete

**Response**: `204 No Content`

**Errors**:
- `404 Not Found` - Event not found
- `500 Internal Server Error` - Server error

---

### Models API (Pets)

The Models API uses a generic collection-based approach where "models" refers to pets.

#### 1. Get All Models (Pets)

Fetch all pets for a specific owner.

**Endpoint**: `GET /:collection`

**Path Parameters**:
- `collection` - Collection name (e.g., "models", "pets")

**Query Parameters**:
- `ownerId` (string) - Owner's user ID (required)

**Request Example**:
```http
GET /models?ownerId=user_123
```

**Response**: `200 OK`
```json
[
  {
    "id": "pet_789",
    "name": "Max",
    "species": "dog",
    "breed": "Golden Retriever",
    "birthDate": "2020-05-15",
    "ownerId": "user_123",
    "isActive": true,
    "order": 1,
    "photo": "https://storage.example.com/pets/max.jpg",
    "galerie": [
      "https://storage.example.com/pets/max-1.jpg",
      "https://storage.example.com/pets/max-2.jpg"
    ],
    "created_at": "2025-01-01T10:00:00Z"
  }
]
```

**Errors**:
- `400 Bad Request` - Missing ownerId parameter
- `401 Unauthorized` - User not authenticated
- `500 Internal Server Error` - Server error

---

#### 2. Get Model by ID

Fetch a specific pet by ID.

**Endpoint**: `GET /:collection/:id`

**Path Parameters**:
- `collection` - Collection name (e.g., "models")
- `id` - Pet ID

**Request Example**:
```http
GET /models/pet_789
```

**Response**: `200 OK`
```json
{
  "id": "pet_789",
  "name": "Max",
  "species": "dog",
  "breed": "Golden Retriever",
  "birthDate": "2020-05-15",
  "ownerId": "user_123",
  "isActive": true,
  "order": 1,
  "photo": "https://storage.example.com/pets/max.jpg",
  "created_at": "2025-01-01T10:00:00Z"
}
```

**Errors**:
- `400 Bad Request` - Missing or invalid ID
- `404 Not Found` - Pet not found
- `500 Internal Server Error` - Server error

---

#### 3. Create Model (Pet)

Create a new pet.

**Endpoint**: `POST /:collection`

**Path Parameters**:
- `collection` - Collection name (e.g., "models")

**Request Body**:
```json
{
  "name": "Luna",
  "species": "cat",
  "breed": "Siamese",
  "birthDate": "2021-03-20",
  "ownerId": "user_123",
  "isActive": true,
  "order": 2
}
```

**Response**: `201 Created`
```json
{
  "id": "pet_890"
}
```

**Errors**:
- `400 Bad Request` - Invalid request data
- `422 Unprocessable Entity` - Validation errors (e.g., duplicate name)
- `500 Internal Server Error` - Server error

---

#### 4. Update Model (Pet)

Update an existing pet.

**Endpoint**: `PUT /:collection/:id`

**Path Parameters**:
- `collection` - Collection name (e.g., "models")
- `id` - Pet ID

**Request Body**:
```json
{
  "name": "Luna",
  "breed": "Siamese Mix",
  "isActive": true
}
```

**Response**: `200 OK`
```json
{
  "message": "Pet updated successfully"
}
```

**Errors**:
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Pet not found
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

---

#### 5. Delete Model (Pet)

Delete a pet.

**Endpoint**: `DELETE /:collection/:id`

**Path Parameters**:
- `collection` - Collection name (e.g., "models")
- `id` - Pet ID

**Query Parameters**:
- `with-recurrence` (boolean) - Delete associated recurring events
- `date` (string) - Specific date for event deletion

**Request Example**:
```http
DELETE /models/pet_890?with-recurrence=true
```

**Response**: `204 No Content`

**Errors**:
- `404 Not Found` - Pet not found
- `500 Internal Server Error` - Server error

---

### AI API

#### 1. Send Prompt

Send a text prompt to the AI assistant for processing.

**Endpoint**: `POST /ai`

**Request Body**:
```json
{
  "prompt": "Create a feeding event for Max tomorrow at 8 AM",
  "filters": {
    "ownerId": "user_123"
  }
}
```

**Response**: `200 OK`
```json
{
  "score": 0.95,
  "requestType": "createEvent",
  "description": "I'll create a feeding event for Max tomorrow at 8:00 AM.",
  "data": {
    "title": "Feeding - Max",
    "type": "feeding",
    "petId": ["pet_789"],
    "start_date": "2025-11-12T08:00:00Z",
    "end_date": null,
    "is_recurring": false,
    "is_full_day": false,
    "pets": [
      {
        "id": 789,
        "pivot": {
          "item": "kibble",
          "quantity": "2 cups",
          "notes": ""
        }
      }
    ],
    "notes": ""
  }
}
```

**Errors**:
- `400 Bad Request` - Empty or invalid prompt
- `500 Internal Server Error` - AI service error

---

#### 2. Send Contextual Messages

Send a conversation with context for multi-turn dialogues.

**Endpoint**: `POST /ai`

**Request Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "I have a dog named Max"
    },
    {
      "role": "assistant",
      "content": "Great! What would you like to do for Max?"
    },
    {
      "role": "user",
      "content": "Set up a daily feeding schedule at 8 AM and 6 PM"
    }
  ],
  "filters": {
    "ownerId": "user_123"
  }
}
```

**Response**: Same format as Send Prompt

---

#### 3. Stream AI Response

Get a streaming response from the AI (Server-Sent Events).

**Endpoint**: `POST /ai/stream`

**Request Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Tell me about my upcoming events this week"
    }
  ]
}
```

**Response**: `200 OK` (Server-Sent Events)

```
data: {"chunk": "You have "}
data: {"chunk": "3 upcoming "}
data: {"chunk": "events this week: "}
data: {"chunk": "feeding Max tomorrow, vet appointment on Wednesday, and training session on Friday."}
data: {"done": true, "response": {...}}
data: [DONE]
```

**Fallback Behavior**:
- If streaming endpoint is not available (404), the client automatically falls back to the regular `/ai` endpoint
- The response is simulated as a stream by word-by-word delivery

---

## Request Examples

### Using Axios

```typescript
import axiosClient from './providers/apiClientProvider/axiosClient';

// Get events for a period
const events = await axiosClient.get('/events/for-calendar', {
  params: {
    filters: {
      start_date: '2025-11-01T00:00:00Z',
      end_date: '2025-11-30T23:59:59Z'
    }
  }
});

// Create a pet
const newPet = await axiosClient.post('/models', {
  name: 'Luna',
  species: 'cat',
  breed: 'Siamese',
  birthDate: '2021-03-20',
  ownerId: 'user_123'
});

// Update event
await axiosClient.put('/events/evt_123?with_recurrences=false', {
  title: 'Updated Event',
  start_date: '2025-11-12T10:00:00Z'
});

// Send AI prompt
const aiResponse = await axiosClient.post('/ai', {
  prompt: 'Schedule a vet appointment for Max next week',
  filters: { ownerId: 'user_123' }
});
```

### Using Fetch

```typescript
// Get events
const response = await fetch(
  `${API_URL}/events/for-calendar?filters[start_date]=2025-11-01T00:00:00Z&filters[end_date]=2025-11-30T23:59:59Z`,
  {
    headers: {
      'Content-Type': 'application/json'
    }
  }
);
const data = await response.json();

// Create event with POST
const createResponse = await fetch(`${API_URL}/events`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Morning Walk',
    type: 'training',
    petId: 'pet_789',
    start_date: '2025-11-12T08:00:00Z'
  })
});
```

---

## Response Examples

### Success Response - Event Created

```json
{
  "id": "evt_123",
  "message": "Event created successfully"
}
```

### Success Response - Events List

```json
{
  "data": [
    {
      "id": "evt_123",
      "title": "Morning Walk",
      "type": "training",
      "start_date": "2025-11-11T08:00:00Z",
      "is_done": false
    },
    {
      "id": "evt_124",
      "title": "Vet Appointment",
      "type": "medical",
      "start_date": "2025-11-13T14:00:00Z",
      "is_done": false
    }
  ]
}
```

### Error Response - Validation Error

```json
{
  "error": "Validation Error",
  "message": "The name field is required.",
  "errors": {
    "name": ["The name field is required."],
    "birthDate": ["The birth date must be a valid date."]
  }
}
```

### Error Response - Not Found

```json
{
  "error": "Not Found",
  "message": "The requested event was not found.",
  "code": "EVENT_NOT_FOUND"
}
```

### Error Response - Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred. Please try again later.",
  "code": "SERVER_ERROR"
}
```

---

## Rate Limiting

**Current Status**: Not implemented

**Planned**:
- 100 requests per minute per user
- 1000 requests per hour per user
- AI endpoints: 20 requests per minute

Rate limit headers will be included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699564800
```

---

## Pagination

**Current Status**: Not implemented

**Planned Format**:
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "last_page": 8
  },
  "links": {
    "first": "/api/events?page=1",
    "last": "/api/events?page=8",
    "prev": null,
    "next": "/api/events?page=2"
  }
}
```

---

## Webhooks

**Current Status**: Not implemented

**Planned**: Webhook notifications for:
- Event reminders
- Recurring event creation
- AI-generated suggestions

---

## Versioning

**Current Status**: Single version (v1)

**Future**: API versioning will be implemented via URL path:
- `/v1/events`
- `/v2/events`

---

## Additional Resources

- **[README.md](README.md)** - Project overview
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

---

## Support

For API issues or questions:
- **GitHub Issues**: [https://github.com/fredattack/GastonApp/issues](https://github.com/fredattack/GastonApp/issues)
- **Email**: support@gastonapp.com (example)

---

**Last Updated**: November 11, 2025
**API Version**: 1.0 (Unreleased)
