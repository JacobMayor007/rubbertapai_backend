# Rubbertapai Server API Documentation

## Base URL Localhost

```
[http://localhost:3000]
```

### BASE URL Live Deployment

```
  https://rubbertapai-*********.***.****/api/****/admin
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Admin

### Login Admin Routes

### FrontEnd format

```
const response = await fetch(`${url}/api/v1/admin`,
{
  method: "POST",
  headers:{
    "content-type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({email, password}),
})
```

```
http
POST /api/v1/admin

The response format will be a json format
```

```
{
  success: true,
  message: string,
  data: {
    sessionId: string,
    userId: string,
  },
}
```

## Response Format

All endpoints return JSON responses in the following format:

```json
{
  "success": boolean,
  "message": "string",
  "data": object | array
}
```

## Error Handling

The API uses standard HTTP response codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### Report

### API ENDPOINT

```
NEEDED IN SERVER SIDE
POST ${BASE_URL}/api/v1/admin/reports
HEADERS:
  Content-Type : application/json
  Accept : application/json
BODY:
  {
    userId,  ---> user id of the admin
    API_KEY, ---> API_KEY of the admin
    email: ---> email of the admin
  }

DATA:
  {
    status:string,
    reported_id:string,
    reportedBy:string,
    type:string,
    description:string,
    ResolvedAt,
    $id:string,
    $createdAt:string,
    $updatedAt:string,
  }

```

### Get Specific User Reports

```
  NEEDED IN SERVER SIDE
  HEADERS:
    Content-Type : application/json
    Accept : application/json
  BODY:
  {
    userId,  ---> user id of the admin
    API_KEY, ---> API_KEY of the admin
    reportedId, ---> id of the farmer | buyer
    email: ---> email of the admin
  }

  POST ${BASE_URL}/api/v1/admin/user
  DATA:
  {
    status:string,
    reported_id:string,
    reportedBy:string,
    type:string,
    description:string,
    ResolvedAt:dayjs(DATETIME | string),
    $id:string,
    $createdAt:string,
    $updatedAt:string,
  }

```

### Rates And Feedbacks

```
  NEEDED IN SERVER SIDE
  HEADERS:
    Content-Type : application/json
    Accept : application/json
  BODY:
  {
    userId,  ---> user id of the admin
    API_KEY, ---> API_KEY of the admin
    email: ---> email of the admin
  }

  POST ${BASE_URL}/api/v1/admin/rates
  DATA
  {
    $id:string,
    ratedBy:string,
    rated:string,
    rate:number,
    feedback:string,
    $id:string,
    $createdAt:string,
    $updatedAt:string,
  }

```

### GET All Users

```
  NEEDED IN SERVER SIDE
  HEADERS:
    "Content-Type" : "application/json"
    "Accept" : "application/json"

  BODY:
   {
      userId,  ---> user id of the admin
      API_KEY, ---> API_KEY of the admin
   }

  DATA:
    {
      role:string,
      username:string,
      notifSettings:boolean,
      themeSettings:boolean,
      subscription:string,
      imageURL:string,
      email:string,
      fName :string,
      lName :string,
      fullName :string,
      city:string,
      rate:number,
      $id:string,
      $createdAt: dayjs(DATETIME | string),
      $updatedAt: dayjs(DATETIME | string),
    }

```

### Disable / Enable User

```
  API Endpoint
  ({BASE_URL}/api/v1/admin/user)

  Needed in the server side
  HEADERS:
    {
      Content-Type: application/json,
      Accept: application/json
    }

  BODY:
    {
      userId,  ---> user id of the admin
      API_KEY, ---> API_KEY of the admin
      reportedId, ---> id of the farmer | buyer
      status: "enable" | "disable"
    }

  DATA:
  {
    success: boolean,
    message: string,
    title: string
  }


```

### User Management

#### Get User by ID

```
http
GET /api/v1/users/user/:id
```

- Parameters:
  - `id`: User ID

#### Search User

```http
GET /api/v1/users/search-user/:name
```

- Parameters:
  - `name`: Username to search

### Chat System

#### Get Chat Mate

```http
GET /api/v1/users/chat-mate/:id
```

- Parameters:
  - `id`: Chat mate's user ID

#### Get Chat Room

```http
GET /api/v1/users/chat-room/:userId
```

- Parameters:
  - `userId`: User ID

#### Get Messages

```http
GET /api/v1/users/sent-messages/:userId/:receiverId
GET /api/v1/users/received-messages/:userId/:receiverId
```

- Parameters:
  - `userId`: Sender's user ID
  - `receiverId`: Receiver's user ID

### Plot Management

#### Get My Plot

```http
GET /api/v1/users/my-plot/:userId
```

- Parameters:
  - `userId`: User ID

### Product Management

#### Get User Products

```http
GET /api/v1/users/my-product/:userId
```

- Parameters:
  - `userId`: User ID

#### Get All Products

```http
GET /api/v1/users/products
```

### Tree Management

#### Get My Trees

```http
GET /api/v1/users/trees/:plotId/:userId
GET /api/v1/users/trees/:userId
```

- Parameters:
  - `plotId`: Plot ID
  - `userId`: User ID

#### Get Leaves Information

```http
GET /api/v1/users/my-leaves/:plot_id/:treeId/:userId
```

- Parameters:
  - `plot_id`: Plot ID
  - `treeId`: Tree ID
  - `userId`: User ID

### Weather Information

#### Get Weather Forecast

```http
GET /api/v1/users/forecast/:city
```

- Parameters:
  - `city`: City name

#### Get Current Weather

```http
GET /api/v1/users/current/:city
```

- Parameters:
  - `city`: City name

### Admin Routes

#### Get All Reports

```http
GET /admin/api
```

- Requires admin authentication

## Development

To run the server locally:

```bash
npm install
npm start
```

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
APPWRITE_ENDPOINT=your_appwrite_endpoint
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
```
