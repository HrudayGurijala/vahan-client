# Research Paper Summarization System - Frontend

This is a React frontend for the Research Paper Summarization System that allows users to search, upload, and process research papers to generate comprehensive summaries.

## Features

- Search for research papers on arXiv
- Upload PDF files
- Process papers via URL or DOI
- View paper summaries with key findings, methodology, and implications
- Listen to audio versions of the summaries

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Backend server running (Research Paper Summarization System API)

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory (optional):

```
VITE_API_URL=http://localhost:8000
```

## Running the application

1. Make sure the backend server is running on http://localhost:8000

2. Start the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open your browser and navigate to http://localhost:3000

## Building for production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, which can be deployed to any static file hosting service.

## Project Structure

```
/
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   ├── App.jsx       # Main application component
│   ├── App.css       # Main application styles
│   ├── main.jsx      # Application entry point
│   └── index.css     # Global styles
├── index.html        # HTML template
└── vite.config.js    # Vite configuration
```

## Backend API Integration

This frontend is designed to work with the Research Paper Summarization System API, which should be running on http://localhost:8000. The API provides the following endpoints:

- POST /papers/search - Search for papers
- POST /papers/upload - Upload a PDF file
- POST /papers/url - Process a paper from URL
- POST /papers/doi - Process a paper from DOI
- GET /tasks/{task_id} - Check task status
- GET /summaries/{summary_id} - Get a summary
- GET /summaries/{summary_id}/audio - Get audio for a summary

## License

[MIT](LICENSE)