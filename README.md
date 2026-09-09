# Blog System & User Management API

A RESTful backend API for a Blog System and User Management application built with Node.js, Express, MongoDB, and Mongoose. The project implements JWT-based authentication, role-based authorization, Joi validation, image uploads, blog and comment relationships, and an MVC architecture.

## Table of Contents

* [Overview](#overview)
* [Key Features](#key-features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Running the Project](#running-the-project)
* [Dependencies](#dependencies)
* [Authentication](#authentication)
* [Authorization](#authorization)
* [Database](#database)
* [Validation](#validation)
* [File Uploads](#file-uploads)
* [API Reference](#api-reference)
* [Posts Querying](#posts-querying)
* [HTTP Status Codes](#http-status-codes)
* [Error Handling](#error-handling)
* [Security](#security)
* [API Testing](#api-testing)
* [Project Features](#project-features)
* [Contributors](#contributors)

## Overview

This project provides a backend API for managing users, blog posts, and comments.

Users can register and log in using JWT authentication. Authenticated users can manage their own profiles, create blog posts, and add comments. Administrative operations are protected using role-based authorization.

The API also supports post searching, filtering, sorting, pagination, image uploads, Mongoose relationships, and centralized error handling.

## Key Features

* User registration and login
* JWT authentication
* Role-based authorization with `user` and `admin` roles
* User management and CRUD operations
* Password hashing using bcryptjs
* Blog post CRUD operations
* Post ownership authorization
* Comment creation and deletion
* User, post, and comment relationships
* Joi request validation
* Image uploads using Multer
* Post search
* Category filtering
* Author filtering
* Pagination
* Sorting
* Login rate limiting
* Centralized error handling
* Helmet security middleware
* CORS support
* MVC architecture

## Tech Stack

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| Node.js            | JavaScript runtime              |
| Express.js         | REST API framework              |
| MongoDB            | Database                        |
| Mongoose           | MongoDB ODM and relationships   |
| JSON Web Token     | Authentication                  |
| bcryptjs           | Password hashing                |
| Joi                | Request validation              |
| Multer             | Image upload handling           |
| Helmet             | HTTP security headers           |
| CORS               | Cross-Origin Resource Sharing   |
| Express Rate Limit | Login rate limiting             |
| dotenv             | Environment variable management |
| Nodemon            | Development server              |

## Architecture

The project follows the **Model-View-Controller (MVC)** architecture.

### Models

Mongoose models define the database schemas and relationships.

* `User.model.js`
* `Post.model.js`
* `Comment.model.js`

### Controllers

Controllers contain the application logic, database operations, authorization checks, and API responses.

* `auth.controller.js`
* `user.controller.js`
* `post.controller.js`
* `comment.controller.js`

### Routes

Routes define API endpoints and connect requests with the required middleware and controllers.

* `auth.routes.js`
* `user.routes.js`
* `post.routes.js`
* `comment.routes.js`

### Middlewares

Middleware handles authentication, role authorization, request validation, file uploads, and centralized error handling.

## Project Structure

```text
Project_Team50/
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   └── comment.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   │
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Post.model.js
│   │   └── Comment.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   └── comment.routes.js
│   │
│   ├── validations/
│   │   ├── auth.validation.js
│   │   ├── user.validation.js
│   │   ├── post.validation.js
│   │   └── comment.validation.js
│   │
│   └── utils/
│       ├── AppError.js
│       └── asyncWrapper.js
│
├── uploads/
├── .env
├── app.js
├── server.js
├── package.json
└── README.md
```

## Prerequisites

Before running the project, make sure the following are installed:

* Node.js
* npm
* MongoDB

MongoDB should be running locally, or the `DBConnection` environment variable should point to an available MongoDB instance.

## Installation

Clone the repository and move into the project directory:

```bash
git clone <repository-url>
cd Project_Team50
```

Install the project dependencies:

```bash
npm install
```

Create an `uploads` directory in the project root if it does not already exist.

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DBConnection=mongodb://localhost:27017/finalProject
JWT_SECRET=finalProject
```

### Environment Variables

| Variable       | Description                                   |
| -------------- | --------------------------------------------- |
| `PORT`         | Port used by the Express server               |
| `DBConnection` | MongoDB connection string                     |
| `JWT_SECRET`   | Secret key used to sign and verify JWT tokens |

The `.env` file should not be committed to the repository.

## Running the Project

### Development

Run the application with Nodemon:

```bash
npm run dev
```

### Normal Start

Run the application with Node.js:

```bash
npm start
```

The API is available at:

```text
http://localhost:3000
```

## Dependencies

The project uses the following packages:

```text
express
mongoose
bcryptjs
jsonwebtoken
joi
dotenv
nodemon
multer
cors
helmet
express-rate-limit
```

These dependencies are defined in `package.json`.

## Authentication

Authentication is implemented using **JSON Web Tokens (JWT)**.

### Registration

Register a new user:

```http
POST /api/auth/register
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

The password is hashed before being stored in MongoDB.

A successful registration returns:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

A successful login returns a JWT token:

```json
{
  "message": "Hello John Doe",
  "token": "JWT_TOKEN"
}
```

### Using the Token

Protected endpoints require the following header:

```http
Authorization: Bearer JWT_TOKEN
```

The authentication middleware verifies the token and attaches the decoded user information to `req.user`.

## Authorization

The application supports two roles:

* `user`
* `admin`

Role-based authorization is handled through middleware and ownership checks.

### Admin-only operations

* Get all users
* Delete users

### Owner/Admin operations

* Update a user profile
* Update a post
* Delete a post
* Delete a comment

Users cannot modify resources owned by another user unless they have the required administrative role.

## Database

The project uses **MongoDB** with **Mongoose**.

The default local database connection is:

```text
mongodb://localhost:27017/finalProject
```

### User Model

The User model contains:

* `name`
* `email`
* `password`
* `role`
* `avatar`
* `createdAt`
* `updatedAt`

### Post Model

The Post model contains:

* `title`
* `content`
* `author`
* `category`
* `tags`
* `coverImage`
* `isPublished`
* `createdAt`
* `updatedAt`

### Comment Model

The Comment model contains:

* `text`
* `user`
* `post`
* `createdAt`
* `updatedAt`

### Relationships

```text
User 1 ───────── * Posts
User 1 ───────── * Comments
Post 1 ───────── * Comments
```

Posts reference their author through the `User` model. Comments reference both the user who created them and the post they belong to.

## Validation

The project uses **Joi** to validate incoming request data.

Validation is implemented for:

* User registration
* User login
* User updates
* Post creation and updates
* Comment creation

### Registration Rules

* `name` is required and must contain at least 3 characters.
* `email` is required and must be a valid email address.
* `password` is required and must contain at least 6 characters.

### Login Rules

* `email` is required and must be valid.
* `password` is required.

### User Update Rules

At least one of the following fields must be provided:

* `name`
* `email`
* `password`

### Post Rules

* `title` is required and must contain at least 5 characters.
* `content` is required and must contain at least 10 characters.
* `category` is required.

### Comment Rules

* `text` is required and must contain at least 1 character.

Invalid request data returns:

```text
400 Bad Request
```

## File Uploads

The project uses **Multer** for image uploads.

### User Avatar

The user update endpoint accepts an image using the `avatar` field.

### Post Cover Image

Post creation and update endpoints accept an image using the `coverImage` field.

Uploaded images are stored in:

```text
uploads/
```

The directory is served through:

```text
/uploads
```

## API Reference

All API endpoints use the following base URL:

```text
http://localhost:3000
```

### Authentication

| Method | Endpoint             | Authentication | Description             |
| ------ | -------------------- | -------------- | ----------------------- |
| POST   | `/api/auth/register` | No             | Register a new user     |
| POST   | `/api/auth/login`    | No             | Login and receive a JWT |

### Users

| Method | Endpoint         | Authentication | Description       |
| ------ | ---------------- | -------------- | ----------------- |
| GET    | `/api/users`     | Admin          | Get all users     |
| GET    | `/api/users/:id` | Yes            | Get a single user |
| PUT    | `/api/users/:id` | Owner/Admin    | Update a user     |
| DELETE | `/api/users/:id` | Admin          | Delete a user     |

User passwords are excluded from user responses.

### Posts

| Method | Endpoint         | Authentication | Description       |
| ------ | ---------------- | -------------- | ----------------- |
| POST   | `/api/posts`     | Yes            | Create a post     |
| GET    | `/api/posts`     | No             | Get all posts     |
| GET    | `/api/posts/:id` | No             | Get a single post |
| PUT    | `/api/posts/:id` | Owner/Admin    | Update a post     |
| DELETE | `/api/posts/:id` | Owner/Admin    | Delete a post     |

The single-post endpoint returns the post with its author and related comments.

### Comments

| Method | Endpoint                      | Authentication | Description             |
| ------ | ----------------------------- | -------------- | ----------------------- |
| POST   | `/api/posts/:postId/comments` | Yes            | Add a comment to a post |
| DELETE | `/api/comments/:id`           | Owner/Admin    | Delete a comment        |

A comment can only be created for an existing post.

## Posts Querying

The `GET /api/posts` endpoint supports pagination, searching, filtering, and sorting.

### Pagination

```http
GET /api/posts?page=1&limit=10
```

### Search

Search posts by title or content:

```http
GET /api/posts?search=node
```

### Category Filtering

```http
GET /api/posts?category=backend
```

### Author Filtering

```http
GET /api/posts?author=USER_ID
```

### Sorting

For example, sort posts by newest first:

```http
GET /api/posts?sort=-createdAt
```

These query parameters can be combined when needed.

## HTTP Status Codes

| Status Code | Meaning                                  |
| ----------- | ---------------------------------------- |
| `200`       | Request completed successfully           |
| `201`       | Resource created successfully            |
| `400`       | Bad request or validation error          |
| `401`       | Authentication required or invalid token |
| `403`       | Access forbidden                         |
| `404`       | Resource not found                       |
| `429`       | Too many requests                        |
| `500`       | Internal server error                    |

## Error Handling

The project includes centralized error-handling middleware.

Errors are returned using a JSON response format:

```json
{
  "message": "Error message"
}
```

The API avoids exposing sensitive information such as:

* User passwords
* JWT secrets
* Database connection details

## Security

The project includes:

* JWT authentication
* Password hashing with bcryptjs
* Role-based authorization
* Joi input validation
* Helmet
* CORS
* Login rate limiting

Login requests are rate-limited to help prevent repeated authentication attempts.

## API Testing

The API was tested using **Postman**.

The tested operations include:

### Authentication

* Register
* Login

### Users

* Get All Users
* Get User
* Update User
* Delete User

### Posts

* Create Post
* Get All Posts
* Get Single Post
* Update Post
* Delete Post

### Comments

* Create Comment
* Delete Comment

## Project Features

* RESTful API
* User registration
* User login
* JWT authentication
* Role-based authorization
* Users CRUD
* Password hashing
* Blog posts CRUD
* User/Post relationships
* Comments
* User/Comment relationships
* Post/Comment relationships
* Joi validation
* Image upload
* Pagination
* Search
* Category filtering
* Author filtering
* Sorting
* Login rate limiting
* Centralized error handling
* MVC architecture

## Contributors

This project was developed as a university team project.

**Project Team 50**
