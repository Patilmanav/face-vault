# FaceVault

A web application for managing and searching images based on face recognition.

## Features

- User authentication
- Image upload with face detection
- Face-based image grouping
- Image search by face
- Dashboard with recent images
- View all images grouped by faces

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Flask backend (for production use)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   FLASK_API_URL=http://localhost:5000/api
   ```

### Development

Run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Image Upload Process

The application uses a two-step process for uploading images:

1. **Upload Images**: Select multiple images to upload at once.
2. **Review and Group**: After upload, images are automatically grouped based on detected faces. You can add labels and details to each group.

## Face Groups

The Face Groups feature allows you to view all your uploaded images that have been automatically grouped based on detected faces. This makes it easy to:

- See all images of the same person in one place
- Add or edit labels and details for groups of images
- Organize your face database efficiently

To access the Face Groups page, click on the "Face Groups" tab in the navigation bar.

### Testing with Mock API

For testing purposes, the application uses a mock API that simulates the Flask backend. To switch to the real API:

1. Open `src/app/upload/page.tsx`
2. Change the API endpoint from `/api/mock/upload-batch` to `/api/images/upload-batch`

### API Documentation

For detailed information about all API endpoints, request/response formats, and implementation details, please refer to the [API Documentation](API.md).

## License

This project is licensed under the MIT License.
