import bcrypt from "bcryptjs";
import { db } from "./db";
import { users, projects, frames, chats } from "./schema";
import { eq } from "drizzle-orm";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  const today = new Date().toISOString().split("T")[0];

  const [user] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      dailyMessagesUsed: 0,
      dailyQuotaDate: today,
    })
    .returning();

  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function getUserById(id: number) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

const DAILY_QUOTA_LIMIT = 25;

export async function getUserQuota(userId: number) {
  const user = await getUserById(userId);
  if (!user)
    return { used: 0, total: DAILY_QUOTA_LIMIT, remaining: DAILY_QUOTA_LIMIT };

  const today = new Date().toISOString().split("T")[0];
  const userDate = user.dailyQuotaDate;

  // Reset if it's a new day
  if (userDate !== today) {
    await db
      .update(users)
      .set({ dailyMessagesUsed: 0, dailyQuotaDate: today })
      .where(eq(users.id, userId));
    return { used: 0, total: DAILY_QUOTA_LIMIT, remaining: DAILY_QUOTA_LIMIT };
  }

  const used = user.dailyMessagesUsed || 0;
  return {
    used,
    total: DAILY_QUOTA_LIMIT,
    remaining: DAILY_QUOTA_LIMIT - used,
  };
}

export async function incrementQuotaUsage(userId: number) {
  const quota = await getUserQuota(userId);

  if (quota.remaining <= 0) {
    return { success: false, error: "Daily quota exceeded", quota };
  }

  const today = new Date().toISOString().split("T")[0];
  await db
    .update(users)
    .set({
      dailyMessagesUsed: quota.used + 1,
      dailyQuotaDate: today,
    })
    .where(eq(users.id, userId));

  return {
    success: true,
    quota: {
      used: quota.used + 1,
      total: DAILY_QUOTA_LIMIT,
      remaining: quota.remaining - 1,
    },
  };
}

export async function createProject(data: {
  projectId: string;
  name: string;
  userId: number;
}) {
  const [project] = await db
    .insert(projects)
    .values({
      projectId: data.projectId,
      name: data.name,
      userId: data.userId,
    })
    .returning();

  return project;
}

export async function getProjectsByUserId(userId: number) {
  return db.select().from(projects).where(eq(projects.userId, userId));
}

export async function getProjectById(projectId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.projectId, projectId));
  return project;
}

export async function deleteProject(projectId: string) {
  await db.delete(frames).where(eq(frames.projectId, projectId));
  await db.delete(projects).where(eq(projects.projectId, projectId));
}

export async function createFrame(data: {
  frameId: string;
  projectId: string;
  designCode: string;
}) {
  const [frame] = await db
    .insert(frames)
    .values({
      frameId: data.frameId,
      projectId: data.projectId,
      designCode: data.designCode,
    })
    .returning();

  return frame;
}

export async function getFramesByProjectId(projectId: string) {
  return db.select().from(frames).where(eq(frames.projectId, projectId));
}

export async function updateFrameDesign(frameId: string, designCode: string) {
  await db
    .update(frames)
    .set({ designCode })
    .where(eq(frames.frameId, frameId));
}

export async function saveChat(data: {
  frameId: string;
  userId: number;
  messages: Array<{ role: string; content: string }>;
}) {
  const [chat] = await db
    .insert(chats)
    .values({
      frameId: data.frameId,
      userId: data.userId,
      messages: data.messages,
    })
    .returning();

  return chat;
}

export async function getChatByFrameId(frameId: string) {
  const [chat] = await db
    .select()
    .from(chats)
    .where(eq(chats.frameId, frameId));
  return chat;
}

export async function updateChatMessages(
  frameId: string,
  messages: Array<{ role: string; content: string }>
) {
  await db.update(chats).set({ messages }).where(eq(chats.frameId, frameId));
}
