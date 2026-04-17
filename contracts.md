# API Contract & Backend Implementation Plan - Nexus CRM

## 1. Data Models (MongoDB)

### Contacts Collection
```json
{
  "id": "string (uuid/objectid)",
  "name": "string",
  "email": "string",
  "company": "string",
  "role": "string",
  "status": "string (Active, Lead, Customer, Cold)",
  "lastContacted": "datetime",
  "createdAt": "datetime"
}
```

### Deals Collection
```json
{
  "id": "string",
  "name": "string",
  "value": "number",
  "stage": "string (Discovery, Proposal, Negotiation, Closed Won)",
  "probability": "number",
  "company": "string",
  "contactId": "string (ref)",
  "createdAt": "datetime"
}
```

## 2. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Returns dashboard statistics (revenue, growth, counts) |
| GET | `/api/chart-data` | Returns revenue chart data points |
| GET | `/api/contacts` | List all contacts |
| POST | `/api/contacts` | Create a new contact |
| GET | `/api/deals` | List all deals |
| POST | `/api/deals` | Create a new deal |
| PATCH | `/api/deals/{id}` | Update deal stage/details |

## 3. Integration Plan
1. **Backend**: Implement FastAPI routes in `server.py` using `motor` for async MongoDB.
2. **Frontend**: 
   - Replace `mock.ts` imports with `useQuery` hooks from `@tanstack/react-query`.
   - Update `Dashboard.tsx`, `Contacts.tsx`, and `Deals.tsx` to fetch from real endpoints.
   - Implement "Add Contact" and "New Deal" modals with form submissions.

## 4. Mock Data Transition
- Initial seed script to populate MongoDB with the current mock data so the app isn't empty on first load.
- All frontend components will use `isLoading` states during data fetch.
