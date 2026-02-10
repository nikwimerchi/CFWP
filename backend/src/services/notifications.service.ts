import httpStatus from "http-status";
import OpenAI from "openai";
import { supabase } from "../db";
import { INotification } from "../interfaces/notifications.interface";
import { HttpException } from "../exceptions/HttpException";
import { sendEmail } from "../utils/util";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPEN_API_SECRET_KEY,
  organization: process.env.OPEN_API_ORGANIZATION_ID,
});

/**
 * Identify unhealthy children and send AI-generated nutritional alerts to parents
 */
export const sendAlert = async () => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // 1. Fetch health data AND parent info in ONE query using Supabase joins
  const { data: records, error } = await supabase
    .from('child_health_data')
    .select(`
      healthCondition,
      child:children!childId (
        firstName,
        lastName,
        parent:users!parentId (id, email, names)
      )
    `)
    .in('healthCondition', ['red', 'yellow'])
    .eq('year', year)
    .eq('month', month);

  if (error || !records || records.length === 0) {
    throw new HttpException(httpStatus.NOT_FOUND, "No unhealthy children found for this period.");
  }

  try {
    // 2. Get Nutritional Advice from AI (One call for all parents to save tokens)
    const completion = await openai.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: "I need a list of 10 essential ingredients to prepare nutritious meals for malnourished children. Keep it concise." 
      }],
      model: "gpt-3.5-turbo",
    });

    const aiAdvice = completion.choices[0]?.message?.content;
    if (!aiAdvice) throw new Error("AI failed to provide content.");

    // 3. Dispatch Notifications
    for (const record of records) {
      const child = record.child;
      const parent = child?.parent;

      if (parent && parent.email) {
        const title = `Nutritional Guide for ${child.firstName} ${child.lastName}`;
        
        // Save In-App Notification
        await sendNotification(parent.id, title, aiAdvice);
        
        // Send External Email
        await sendEmail(title, parent.email, aiAdvice);
      }
    }
    
    return { success: true, alertedCount: records.length };
  } catch (error) {
    throw new HttpException(httpStatus.BAD_REQUEST, `Alerting failed: ${error.message}`);
  }
};

/**
 * Save in-app notification to database
 */
export const sendNotification = async (userId: string, title: string, message: string) => {
  try {
    await supabase
      .from('notifications')
      .insert([{ userId, title, content: message, isRead: false }]);
  } catch (error) {
    console.error("Notification logging failed:", error);
  }
};

/**
 * Mark all user notifications as read
 */
export const readAllNotifications = async (userId: string) => {
  await supabase
    .from('notifications')
    .update({ isRead: true })
    .eq('userId', userId);
};

/**
 * Get user notifications
 */
export const getNotifications = async (userId: string): Promise<INotification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: false });

  if (error) throw new HttpException(500, error.message);
  return data as INotification[];
};

/**
 * Delete specific notification
 */
export const deleteNotification = async (id: string, userId: string) => {
  await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('userId', userId);
};