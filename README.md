# JWT Auth Demo (Access + Refresh Token)

This project demonstrates a secure authentication system using **JWT (access + refresh tokens)** with blacklist support for logout.  
It includes:

- Signup & Login functionality
- JWT access token with expiry
- Refresh token system using `httpOnly` cookie
- Token blacklist on logout (to prevent reuse)
- Protected route example (`/profile`)
- MongoDB for user and blacklist token storage

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- cookie-parser
- CORS

## 🔐 Features

| Feature              | Description |
|----------------------|-------------|
| `POST /auth/signup`  | Register a new user |
| `POST /auth/login`   | Authenticate user and return access + refresh token |
| `POST /auth/logout`  | Invalidate current access token by blacklisting it |
| `POST /auth/refresh-token` | Generate new access token using refresh token stored in `httpOnly` cookie |
| `GET /auth/profile`  | Access protected route (requires valid access token) |

## 🧪 How to Use (via Postman)

1. **Signup/Login**  
   ➤ Save the `access token` in localStorage (frontend)  
   ➤ `refresh token` is auto-set in `httpOnly` cookie

2. **Access Protected Route**  
   ➤ Pass `access token` in `Authorization: Bearer <token>` header

3. **On Expired Access Token**  
   ➤ Call `/auth/refresh-token` to get a new access token  
   ➤ Replace old access token in localStorage

4. **Logout**  
   ➤ Calls `/auth/logout` and blacklists the current token

## 📬 Author

Developed by [@jeevan42](https://github.com/jeevan42) 🔥  
Feel free to fork & use!

---



