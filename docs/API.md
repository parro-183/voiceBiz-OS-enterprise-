# voiceBiz-OS-enterprise API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints (except `/auth/*`) require a Bearer token:
```
Authorization: Bearer <token>
```

---

## 📝 Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}

Response:
{
  "message": "User registered successfully",
  "user": { "id": "user_xxx", "email": "...", "name": "...", "role": "..." },
  "token": "eyJ..."
}
```

### Register Agent
```
POST /auth/register-agent
Content-Type: application/json

{
  "email": "agent@example.com",
  "name": "Agent Smith"
}

Response:
{
  "message": "Agent registered successfully",
  "agent": { "id": "agent_xxx", "name": "...", "email": "...", "status": "available" },
  "token": "eyJ..."
}
```

---

## 👥 User Endpoints

### Get All Users
```
GET /users
Authorization: Bearer <token>

Response:
{
  "users": [...],
  "count": 5
}
```

### Get User by ID
```
GET /users/{userId}
Authorization: Bearer <token>

Response:
{
  "id": "user_xxx",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

### Update User
```
PUT /users/{userId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "role": "admin"
}

Response:
{
  "message": "User updated",
  "user": { ... }
}
```

---

## 📞 Call Endpoints

### Create Call
```
POST /calls
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "cust_123",
  "phoneNumber": "+1234567890"
}

Response:
{
  "message": "Call created",
  "call": {
    "id": "call_xxx",
    "customerId": "cust_123",
    "agentId": "agent_xxx",
    "status": "active",
    "startTime": "2026-07-25T10:00:00Z"
  }
}
```

### Get All Calls
```
GET /calls
Authorization: Bearer <token>

Response:
{
  "calls": [...],
  "count": 10
}
```

### Get Call by ID
```
GET /calls/{callId}
Authorization: Bearer <token>

Response:
{
  "id": "call_xxx",
  "customerId": "cust_123",
  "agentId": "agent_xxx",
  "status": "active"
}
```

### End Call
```
POST /calls/{callId}/end
Authorization: Bearer <token>

Response:
{
  "message": "Call ended",
  "call": { "id": "call_xxx", "status": "completed", "duration": 120 }
}
```

### Record Call
```
POST /calls/{callId}/record
Authorization: Bearer <token>
Content-Type: application/json

{
  "audioUrl": "https://s3.amazonaws.com/recordings/call_xxx.mp3"
}

Response:
{
  "message": "Recording added",
  "recording": { "id": "rec_xxx", "callId": "call_xxx" }
}
```

### Transcribe Call
```
POST /calls/{callId}/transcribe
Authorization: Bearer <token>

Response:
{
  "message": "Call transcribed",
  "transcription": "Thank you for calling voiceBiz"
}
```

### Analyze Sentiment
```
POST /calls/{callId}/sentiment
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "I'm very happy with your service!"
}

Response:
{
  "message": "Sentiment analyzed",
  "sentiment": { "sentiment": "positive", "score": 1, "confidence": 1 }
}
```

---

## 🤖 Agent Endpoints

### Get All Agents
```
GET /agents
Authorization: Bearer <token>

Response:
{
  "agents": [...],
  "count": 5
}
```

### Get Available Agents
```
GET /agents/available
Authorization: Bearer <token>

Response:
{
  "agents": [...],
  "count": 3
}
```

### Get Agent by ID
```
GET /agents/{agentId}
Authorization: Bearer <token>

Response:
{
  "id": "agent_xxx",
  "name": "Agent Smith",
  "status": "available",
  "currentCalls": 2,
  "maxCalls": 5
}
```

### Update Agent Status
```
PUT /agents/{agentId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "break"
}

Response:
{
  "message": "Agent status updated",
  "agent": { ... }
}
```

---

## 📊 Analytics Endpoints

### Get Call Metrics
```
GET /analytics/calls/metrics
Authorization: Bearer <token>

Response:
{
  "totalCalls": 150,
  "completedCalls": 145,
  "activeCalls": 5,
  "totalDuration": 45000,
  "avgDuration": 300,
  "timestamp": "2026-07-25T10:00:00Z"
}
```

### Get Agent Metrics
```
GET /analytics/agents/{agentId}
Authorization: Bearer <token>

Response:
{
  "agentId": "agent_xxx",
  "totalCalls": 50,
  "completedCalls": 48,
  "totalDuration": 10000,
  "avgDuration": 200,
  "sentiments": { "positive": 30, "neutral": 15, "negative": 3 },
  "timestamp": "2026-07-25T10:00:00Z"
}
```

### Get Sentiment Metrics
```
GET /analytics/sentiment/metrics
Authorization: Bearer <token>

Response:
{
  "totalAnalyzed": 48,
  "sentiments": { "positive": 30, "neutral": 15, "negative": 3 },
  "avgConfidence": 0.85,
  "timestamp": "2026-07-25T10:00:00Z"
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": true,
  "message": "Error description",
  "statusCode": 400,
  "timestamp": "2026-07-25T10:00:00Z"
}
```

---

## Status Codes

- **200** - OK
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **404** - Not Found
- **500** - Internal Server Error
