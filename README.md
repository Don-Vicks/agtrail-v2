# Agrolinking / Agtrail Frontend V2

A modern, blockchain-backed agricultural traceability and operations management platform designed for the entire supply chain ecosystem.

## Project Overview

Agrolinking (Agtrail) is a high-performance platform built to provide end-to-end visibility, accountability, and efficiency in agricultural supply chains. By leveraging blockchain technology and IoT-ready tracking, the platform ensures that every product's journey from farm to processor is verified, compliant, and transparent.

The platform serves six primary stakeholder groups with specialized, data-rich dashboards:

- **Farmers**: On-farm operations, crop cycles, and personnel management.
- **Cooperatives**: Member oversight, aggregated production metrics, and collective logistics.
- **Processors**: Industrial intake, facility certifications, and production readiness.
- **Aggregators**: Lot consolidation, storage auditing, and verified transfers.
- **Field Agents**: Ground-truth observations, farm asset verification, and harvest approvals.
- **Transporters**: Logistics monitoring, fleet management, and delivery tracking.

## Core Features

- **Blockchain Traceability**: Immutable record-keeping for every batch using the Stellar network.
- **Operations Management**: Deep tracking of farm activities (planting, irrigation, harvest, sorting, etc.).
- **Compliance & Readiness**: Automated tracking of regulatory requirements and certification statuses.
- **Logistics & Inventory**: Real-time weight reconciliation, lot consolidation, and manifest management.
- **Resilient Connectivity**: Built-in offline support for remote field work with robust synchronization.
- **Geospatial Intelligence**: Integrated mapping for farm asset visualization and regional analytics.

## Technical Stack

- **Framework**: [React Router 7](https://reactrouter.com/) (Framework Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [TanStack Query v5](https://tanstack.com/query)
- **API Generation**: [Orval](https://orval.dev/) (OpenAPI / Swagger SDK generation)
- **Blockchain**: Stellar SDK
- **KYC & Identity**: Dojah SDK
- **Maps**: Google Maps Platform
- **Icons**: Lucide React
- **Forms**: React Hook Form & Zod

## Recent Updates

- **Navigation Standardization**: Refactored sidebar navigation across Farmer, Cooperative, and Processor roles by introducing a dedicated "Management" group for Inventory, Personnel, and Facilities.
- **Header UI Optimization**:
  - Integrated a functional desktop sidebar toggle into `PageHeader`.
  - Eliminated redundant navigation icons in breadcrumbs for a cleaner, focused interface.
  - Improved mobile/desktop header consistency and responsiveness.
- **Component Refinement**: Optimized `CropCycleCard` and operation forms for premium aesthetics and better data visibility.
- **Sorting & Filtering**: Enhanced data grid controls across the platform for better resource management.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### API SDK Generation

To regenerate the API SDK from the backend Swagger spec:

```bash
npm run generate:api
```

## Building for Production

Create a production build:

```bash
npm run build
```

---
