# Notes App Frontend

A modern React-based frontend application for managing notes, built with TypeScript and Material-UI.

## Features

- User authentication (login/register)
- Create, read, update, and delete notes
- Responsive design
- Modern UI with Material-UI components
- Type-safe development with TypeScript
- Efficient state management with React Query

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend API running at http://localhost:5001

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend_web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API services
  ├── hooks/         # Custom React hooks
  ├── utils/         # Utility functions
  ├── types/         # TypeScript type definitions
  └── layouts/       # Layout components
```

## Technologies Used

- React
- TypeScript
- Material-UI
- React Router
- React Query
- Axios
- React Hook Form

## API Integration

The frontend integrates with a RESTful API running at http://localhost:5001. The API endpoints are:

- Authentication:
  - POST /auth/login
  - POST /auth/register

- Notes:
  - GET /notes
  - GET /notes/:id
  - POST /notes
  - PUT /notes/:id
  - DELETE /notes/:id

## Development

To start development:

1. Ensure the backend API is running
2. Start the development server with `npm run dev`
3. Make changes to the code
4. The development server will automatically reload

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## License

MIT
