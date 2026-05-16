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

### 4) Record operation endpoint rejects valid cycle/farm flow

- **Endpoint:** `POST /farms/:farmId/operations`
- **Observed errors:**
  - `{"success":false,"message":"Invalid crop Cycle ID for this farm"}`
  - intermittent `500` when logging operations from record-operation forms
- **Problem:** Frontend uses crop cycles selected from farm cycle lists, but backend rejects pairing during operation logging.
- **Current impact:** users cannot reliably record pre-harvest or post-harvest operations.
- **Backend action requested:**
  - confirm expected request contract (required fields and formats):
    - `cropCycleId`
    - `operationType`
    - `operationDate`
    - `description`
  - ensure cycle ownership validation matches cycle IDs returned by `GET /farms/:id/crop-cycles`
  - return stable 4xx validation errors (not 500) with actionable message when payload is invalid

### 5) Certification upload path can duplicate `/api`

- **Endpoints involved:**
  - `POST /upload` (returns relative file path)
  - certification upload/submit flows consuming uploaded document URLs
- **Observed issue:** with `VITE_API_BASE_URL` ending in `/api/`, upload path values like `/api/upload/file/...` can become `.../api/api/upload/file/...` when joined.
- **Current impact:** certification document upload/submit fails due to invalid URL paths.
- **Backend action requested:**
  - return canonical upload path format consistently (prefer `upload/file/...` without leading `/api`)
  - document expected path format in API docs and model descriptions

### 6) Processor endpoints appear to require org header (undocumented)

- **Endpoints observed:** `/processors/*` (dashboard stats, batches, batch products)
- **Observed behavior:** requests may fail unless `X-Organization-Id` header is present.
- **Observed error response:** `{"success": false, "message": "No active organization context. Provide X-Organization-Id header."}`
- **Problem:** OpenAPI generated client does not document this header requirement, so calls fail in environments where org context is not implicitly resolved.
- **Current frontend mitigation:** sends `X-Organization-Id` from local storage (`agrolinking_organization_id`) or `VITE_DEFAULT_ORGANIZATION_ID`.
- **Backend action requested:**
  - confirm whether `X-Organization-Id` is mandatory for processor routes
  - if mandatory, add it to OpenAPI operation parameters and error docs
  - if not mandatory, resolve org context from token server-side consistently

### 7) Processor certification readiness page is mocked

- **Route/Page:** `/processor/certifications/readiness`
- **Current frontend status:** UI uses hardcoded stat values and a placeholder empty-state flow; no live readiness data is fetched.
- **Problem:** users cannot view real certification readiness progress for processor products.
- **Backend action requested:**
  - provide a readiness endpoint for processor certifications (per product and summary counts), or confirm an existing endpoint we should use
  - include fields for:
    - total certifications
    - in progress
    - completed
    - pending review
    - product-level readiness checklist/status rows

### 8) Farmer Dashboard Stats Returning 500

- **Endpoint:** `GET /farmers/dashboard/stats`
- **Problem:** The endpoint consistently returns a 500 Internal Server Error, preventing the farmer dashboard from loading real metrics.
- **Current impact:** The farmer dashboard remains in a loading state or falls back to generic placeholders.

### 9) Missing Endpoints & Fields for Product Transfer Workflow (No. 1)

- **Workflow:** Initiator creates an open transfer -> Transporter accepts -> Initiator marks ready for pickup -> Transporter scans QR code to take custody.
- **Problem 1 (Missing `transporterId` & `transporterName`):** The `Transfer` object currently only tracks `fromUserId` and `toUserId` (the buyer). When a transporter accepts an offer, the backend needs a way to track the assigned transporter.
- **Problem 2 (Missing Statuses):** The `UpdateTransferStatusRequestStatus` enum lacks `ready_for_pickup`.
- **Problem 3 (Missing QR Code/Handover Endpoint):** There is no endpoint to cryptographically verify a handover via QR code scan.

**Backend action requested:**
1. **Update `Transfer` Model:**
   Add `transporterId: string | null` and `transporterName: string | null` to the `Transfer` and `ProductTransfer` models.
2. **Update Status Enum:**
   Add `ready_for_pickup` to the transfer status enums.
3. **Add Endpoint to Accept Offer:**
   `POST /transfers/{id}/accept-offer` (or update `PATCH /transfers/{id}/status` with `status: "accepted"` to assign the caller as the `transporterId`).
4. **Add Endpoint for QR Handover:**
   `POST /transfers/{id}/pickup-scan`
   - **Payload:** `{ "qrPayload": "string" }`
   - **Action:** Verifies the QR code, changes status to `picked_up` / `in_transit`, and confirms custody handover.
