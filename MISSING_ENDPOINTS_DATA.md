## Backend API Gaps (Action Required)

This section tracks backend response fields/endpoints the frontend currently needs but does not receive yet.

### 1) Farm owner identity is missing on cooperative farms

- **Endpoint:** `GET /cooperatives/farms`
- **Problem:** Farm records do not include owner identity details, so farm cards cannot reliably display owner name/initials.
- **Required field(s):**
  - `ownerName: string` (preferred)
  - `ownerInitials: string` (optional if `ownerName` is present; frontend can derive initials)
- **Current impact:** UI falls back to placeholder owner labels, causing inaccurate farm ownership display.

**Suggested response shape addition:**

```json
{
  "id": "farm_123",
  "name": "North Field",
  "state": "Oyo",
  "totalArea": 12.5,
  "areaUnit": "ha",
  "ownerName": "Amina Bello",
  "ownerInitials": "AB"
}
```

### 2) Farm owner identity is missing on farmer farms list

- **Endpoint:** `GET /farms`
- **Problem:** Farm records are missing display-ready owner identity, but several pages need to show the farmer/person in charge.
- **Required field(s):**
  - `ownerName: string`
  - `ownerInitials: string` (optional if `ownerName` is present)

### 3) Purchases list needs display-ready relational data

- **Endpoint:** `GET /purchases`
- **Problem:** Purchase rows currently return IDs (`fromUserId`, `toUserId`, `farmProductId`, `batchProductId`) but UI table needs human-readable values:
  - `farmer` (name)
  - `farm` (name)
  - `beneficiary` (name)
  - `account` (payment/account label)
  - `amount` (formatted or reliably computable)
- **Current impact:** frontend can only show raw IDs or placeholders, which does not match expected purchase table format.

**Suggested options (either is fine):**

1. **Preferred:** enrich `GET /purchases` response with display fields:

```json
{
  "id": "purchase_123",
  "createdAt": "2026-01-07T09:00:00.000Z",
  "fromUserId": "user_1",
  "toUserId": "user_2",
  "fromUserName": "Farmer A",
  "toUserName": "Olamide Olutekunbi",
  "farmName": "Baba Beji Farms",
  "accountLabel": "Cash",
  "totalPrice": 5000,
  "currency": "NGN"
}
```

2. **Alternative:** provide lookup endpoints to resolve IDs:
   - `GET /users/:id` (or `POST /users/batch` for bulk lookup)
   - `GET /farms/:id` includes `name`
   - `GET /accounts/:id` includes account/payment label

### 4) Upload Endpoint gives 500 Error