import { relations } from "drizzle-orm";
import { pgTable, index, primaryKey, pgEnum } from "drizzle-orm/pg-core";

export const StudentType = pgEnum("student_type", ["student", "staff", "admin", "rep"]);

export const Class = pgTable("class", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  description: t.text(),
}));

export const Student = pgTable("student", (t) => ({
  regNo: t.varchar({ length: 255 }).notNull().primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
  userId: t.uuid().notNull().references(() => User.id),
  class: t.uuid().notNull().references(() => Class.id),
}));

export const Attendance = pgTable("attendance", (t) => ({
    userId: t.uuid().notNull().references(() => User.id),
    date: t.date().notNull(),
    class: t.uuid().notNull().references(() => Class.id),
    period: t.integer().notNull().$type<1 | 2 | 3 | 4 | 5 | 6 | 7>(),
    isPresent: t.boolean().notNull(),
    rollNo: t.integer().notNull(),
  }), (attendance) => ({
    attendanceKey: primaryKey({
      name: "attendance_pkey",
      columns: [attendance.userId, attendance.date, attendance.period],
    }),
    presentIndex: index("present_idx").on(attendance.isPresent)
}));


export const Subject = pgTable("subject", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  class: t.uuid().notNull().references(() => Class.id),
}));


export const User = pgTable("user", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }),
  email: t.varchar({ length: 255 }),
  emailVerified: t.timestamp({ mode: "date", withTimezone: true }),
  image: t.varchar({ length: 255 }),
  type: t.varchar({ length: 255 }).$type<"student" | "staff" | "admin" | "rep">().references(StudentType),
}));

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
}));

export const Account = pgTable(
  "account",
  (t) => ({
    userId: t
      .uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    type: t
      .varchar({ length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: t.varchar({ length: 255 }).notNull(),
    providerAccountId: t.varchar({ length: 255 }).notNull(),
    refresh_token: t.varchar({ length: 255 }),
    access_token: t.text(),
    expires_at: t.integer(),
    token_type: t.varchar({ length: 255 }),
    scope: t.varchar({ length: 255 }),
    id_token: t.text(),
    session_state: t.varchar({ length: 255 }),
  }),
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = pgTable("session", (t) => ({
  sessionToken: t.varchar({ length: 255 }).notNull().primaryKey(),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: t.timestamp({ mode: "date", withTimezone: true }).notNull(),
}));

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));
