var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import express from "express";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  amFounder: () => amFounder,
  diaries: () => diaries,
  insertAmFounderSchema: () => insertAmFounderSchema,
  insertDiarySchema: () => insertDiarySchema,
  insertMidnightCafeSchema: () => insertMidnightCafeSchema,
  insertMindMazeSchema: () => insertMindMazeSchema,
  insertMoonMessengerSchema: () => insertMoonMessengerSchema,
  insertNightCircleSchema: () => insertNightCircleSchema,
  insertStarlitSpeakerSchema: () => insertStarlitSpeakerSchema,
  insertUserSchema: () => insertUserSchema,
  insertWhisperSchema: () => insertWhisperSchema,
  midnightCafe: () => midnightCafe,
  mindMaze: () => mindMaze,
  moonMessenger: () => moonMessenger,
  nightCircles: () => nightCircles,
  sessions: () => sessions,
  starlitSpeaker: () => starlitSpeaker,
  upsertUserSchema: () => upsertUserSchema,
  users: () => users,
  whispers: () => whispers
});
import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  // Changed to varchar for Replit Auth compatibility
  username: varchar("username", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  firebaseUid: varchar("firebase_uid", { length: 255 }),
  // For Firebase users
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var diaries = pgTable("diaries", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  isPublic: boolean("is_public").default(false),
  mood: varchar("mood", { length: 100 }),
  authorId: varchar("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var whispers = pgTable("whispers", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  hearts: integer("hearts").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var mindMaze = pgTable("mind_maze", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  options: text("options").array(),
  responses: integer("responses").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var nightCircles = pgTable("night_circles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  maxMembers: integer("max_members").default(8),
  currentMembers: integer("current_members").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var midnightCafe = pgTable("midnight_cafe", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  replies: integer("replies").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  id: z.string().optional()
});
var insertDiarySchema = createInsertSchema(diaries).omit({
  id: true,
  createdAt: true
});
var insertWhisperSchema = createInsertSchema(whispers).omit({
  id: true,
  hearts: true,
  createdAt: true
});
var insertMindMazeSchema = createInsertSchema(mindMaze).omit({
  id: true,
  responses: true,
  createdAt: true
});
var insertNightCircleSchema = createInsertSchema(nightCircles).omit({
  id: true,
  currentMembers: true,
  isActive: true,
  createdAt: true
});
var insertMidnightCafeSchema = createInsertSchema(midnightCafe).omit({
  id: true,
  replies: true,
  createdAt: true
});
var amFounder = pgTable("am_founder", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  upvotes: integer("upvotes").default(0),
  comments: integer("comments").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var starlitSpeaker = pgTable("starlit_speaker", {
  id: serial("id").primaryKey(),
  roomName: text("room_name").notNull(),
  description: text("description").notNull(),
  topic: text("topic").notNull(),
  maxParticipants: integer("max_participants").default(8),
  currentParticipants: integer("current_participants").default(1),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var moonMessenger = pgTable("moon_messenger", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  message: text("message").notNull(),
  sender: text("sender").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  isActive: boolean("is_active").default(true)
});
var insertAmFounderSchema = createInsertSchema(amFounder).omit({
  id: true,
  createdAt: true
});
var insertStarlitSpeakerSchema = createInsertSchema(starlitSpeaker).omit({
  id: true,
  createdAt: true
});
var insertMoonMessengerSchema = createInsertSchema(moonMessenger).omit({
  id: true,
  timestamp: true
});

// server/db.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var sql = neon(process.env.DATABASE_URL);
var db = drizzle(sql, { schema: schema_exports });

// server/storage.ts
import { eq, desc, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || void 0;
    } catch (error) {
      console.error("Error getting user:", error);
      return void 0;
    }
  }
  async getUserByUsername(username) {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || void 0;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return void 0;
    }
  }
  async createUser(insertUser) {
    const userData = {
      username: insertUser.username,
      email: insertUser.email,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      profileImageUrl: insertUser.profileImageUrl,
      firebaseUid: insertUser.firebaseUid
    };
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      firebaseUid: userData.firebaseUid,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        firebaseUid: userData.firebaseUid,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Diary operations
  async createDiary(diary) {
    const [newDiary] = await db.insert(diaries).values(diary).returning();
    return newDiary;
  }
  async getDiaries(filterPublic = false) {
    try {
      let result = await db.select().from(diaries).orderBy(desc(diaries.timestamp));
      if (filterPublic) {
        return result.filter((diary) => !diary.isPrivate);
      }
      return result;
    } catch (error) {
      console.error("Error getting diaries:", error);
      const mockDiaries = [
        {
          id: 1,
          content: "The city never sleeps, and neither do I. Tonight I watched the rain create patterns on my window, each drop a tiny universe of reflection. There's something magical about 3 AM thoughts - they feel more honest, more raw. I wonder if anyone else is awake right now, sharing this quiet moment with the night.",
          author: "NightWanderer",
          authorId: "user_001",
          isPrivate: false,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1e3)
          // 2 hours ago
        },
        {
          id: 2,
          content: "Had the strangest dream about floating through a library made of stars. Each book contained a different lifetime, a different possibility. When I woke up, I felt like I'd lived a thousand lives in those few hours of sleep. Dreams are the night's way of showing us infinite potential.",
          author: "DreamCatcher92",
          authorId: "user_002",
          isPrivate: false,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1e3)
          // 4 hours ago
        },
        {
          id: 3,
          content: "Tonight's moon is a silver coin tossed into the velvet sky. I made myself some chamomile tea and sat on my balcony, just breathing. Sometimes the best therapy is silence and starlight. The world feels different at night - softer, more forgiving, full of possibilities.",
          author: "MoonlitSoul",
          authorId: "user_003",
          isPrivate: false,
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1e3)
          // 6 hours ago
        },
        {
          id: 4,
          content: "Been thinking about time lately. How it moves differently in the dark. Minutes stretch like hours when you're lost in thought, but hours disappear like seconds when you're creating something beautiful. Tonight I wrote three poems and painted a small canvas. The night is my muse.",
          author: "CreativeSpirit",
          authorId: "user_004",
          isPrivate: false,
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1e3)
          // 8 hours ago
        },
        {
          id: 5,
          content: "There's a cat that visits my fire escape every night around midnight. Tonight I left out some milk and we shared a moment of understanding. Animals know something we've forgotten - how to simply exist without the weight of tomorrow's worries. Lessons from a midnight cat.",
          author: "UrbanNomad",
          authorId: "user_005",
          isPrivate: false,
          timestamp: new Date(Date.now() - 10 * 60 * 60 * 1e3)
          // 10 hours ago
        },
        {
          id: 6,
          content: "Insomnia has become my unwanted companion again. But instead of fighting it, I've learned to dance with it. Tonight I reorganized my bookshelf by color, discovered a letter from my grandmother I'd forgotten about, and realized that sleepless nights can be gifts in disguise.",
          author: "InsomniacPhilosopher",
          authorId: "user_006",
          isPrivate: false,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1e3)
          // 12 hours ago
        }
      ];
      if (filterPublic) {
        return mockDiaries.filter((diary) => !diary.isPrivate);
      }
      return mockDiaries;
    }
  }
  async getDiary(id) {
    try {
      const [diary] = await db.select().from(diaries).where(eq(diaries.id, id));
      return diary || void 0;
    } catch (error) {
      console.error("Error getting diary:", error);
      return void 0;
    }
  }
  // Whisper operations
  async createWhisper(whisper) {
    const [newWhisper] = await db.insert(whispers).values(whisper).returning();
    return newWhisper;
  }
  async getWhispers() {
    try {
      return await db.select().from(whispers).orderBy(desc(whispers.timestamp));
    } catch (error) {
      console.error("Error getting whispers:", error);
      return [
        {
          id: 1,
          content: "Sometimes the darkest nights produce the brightest stars \u2728",
          hearts: 23,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1e3)
        },
        {
          id: 2,
          content: "3 AM thoughts hit different... anyone else awake?",
          hearts: 45,
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1e3)
        },
        {
          id: 3,
          content: "The sound of rain at night is nature's lullaby \u{1F327}\uFE0F",
          hearts: 67,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1e3)
        }
      ];
    }
  }
  async incrementWhisperHearts(id) {
    try {
      const [whisper] = await db.select().from(whispers).where(eq(whispers.id, id));
      if (whisper) {
        await db.update(whispers).set({ hearts: (whisper.hearts || 0) + 1 }).where(eq(whispers.id, id));
      }
    } catch (error) {
      console.error("Error incrementing whisper hearts:", error);
    }
  }
  // Mind Maze operations
  async createMindMaze(maze) {
    const [newMaze] = await db.insert(mindMaze).values(maze).returning();
    return newMaze;
  }
  async getMindMaze() {
    try {
      return await db.select().from(mindMaze).orderBy(desc(mindMaze.timestamp));
    } catch (error) {
      console.error("Error getting mind maze:", error);
      return [
        {
          id: 1,
          type: "philosophy",
          content: "If you could have dinner with any historical figure, who would it be and what would you ask them?",
          responses: 12,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1e3)
        },
        {
          id: 2,
          type: "puzzle",
          content: "A man lives on the 20th floor. Every morning he takes the elevator down. When he comes home, he takes the elevator to the 10th floor and walks the rest... unless it's raining. Why?",
          responses: 8,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1e3)
        }
      ];
    }
  }
  async incrementMindMazeResponses(id) {
    try {
      const [maze] = await db.select().from(mindMaze).where(eq(mindMaze.id, id));
      if (maze) {
        await db.update(mindMaze).set({ responses: (maze.responses || 0) + 1 }).where(eq(mindMaze.id, id));
      }
    } catch (error) {
      console.error("Error incrementing mind maze responses:", error);
    }
  }
  // Night Circle operations
  async createNightCircle(circle) {
    const [newCircle] = await db.insert(nightCircles).values(circle).returning();
    return newCircle;
  }
  async getNightCircles() {
    try {
      return await db.select().from(nightCircles).orderBy(desc(nightCircles.timestamp));
    } catch (error) {
      console.error("Error getting night circles:", error);
      return [
        {
          id: 1,
          name: "Midnight Philosophers",
          members: 45,
          active: true,
          online: 12,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1e3)
        },
        {
          id: 2,
          name: "Night Owls Unite",
          members: 78,
          active: true,
          online: 23,
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1e3)
        },
        {
          id: 3,
          name: "Dream Sharers",
          members: 32,
          active: false,
          online: 5,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1e3)
        }
      ];
    }
  }
  async updateNightCircleMembers(id, members) {
    try {
      await db.update(nightCircles).set({ members }).where(eq(nightCircles.id, id));
    } catch (error) {
      console.error("Error updating night circle members:", error);
    }
  }
  // Midnight Cafe operations
  async createMidnightCafe(cafe) {
    const [newCafe] = await db.insert(midnightCafe).values(cafe).returning();
    return newCafe;
  }
  async getMidnightCafe() {
    try {
      return await db.select().from(midnightCafe).orderBy(desc(midnightCafe.timestamp));
    } catch (error) {
      console.error("Error getting midnight cafe:", error);
      return [
        {
          id: 1,
          content: "What's everyone's go-to late night snack? I'm currently obsessed with honey toast and chamomile tea \u{1F36F}",
          author: "NightFoodie",
          authorId: "user_007",
          replies: 15,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1e3)
        },
        {
          id: 2,
          content: "Anyone else find that their best ideas come at 2 AM? Just had a breakthrough on a project I've been stuck on for weeks!",
          author: "CreativeMind",
          authorId: "user_008",
          replies: 8,
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1e3)
        },
        {
          id: 3,
          content: "Watching the sunrise after staying up all night hits different. There's something magical about witnessing the world wake up \u{1F305}",
          author: "SunriseWatcher",
          authorId: "user_009",
          replies: 22,
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1e3)
        }
      ];
    }
  }
  async incrementCafeReplies(id) {
    try {
      const [cafe] = await db.select().from(midnightCafe).where(eq(midnightCafe.id, id));
      if (cafe) {
        await db.update(midnightCafe).set({ replies: (cafe.replies || 0) + 1 }).where(eq(midnightCafe.id, id));
      }
    } catch (error) {
      console.error("Error incrementing cafe replies:", error);
    }
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}

// server/routes.ts
var router = express.Router();
router.get("/diaries", async (req, res) => {
  try {
    const diaries2 = await storage.getDiaries(true);
    res.json(diaries2);
  } catch (error) {
    console.error("Error getting diaries:", error);
    res.status(500).json({ error: "Failed to fetch diaries" });
  }
});
router.post("/diaries", async (req, res) => {
  try {
    const diaryData = insertDiarySchema.parse(req.body);
    const diary = await storage.createDiary(diaryData);
    res.status(201).json(diary);
  } catch (error) {
    console.error("Error creating diary:", error);
    res.status(400).json({ error: "Invalid diary data" });
  }
});
router.get("/whispers", async (req, res) => {
  try {
    const whispers2 = await storage.getWhispers();
    res.json(whispers2);
  } catch (error) {
    console.error("Error getting whispers:", error);
    res.status(500).json({ error: "Failed to fetch whispers" });
  }
});
router.post("/whispers", async (req, res) => {
  try {
    const whisperData = insertWhisperSchema.parse(req.body);
    const whisper = await storage.createWhisper(whisperData);
    res.status(201).json(whisper);
  } catch (error) {
    console.error("Error creating whisper:", error);
    res.status(400).json({ error: "Invalid whisper data" });
  }
});
router.patch("/whispers/:id/hearts", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.incrementWhisperHearts(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error incrementing hearts:", error);
    res.status(500).json({ error: "Failed to increment hearts" });
  }
});
router.get("/mindMaze", async (req, res) => {
  try {
    const mindMaze2 = await storage.getMindMaze();
    res.json(mindMaze2);
  } catch (error) {
    console.error("Error getting mind maze:", error);
    res.status(500).json({ error: "Failed to fetch mind maze" });
  }
});
router.post("/mindMaze", async (req, res) => {
  try {
    const mindMazeData = insertMindMazeSchema.parse(req.body);
    const mindMaze2 = await storage.createMindMaze(mindMazeData);
    res.status(201).json(mindMaze2);
  } catch (error) {
    console.error("Error creating mind maze:", error);
    res.status(400).json({ error: "Invalid mind maze data" });
  }
});
router.patch("/mindMaze/:id/responses", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.incrementMindMazeResponses(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error incrementing responses:", error);
    res.status(500).json({ error: "Failed to increment responses" });
  }
});
router.get("/nightCircles", async (req, res) => {
  try {
    const nightCircles2 = await storage.getNightCircles();
    res.json(nightCircles2);
  } catch (error) {
    console.error("Error getting night circles:", error);
    res.status(500).json({ error: "Failed to fetch night circles" });
  }
});
router.post("/nightCircles", async (req, res) => {
  try {
    const nightCircleData = insertNightCircleSchema.parse(req.body);
    const nightCircle = await storage.createNightCircle(nightCircleData);
    res.status(201).json(nightCircle);
  } catch (error) {
    console.error("Error creating night circle:", error);
    res.status(400).json({ error: "Invalid night circle data" });
  }
});
router.patch("/nightCircles/:id/members", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { members } = req.body;
    await storage.updateNightCircleMembers(id, members);
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating members:", error);
    res.status(500).json({ error: "Failed to update members" });
  }
});
router.get("/midnightCafe", async (req, res) => {
  try {
    const midnightCafe2 = await storage.getMidnightCafe();
    res.json(midnightCafe2);
  } catch (error) {
    console.error("Error getting midnight cafe:", error);
    res.status(500).json({ error: "Failed to fetch midnight cafe" });
  }
});
router.post("/midnightCafe", async (req, res) => {
  try {
    const midnightCafeData = insertMidnightCafeSchema.parse(req.body);
    const midnightCafe2 = await storage.createMidnightCafe(midnightCafeData);
    res.status(201).json(midnightCafe2);
  } catch (error) {
    console.error("Error creating midnight cafe post:", error);
    res.status(400).json({ error: "Invalid midnight cafe data" });
  }
});
router.patch("/midnightCafe/:id/replies", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.incrementCafeReplies(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error incrementing replies:", error);
    res.status(500).json({ error: "Failed to increment replies" });
  }
});
router.get("/amFounder", async (req, res) => {
  try {
    const founders = await storage.getAmFounder();
    res.json(founders);
  } catch (error) {
    console.error("Error getting 3AM founders:", error);
    res.status(500).json({ error: "Failed to fetch 3AM founders" });
  }
});
router.post("/amFounder", async (req, res) => {
  try {
    const founderData = insertAmFounderSchema.parse(req.body);
    const founder = await storage.createAmFounder(founderData);
    res.status(201).json(founder);
  } catch (error) {
    console.error("Error creating 3AM founder:", error);
    res.status(400).json({ error: "Invalid 3AM founder data" });
  }
});
router.patch("/amFounder/:id/upvotes", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.incrementFounderUpvotes(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error incrementing upvotes:", error);
    res.status(500).json({ error: "Failed to increment upvotes" });
  }
});
router.patch("/amFounder/:id/comments", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.incrementFounderComments(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error incrementing comments:", error);
    res.status(500).json({ error: "Failed to increment comments" });
  }
});
router.get("/starlitSpeaker", async (req, res) => {
  try {
    const speakers = await storage.getStarlitSpeaker();
    res.json(speakers);
  } catch (error) {
    console.error("Error getting starlit speakers:", error);
    res.status(500).json({ error: "Failed to fetch starlit speakers" });
  }
});
router.post("/starlitSpeaker", async (req, res) => {
  try {
    const speakerData = insertStarlitSpeakerSchema.parse(req.body);
    const speaker = await storage.createStarlitSpeaker(speakerData);
    res.status(201).json(speaker);
  } catch (error) {
    console.error("Error creating starlit speaker:", error);
    res.status(400).json({ error: "Invalid starlit speaker data" });
  }
});
router.patch("/starlitSpeaker/:id/participants", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { participants } = req.body;
    await storage.updateSpeakerParticipants(id, participants);
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating participants:", error);
    res.status(500).json({ error: "Failed to update participants" });
  }
});
router.get("/moonMessenger/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await storage.getMoonMessages(sessionId);
    res.json(messages);
  } catch (error) {
    console.error("Error getting moon messages:", error);
    res.status(500).json({ error: "Failed to fetch moon messages" });
  }
});
router.post("/moonMessenger", async (req, res) => {
  try {
    const messageData = insertMoonMessengerSchema.parse(req.body);
    const message = await storage.createMoonMessage(messageData);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating moon message:", error);
    res.status(400).json({ error: "Invalid moon message data" });
  }
});
router.get("/moonMessenger", async (req, res) => {
  try {
    const sessions2 = await storage.getActiveSessions();
    res.json(sessions2);
  } catch (error) {
    console.error("Error getting active sessions:", error);
    res.status(500).json({ error: "Failed to fetch active sessions" });
  }
});
async function registerRoutes(app2) {
  try {
    await setupAuth(app2);
    console.log("Replit authentication configured successfully");
  } catch (error) {
    console.log("Replit auth not available, continuing without authentication");
  }
  app2.get("/api/auth/user", async (req, res) => {
    try {
      if (req.user && req.user.claims && req.user.claims.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } else {
        res.json(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.json(null);
    }
  });
  app2.use("/api", router);
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws"
  });
  const rooms = /* @__PURE__ */ new Map();
  const userRooms = /* @__PURE__ */ new Map();
  const waitingQueue = [];
  wss.on("connection", (ws) => {
    console.log("New WebSocket connection");
    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        switch (message.type) {
          case "join_room":
            joinRoom(ws, message.roomId, message.username);
            break;
          case "leave_room":
            leaveRoom(ws);
            break;
          case "chat_message":
            broadcastToRoom(ws, message);
            break;
          case "video_offer":
          case "video_answer":
          case "ice_candidate":
            forwardVideoSignaling(ws, message);
            break;
          case "join_random":
            joinRandomPairing(ws, message.username);
            break;
          case "user_report":
            handleUserReport(ws, message);
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws.on("close", () => {
      leaveRoom(ws);
      const queueIndex = waitingQueue.indexOf(ws);
      if (queueIndex > -1) {
        waitingQueue.splice(queueIndex, 1);
      }
    });
  });
  function joinRoom(ws, roomId, username) {
    leaveRoom(ws);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, /* @__PURE__ */ new Set());
    }
    rooms.get(roomId).add(ws);
    userRooms.set(ws, roomId);
    broadcastToRoom(ws, {
      type: "user_joined",
      username,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    ws.send(JSON.stringify({
      type: "room_joined",
      roomId,
      memberCount: rooms.get(roomId).size
    }));
  }
  function leaveRoom(ws) {
    const roomId = userRooms.get(ws);
    if (roomId && rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.delete(ws);
      userRooms.delete(ws);
      if (room.size === 0) {
        rooms.delete(roomId);
      } else {
        room.forEach((client2) => {
          client2.send(JSON.stringify({
            type: "user_left",
            memberCount: room.size,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }));
        });
      }
    }
  }
  function broadcastToRoom(sender, message) {
    const roomId = userRooms.get(sender);
    if (roomId && rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.forEach((client2) => {
        if (client2 !== sender && client2.readyState === WebSocket.OPEN) {
          client2.send(JSON.stringify(message));
        }
      });
    }
  }
  function forwardVideoSignaling(sender, message) {
    const roomId = userRooms.get(sender);
    if (roomId && rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.forEach((client2) => {
        if (client2 !== sender && client2.readyState === WebSocket.OPEN) {
          client2.send(JSON.stringify(message));
        }
      });
    }
  }
  function joinRandomPairing(ws, username) {
    if (waitingQueue.length > 0) {
      const partner = waitingQueue.shift();
      const roomId = `random_${Date.now()}`;
      joinRoom(ws, roomId, username);
      joinRoom(partner, roomId, "Random User");
      [ws, partner].forEach((client2) => {
        client2.send(JSON.stringify({
          type: "random_paired",
          roomId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }));
      });
    } else {
      waitingQueue.push(ws);
      ws.send(JSON.stringify({
        type: "waiting_for_pair",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
    }
  }
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
