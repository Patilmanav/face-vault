# FaceVault API Documentation

This document provides a comprehensive overview of all API endpoints in the FaceVault application.

## Table of Contents

- [Authentication](#authentication)
- [Image Upload](#image-upload)
- [Image Search](#image-search)
- [Face Groups](#face-groups)
- [User Management](#user-management)

## Authentication

### Login

Authenticates a user and returns a session token.

**Endpoint:** `/api/auth/login`

**Method:** `POST`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER",
    "storageUsed": 1024000,
    "maxStorage": 10485760,
    "imageCount": 5,
    "maxImages": 100
  }
}
```

### Register

Registers a new user.

**Endpoint:** `/api/auth/register`

**Method:** `POST`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER",
    "storageUsed": 0,
    "maxStorage": 10485760,
    "imageCount": 0,
    "maxImages": 100
  }
}
```

### Logout

Logs out the current user.

**Endpoint:** `/api/auth/logout`

**Method:** `POST`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Get Current User

Returns the current authenticated user.

**Endpoint:** `/api/auth/me`

**Method:** `GET`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER",
    "storageUsed": 1024000,
    "maxStorage": 10485760,
    "imageCount": 5,
    "maxImages": 100
  }
}
```

## Image Upload

### Upload Single Image

Uploads a single image with face detection.

**Endpoint:** `/api/images/upload`

**Method:** `POST`

**Request Body:**
- `file`: Image file (multipart/form-data)
- `label` (optional): Label for the image
- `details` (optional): Additional details about the image

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "image": {
    "id": "img-123",
    "url": "/uploads/user-123/img-123.jpg",
    "label": "Family Photo",
    "details": "Summer vacation 2023",
    "createdAt": "2023-07-15T12:30:45Z"
  }
}
```

### Batch Upload Images

Uploads multiple images at once and groups them by detected faces.

**Endpoint:** `/api/images/upload-batch`

**Method:** `POST`

**Request Body:**
- `files`: Array of image files (multipart/form-data)

**Response:**
```json
{
  "success": true,
  "message": "Images uploaded and processed successfully",
  "faceGroups": [
    {
      "id": "group-1",
      "label": "Family Photos",
      "details": "Photos of family members",
      "imageUrls": [
        "/uploads/user-123/img-123.jpg",
        "/uploads/user-123/img-124.jpg"
      ]
    },
    {
      "id": "group-2",
      "label": "Friends",
      "details": "Photos with friends",
      "imageUrls": [
        "/uploads/user-123/img-125.jpg",
        "/uploads/user-123/img-126.jpg"
      ]
    }
  ],
  "rejectedImages": [
    {
      "filename": "no-face.jpg",
      "reason": "No face detected in the image"
    }
  ]
}
```

### Update Image Details

Updates the label and details for an image.

**Endpoint:** `/api/images/:imageId`

**Method:** `PUT`

**Request Body:**
```json
{
  "label": "Updated Label",
  "details": "Updated details"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image updated successfully",
  "image": {
    "id": "img-123",
    "url": "/uploads/user-123/img-123.jpg",
    "label": "Updated Label",
    "details": "Updated details",
    "createdAt": "2023-07-15T12:30:45Z"
  }
}
```

### Delete Image

Deletes an image.

**Endpoint:** `/api/images/:imageId`

**Method:** `DELETE`

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### Get Recent Images

Returns the most recently uploaded images.

**Endpoint:** `/api/images/recent`

**Method:** `GET`

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": "img-123",
      "url": "/uploads/user-123/img-123.jpg",
      "label": "Family Photo",
      "details": "Summer vacation 2023",
      "createdAt": "2023-07-15T12:30:45Z"
    },
    {
      "id": "img-124",
      "url": "/uploads/user-123/img-124.jpg",
      "label": "Friends",
      "details": "College reunion",
      "createdAt": "2023-07-14T10:15:30Z"
    }
  ]
}
```

## Image Search

### Search by Face

Searches for images containing faces similar to the uploaded image.

**Endpoint:** `/api/images/search`

**Method:** `POST`

**Request Body:**
- `file`: Image file (multipart/form-data)
- `threshold` (optional): Similarity threshold (0-1, default: 0.6)

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      "id": "img-123",
      "url": "/uploads/user-123/img-123.jpg",
      "label": "Family Photo",
      "details": "Summer vacation 2023",
      "similarity": 0.92
    },
    {
      "id": "img-124",
      "url": "/uploads/user-123/img-124.jpg",
      "label": "Friends",
      "details": "College reunion",
      "similarity": 0.85
    }
  ]
}
```

## Face Groups

### Get Face Groups

Returns all face groups for the current user.

**Endpoint:** `/api/images/groups`

**Method:** `GET`

**Response:**
```json
{
  "success": true,
  "message": "Face groups fetched successfully",
  "faceGroups": [
    {
      "id": "group-1",
      "label": "Family Photos",
      "details": "Photos of family members",
      "imageUrls": [
        "/uploads/user-123/img-123.jpg",
        "/uploads/user-123/img-124.jpg"
      ]
    },
    {
      "id": "group-2",
      "label": "Friends",
      "details": "Photos with friends",
      "imageUrls": [
        "/uploads/user-123/img-125.jpg",
        "/uploads/user-123/img-126.jpg"
      ]
    }
  ]
}
```

### Update Face Group

Updates the label and details for a face group.

**Endpoint:** `/api/images/groups/:groupId`

**Method:** `PUT`

**Request Body:**
```json
{
  "label": "Updated Group Label",
  "details": "Updated group details"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Face group updated successfully",
  "faceGroup": {
    "id": "group-1",
    "label": "Updated Group Label",
    "details": "Updated group details",
    "imageUrls": [
      "/uploads/user-123/img-123.jpg",
      "/uploads/user-123/img-124.jpg"
    ]
  }
}
```

### Delete Face Group

Deletes a face group.

**Endpoint:** `/api/images/groups/:groupId`

**Method:** `DELETE`

**Response:**
```json
{
  "success": true,
  "message": "Face group deleted successfully"
}
```

## User Management

### Update User Profile

Updates the user's profile information.

**Endpoint:** `/api/users/profile`

**Method:** `PUT`

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user-123",
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "USER",
    "storageUsed": 1024000,
    "maxStorage": 10485760,
    "imageCount": 5,
    "maxImages": 100
  }
}
```

### Change Password

Changes the user's password.

**Endpoint:** `/api/users/password`

**Method:** `PUT`

**Request Body:**
```json
{
  "currentPassword": "current-password",
  "newPassword": "new-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Error Responses

All API endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An unexpected error occurred"
}
```

## Mock API Endpoints

For testing purposes, the application includes mock API endpoints that simulate the behavior of the real API. These endpoints are prefixed with `/api/mock/` and return predefined responses.

### Mock Login
**Endpoint:** `/api/mock/login`

### Mock Register
**Endpoint:** `/api/mock/register`

### Mock Logout
**Endpoint:** `/api/mock/logout`

### Mock Get Current User
**Endpoint:** `/api/mock/me`

### Mock Upload Single Image
**Endpoint:** `/api/mock/upload`

### Mock Batch Upload Images
**Endpoint:** `/api/mock/upload-batch`

### Mock Search by Face
**Endpoint:** `/api/mock/search`

### Mock Get Face Groups
**Endpoint:** `/api/mock/groups`

## Implementation Notes

1. All API endpoints require authentication except for login and register.
2. File uploads should use `multipart/form-data` encoding.
3. The Flask backend handles face detection and recognition.
4. Image URLs are relative to the server root.
5. The mock API endpoints are used for testing when the Flask backend is not available. 