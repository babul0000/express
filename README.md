# Express.js + TypeScript + PostgreSQL (Raw SQL) প্রজেক্ট ডকুমেন্টেশন (A to Z Master Guide)

এই ডকুমেন্টেশনে এই প্রজেক্টের প্রতিটি ফাইল, আর্কিটেকচার, প্যাকেজ, ডাটাবেজ মডেলিং (Users & Profile 1-to-1 Relationship), সম্পূর্ণ CRUD অপারেশন, JWT অথেনটিকেশন (Access Token, Refresh Token, Secure Cookie), Role-Based Access Control (RBAC) এবং কাস্টম মিডলওয়্যার সম্পর্কে বিস্তারিত ও কোডসহ আলোচনা করা হলো।

---

## সূচিপত্র (Table of Contents)
1. [প্রজেক্ট পরিচিতি ও আর্কিটেকচার](#১-প্রজেক্ট-পরিচিতি-ও-আর্কিটেকচার)
2. [ব্যবহৃত প্যাকেজ ও টেক স্ট্যাক (Dependencies)](#২-ব্যবহৃত-প্যাকেজ-ও-টেক-স্ট্যাক-dependencies)
3. [কমপ্লিট ফাইল ও ফোল্ডার স্ট্রাকচার](#৩-কমপ্লিট-ফাইল-ও-ফোল্ডার-স্ট্রাকচার)
4. [সার্ভার বুটস্ট্র্যাপ ও এক্সপ্রেস কনফিগারেশন](#৪-সার্ভার-বুটস্ট্র্যাপ-ও-এক্সপ্রেস-কনফিগারেশন)
5. [ডাটাবেজ সেটআপ ও রিলেশনশিপ (PostgreSQL Pool)](#৫-ডাটাবেজ-সেটআপ-ও-রিলেশনশিপ-postgresql-pool)
6. [ইউজার CRUD অপারেশন (Users Module)](#৬-ইউজার-crud-অপারেশন-users-module)
7. [প্রোফাইল মডিউল ও রিলেশনশিপ হ্যান্ডলিং (Profile Module)](#৭-প্রোফাইল-মডিউল-ও-রিলেশনশিপ-হ্যান্ডলিং-profile-module)
8. [অথেনটিকেশন ও টোকেন আর্কিটেকচার (JWT, Access & Refresh Token)](#৮-অথেনটিকেশন-ও-টোকেন-আর্কিটেকচার-jwt-access--refresh-token)
9. [কাস্টম মিডলওয়্যার ও টাইপস্ক্রিপ্ট এক্সটেনশন](#৯-কাস্টম-মিডলওয়্যার-ও-টাইপস্ক্রিপ্ট-এক্সটেনশন)
10. [ইউটিলিটি ও রেসপন্স হ্যান্ডলিং](#১০-ইউটিলিটি-ও-রেসপন্স-হ্যান্ডলিং)
11. [প্রজেক্ট রান ও এনভায়রনমেন্ট ভ্যারিয়েবল সেটআপ](#১১-প্রজেক্ট-রান-ও-এনভায়রনমেন্ট-ভ্যারিয়েবল-সেটআপ)

---

## ১. প্রজেক্ট পরিচিতি ও আর্কিটেকচার

এই প্রজেক্টটি কোনো হাই-লেভেল ORM (যেমন Prisma, Drizzle বা TypeORM) ছাড়াই সরাসরি PostgreSQL-এর অফিসিয়াল ড্রাইভার `pg` ব্যবহার করে **Pure Raw SQL** দিয়ে তৈরি করা হয়েছে। আর্কিটেকচার হিসেবে এখানে ইন্ডাস্ট্রি স্ট্যান্ডার্ড **Modular Architecture** ব্যবহার করা হয়েছে।

### রিকোয়েস্ট লাইফসাইকেল ফ্লো (Lifecycle Architecture):
```
Client Request (Postman / Browser / Frontend)
      │
      ▼
   [app.ts] Global Middlewares (CORS, Cookie Parser, JSON & Text Parser, File Logger)
      │
      ▼
   [Routes] (/api/v1/users, /api/v1/auth, /api/v1/profile)
      │
      ▼
   [Middleware] auth.ts (JWT Verify, Active User Check, Role-Based Access Control)
      │
      ▼
   [Controller] (Request Body/Params/Cookies রিসিভ করা ও Response ফরম্যাট করা)
      │
      ▼
   [Service] (Business Logic, Password Hashing, DB Query Execution, Token Generation)
      │
      ▼
   [Database] (PostgreSQL Server - Pool Query with Parametrized SQL: $1, $2)
```

---

## ২. ব্যবহৃত প্যাকেজ ও টেক স্ট্যাক (Dependencies)

| প্যাকেজের নাম | ক্যাটাগরি | উদ্দেশ্য ও কাজ |
| :--- | :--- | :--- |
| **`express`** (`^5.3.0`) | Core Framework | Node.js-এর জন্য দ্রুতগতির ব্যাকএন্ড ওয়েব ফ্রেমওয়ার্ক। |
| **`pg`** (`^8.23.1`) | Database Driver | PostgreSQL ডাটাবেজে কানেকশন পুল (Pool) ম্যানেজ করা এবং Raw SQL কুয়েরি চালানো। |
| **`jsonwebtoken`** (`^9.0.3`) | Security / Auth | JSON Web Token (Access Token ও Refresh Token) তৈরি ও ভেরিফাই করা। |
| **`bcryptjs`** (`^3.0.3`) | Security / Cryptography | ইউজারের প্লেইন টেক্সট পাসওয়ার্ড সল্টিং (salt rounds: 10) সহ সিকিউর হ্যাশ করা। |
| **`cookie-parser`** (`^1.4.7`) | Middleware | ক্লায়েন্ট থেকে আসা HTTP কুকি পার্স করে `req.cookies` অবজেক্টে রূপান্তর করা। |
| **`cors`** (`^2.8.6`) | Middleware | Cross-Origin Resource Sharing ম্যানেজ করা যাতে স্পেসিফিক ডোমেইন থেকে রিকোয়েস্ট এক্সেপ্ট হয়। |
| **`dotenv`** (`^18.0.10`) | Configuration | `.env` ফাইল থেকে ডাটাবেজ স্ট্রিং এবং সিক্রেট কী লোড করা। |
| **`tsx`** (`^4.23.15`) | Development Tool | TypeScript ফাইল সরাসরি ওয়াচ মোডে লাইভ রান করার জন্য (`tsx watch ./src/server.ts`)। |
| **`@types/*`** | Type Definitions | TypeScript কম্পাইলারের জন্য সব প্যাকেজের অফিসিয়াল টাইপ ডেফিনিশন। |

```bash
# ডিপেন্ডেন্সি ইনস্টলেশন কমান্ড
npm install express pg jsonwebtoken bcryptjs cookie-parser cors dotenv
npm install -D tsx typescript @types/node @types/express @types/pg @types/jsonwebtoken @types/cookie-parser @types/cors
```

---

## ৩. কমপ্লিট ফাইল ও ফোল্ডার স্ট্রাকচার

```
express-js/
├── .env                          # ডাটাবেজ ইউআরএল ও সিক্রেট কি-সমূহ
├── .gitignore                    # Git tracking ignore rules
├── package.json                  # প্যাকেজ ও স্ক্রিপ্ট ডেফিনিশন
├── tsconfig.json                 # TypeScript কনফিগারেশন
├── logger.txt                    # কাস্টম লগার মিডলওয়্যার থেকে জেনারেট হওয়া লগ
├── PROJECT_DOCUMENTATION.pdf     # সম্পূর্ণ প্রজেক্টের এক্সপোর্ট করা PDF গাইড
└── src/
    ├── server.ts                 # অ্যাপ্লিকেশন স্টার্টার ও ডাটাবেজ ইনিশিয়ালাইজার
    ├── app.ts                    # এক্সপ্রেস অ্যাপ ইনিট, গ্লোবাল মিডলওয়্যার ও রুট মাউন্টিং
    ├── config.ts                 # Environment variables সেন্ট্রালাইজড এক্সপোর্ট
    ├── db/
    │   └── index.ts              # pg Pool তৈরি ও Users/Profile টেবিল তৈরির SQL
    ├── middleware/
    │   ├── auth.ts               # JWT ভেরিফিকেশন ও RBAC পারমিশন মিডলওয়্যার
    │   ├── globalErrorHandaler.ts# সেন্ট্রালাইজড এরর হ্যান্ডলার
    │   ├── index.d.ts            # Express Request ইন্টারফেসে 'user' টাইপ মার্জিং
    │   └── logger.ts             # ফাইল বেসড রিকোয়েস্ট মেথড, URL ও টাইম লগার
    ├── modules/
    │   ├── auth/                 # অথেনটিকেশন মডিউল (লগইন ও টোকেন রিফ্রেশ)
    │   │   ├── auth.route.ts
    │   │   ├── auth.controler.ts
    │   │   └── auth.service.ts
    │   ├── profile/              # প্রোফাইল মডিউল (One-to-One Child Table)
    │   │   ├── profile.route.ts
    │   │   ├── profile.controler.ts
    │   │   └── profile.service.ts
    │   └── users/                # ইউজার মডিউল (সম্পূর্ণ CRUD)
    │       ├── user.interface.ts
    │       ├── users.route.ts
    │       ├── user.controler.ts
    │       └── user.service.ts
    ├── types/
    │   └── index.ts              # Role টাইপ ও USER_ROLE কনস্ট্যান্ট
    └── utils/
        └── sendResponse.ts       # ইউনিফাইড API রেসপন্স ফরম্যাটার
```

---

## ৪. সার্ভার বুটস্ট্র্যাপ ও এক্সপ্রেস কনফিগারেশন

### ১. `src/server.ts`
```typescript
import app from "./app";
import config from "./config";
import { initDB } from "./db";

const main = async () => {
  await initDB(); // ডাটাবেজ টেবিল চেক ও ইনিশিয়ালাইজ
  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
};
main();
```

### ২. `src/config.ts`
```typescript
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  connection_string: process.env.DATABASE_URL as string,
  jwt_secret: process.env.JWT_SECRET as string,
  refresh_secret: process.env.JWT_REFRESH_SECRET as string,
};

export default config;
```

### ৩. `src/app.ts`
```typescript
import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/users/users.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
import globalErrorHandaler from "./middleware/globalErrorHandaler";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "this is route route",
    author: "programing hero",
  });
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/auth", authRoute);

// Global Error Handling Middleware
app.use(globalErrorHandaler);

export default app;
```

---

## ৫. ডাটাবেজ সেটআপ ও রিলেশনশিপ (PostgreSQL Pool)

ফাইল: `src/db/index.ts`
```typescript
import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async () => {
  try {
    // ১. প্রথমে parent টেবিল (users) তৈরি হবে
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_Active BOOLEAN DEFAULT true,
        age INT,
        role VARCHAR(20) DEFAULT 'user',
        create_at TIMESTAMP DEFAULT NOW(),
        update_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ২. এরপর child টেবিল (profile) তৈরি হবে (1-to-1 Relationship)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        bio TEXT,
        address TEXT,
        phone VARCHAR(15),
        gender VARCHAR(15),
        create_at TIMESTAMP DEFAULT NOW(),
        update_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("database is connected");
  } catch (error) {
    console.log(error);
  }
};
```

### গুরুত্বপূর্ণ কনসেপ্ট:
- `SERIAL PRIMARY KEY`: অটো-ইনক্রিমেন্টাল আইডি।
- `REFERENCES users(id) ON DELETE CASCADE`: যদি কোনো ইউজার মুছে ফেলা হয়, ডাটাবেজ তার সংশ্লিষ্ট প্রোফাইলও স্বয়ংক্রিয়ভাবে মুছে ফেলে।
- `user_id INT UNIQUE`: এর ফলে একজন ইউজারের ১টির বেশি প্রোফাইল থাকা সম্ভব নয়।
- `$1, $2 প্যারামিটারাইজড কুয়েরি`: SQL Injection রোধ করার জন্য ব্যবহৃত হয়।

---

## ৬. ইউজার CRUD অপারেশন (Users Module)

### ১. Interface (`src/modules/users/user.interface.ts`)
```typescript
export interface IUser {
  name: string;
  email: string;
  password: string;
  age?: number | null;
  role?: string;
}
```

### ২. Service (`src/modules/users/user.service.ts`)
```typescript
import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs";

// Create
const createUserIntoDB = async (payload: IUser) => {
  const { name, email, age, password, role } = payload;
  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, age, role) 
     VALUES ($1, $2, $3, $4, COALESCE($5, 'user')) RETURNING *`,
    [name, email, hashPassword, age, role]
  );
  delete result.rows[0].password;
  return result;
};

// Read All
const getAllUserFromDB = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

// Read Single
const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

// Update Dynamic (COALESCE)
const getPutUserFromDB = async (payload: any, id: string) => {
  const { name, password, age, is_Active } = payload;
  const result = await pool.query(
    `UPDATE users
     SET
       name = COALESCE($1, name),
       password = COALESCE($2, password),
       age = COALESCE($3, age),
       is_Active = COALESCE($4, is_Active),
       update_at = NOW()
     WHERE id = $5 RETURNING *`,
    [name ?? null, password ?? null, age ?? null, is_Active ?? null, id]
  );
  return result;
};

// Delete
const deleteFromDB = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  getPutUserFromDB,
  deleteFromDB,
};
```

### ৩. Controller (`src/modules/users/user.controler.ts`)
```typescript
import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "user created",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to create user",
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserFromDB();
    res.status(200).json({
      success: true,
      message: "users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to retrieve users",
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getSingleUserFromDB(id as string);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "user not found" });
    }
    res.status(200).json({
      success: true,
      message: "user retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to retrieve user",
      error: error,
    });
  }
};

const getPutUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getPutUserFromDB(req.body, id as string);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "user not found" });
    }
    res.status(200).json({
      success: true,
      message: "user updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to update user",
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteFromDB(id as string);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "user not found" });
    }
    res.status(200).json({ success: true, message: "user deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to delete user",
      error: error,
    });
  }
};

export const userControler = {
  createUser,
  getAllUsers,
  getSingleUser,
  getPutUser,
  deleteUser,
};
```

### ৪. Route (`src/modules/users/users.route.ts`)
```typescript
import { Router } from "express";
import { userControler } from "./user.controler";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();

router.post("/", userControler.createUser);
router.get("/", auth(USER_ROLE.admin, USER_ROLE.agent), userControler.getAllUsers);
router.get("/:id", auth(USER_ROLE.admin, USER_ROLE.agent), userControler.getSingleUser);
router.put("/:id", userControler.getPutUser);
router.delete("/:id", userControler.deleteUser);

export const userRoute = router;
```

---

## ৭. প্রোফাইল মডিউল ও রিলেশনশিপ হ্যান্ডলিং (Profile Module)

### ১. Profile Service (`src/modules/profile/profile.service.ts`)
```typescript
import { pool } from "../../db";

const createProfileIntoDB = async (payload: any) => {
  const { user_id, bio, address, phone, gender } = payload;

  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [user_id]);
  if (user.rowCount === 0) {
    throw new Error("user not exixts in the database");
  }

  const result = await pool.query(
    `INSERT INTO profile (user_id, bio, address, phone, gender) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [user_id, bio, address, phone, gender]
  );
  return result;
};

export const profileService = { createProfileIntoDB };
```

### ২. Profile Controller (`src/modules/profile/profile.controler.ts`)
```typescript
import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async (req: Request, res: Response) => {
  try {
    const result = await profileService.createProfileIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: "profile created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to create profile",
      error: error,
    });
  }
};

export const profileControler = { createProfile };
```

### ৩. Profile Route (`src/modules/profile/profile.route.ts`)
```typescript
import { Router } from "express";
import { profileControler } from "./profile.controler";

const router = Router();
router.post("/", profileControler.createProfile);

export const profileRoute = router;
```

---

## ৮. অথেনটিকেশন ও টোকেন আর্কিটেকচার (JWT, Access & Refresh Token)

### টোকেন ফ্লোচার্ট:
```
             ┌──────────────────────────────────────────────────┐
             │ POST /api/v1/auth/login (Email + Password)       │
             └─────────────────────────┬────────────────────────┘
                                       │
                                       ▼
             ┌──────────────────────────────────────────────────┐
             │ 1. Verify User exists & is_active === true       │
             │ 2. Compare password with bcrypt.compare()        │
             └─────────────────────────┬────────────────────────┘
                                       │
                                       ▼
             ┌──────────────────────────────────────────────────┐
             │ Generate Tokens:                                 │
             │ - Access Token (Expires in 1 Hour)               │
             │ - Refresh Token (Expires in 10 Days)             │
             └─────────────────────────┬────────────────────────┘
                                       │
                      ┌────────────────┴────────────────┐
                      ▼                                 ▼
         ┌─────────────────────────┐       ┌─────────────────────────┐
         │ Refresh Token           │       │ Access Token            │
         │ res.cookie(...,         │       │ Response Body JSON Data │
         │   { httpOnly: true })   │       │ (Used in Auth Header)   │
         └─────────────────────────┘       └─────────────────────────┘
```

### ১. Auth Service (`src/modules/auth/auth.service.ts`)
```typescript
import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
  if (user.rowCount === 0) {
    throw new Error("invalid credintials");
  }

  const matchPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!matchPassword) {
    throw new Error("invalid credintials");
  }

  if (!user.rows[0].is_active) {
    throw new Error("user is blocked");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, { expiresIn: "1h" });
  const refreshToken = jwt.sign(jwtPayload, config.refresh_secret, { expiresIn: "10d" });

  return { accessToken, refreshToken, user: user.rows[0] };
};

const genaretAccessToken = async (token: string) => {
  if (!token) throw new Error("unauthorized access");

  const decode = jwt.verify(token, config.refresh_secret) as JwtPayload;
  const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [decode.email]);

  if (user.rowCount === 0) throw new Error("user not found");
  if (!user.rows[0].is_active) throw new Error("forbidden");

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, { expiresIn: "1h" });
  return { accessToken };
};

export const authService = { loginUserIntoDB, genaretAccessToken };
```

### ২. Auth Controller (`src/modules/auth/auth.controler.ts`)
```typescript
import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: false,
      httpOnly: true, // XSS অ্যাটাক প্রতিরোধ করার জন্য
      sameSite: "lax",
      path: "/",
      domain: "localhost",
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "user login successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error?.message || "Failed to login",
      error: error,
    });
  }
};

const genaretToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.genaretAccessToken(req.cookies.refreshToken);
    res.status(200).json({
      success: true,
      message: "access token generated",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to generate access token",
      error: error,
    });
  }
};

export const authControler = { loginUser, genaretToken };
```

### ৩. Auth Route (`src/modules/auth/auth.route.ts`)
```typescript
import { Router } from "express";
import { authControler } from "./auth.controler";

const router = Router();
router.post("/login", authControler.loginUser);
router.post("/refresh-token", authControler.genaretToken);

export const authRoute = router;
```

---

## ৯. কাস্টম মিডলওয়্যার ও টাইপস্ক্রিপ্ট এক্সটেনশন

### ১. Auth & Role-Based Access Control (RBAC) (`src/middleware/auth.ts`)
```typescript
import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Role } from "../types";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ success: false, message: "unauthorized access" });
      }

      const decode = jwt.verify(token as string, config.jwt_secret) as JwtPayload;
      const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [decode.email]);

      if (user.rowCount === 0) {
        return res.status(404).json({ success: false, message: "user not found" });
      }
      if (!user.rows[0].is_active) {
        return res.status(403).json({ success: false, message: "forbidden: user blocked" });
      }

      // Role Check
      if (roles.length && !roles.includes(user.rows[0].role)) {
        return res.status(401).json({ success: false, message: "unauthorized access" });
      }

      req.user = decode;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
```

### ২. TypeScript Type Augmentation (`src/middleware/index.d.ts`)
```typescript
import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
```

### ৩. Request File Logger (`src/middleware/logger.ts`)
```typescript
import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = async (req: Request, res: Response, next: NextFunction) => {
  const log = `\nMethod : ${req.method} | URL : ${req.url} | Time: ${Date.now()}\n`;
  fs.appendFile("logger.txt", log, (err) => {
    if (err) console.log(err);
  });
  next();
};

export default logger;
```

### ৪. Global Error Handler (`src/middleware/globalErrorHandaler.ts`)
```typescript
import type { NextFunction, Request, Response } from "express";

const globalErrorHandaler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default globalErrorHandaler;
```

---

## ১০. ইউটিলিটি ও রেসপন্স হ্যান্ডলিং

### `src/utils/sendResponse.ts`
```typescript
import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error,
  });
};

export default sendResponse;
```

### `src/types/index.ts`
```typescript
export type Role = "admin" | "agent" | "user";

export const USER_ROLE = {
  admin: "admin",
  agent: "agent",
  user: "user",
} as const;
```

---

## ১১. প্রজেক্ট রান ও এনভায়রনমেন্ট ভ্যারিয়েবল সেটআপ

### ১. `.env` কনফিগারেশন:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/my_database
JWT_SECRET=super_secret_jwt_access_token_key_here
JWT_REFRESH_SECRET=super_secret_jwt_refresh_token_key_here
```

### ২. সার্ভার চালানোর কমান্ড:
```bash
# ডেভেলপমেন্ট মোডে ওয়াচ সহ রান করার জন্য:
npm run dev
```
