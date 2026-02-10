import httpStatus from "http-status";
import OpenAI from "openai";
import { supabase } from "../db";
import { HttpException } from "../exceptions/HttpException";
import { calculateYearsAndMonths, isEmpty } from "../utils/util";
import { ChatDto } from "../dtos/chat.dto"; // Corrected path/name
import { User } from "../models/users.model"; 
import { Chat } from "../models/chat"; // Use correct filename casing if your file is 'chat.ts'


const openai = new OpenAI({
  apiKey: process.env.OPEN_API_SECRET_KEY,
  organization: process.env.OPEN_API_ORGANIZATION_ID,
});

/**
 * Handle AI Chat regarding child health
 */
export const chatt = async (data: ChatDto, user: User): Promise<Chat> => {
  if (isEmpty(data)) throw new HttpException(httpStatus.BAD_REQUEST, "Invalid data");

  // 1. Verify Child Ownership (Note: Supabase uses snake_case in columns)
  const { data: child, error: childError } = await supabase
    .from('children')
    .select('*')
    .eq('id', data.childId)
    .eq('parent_id', user.id) // FIX: parent_id vs parentId
    .eq('status', 'approved')
    .single();

  if (childError || !child) {
    throw new HttpException(httpStatus.BAD_REQUEST, `Invalid child or unauthorized access.`);
  }

  const { months, years } = calculateYearsAndMonths(child.date_of_birth); // FIX: date_of_birth

  // 2. Fetch Health Data for context
  const { data: healthData, error: healthError } = await supabase
    .from('child_health_data')
    .select('*')
    .eq('child_id', data.childId); // FIX: child_id

  if (healthError || !healthData || healthData.length === 0) {
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      `Health info unavailable. Please wait for an advisor to update records.`
    );
  }

  try {
    // 3. Construct AI Prompt with recent health context
    const recentHealth = healthData[healthData.length - 1];
    const generalInfo = `My kid's name is ${child.first_name}. Age: ${years}y ${months}m. 
    Latest health stats: Height ${recentHealth.height}cm, Weight ${recentHealth.weight}kg.
    User Question: ${data.content}`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful pediatric health assistant. Only provide health advice." },
        { role: "user", content: generalInfo }
      ],
      model: "gpt-3.5-turbo",
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (aiResponse) {
      // 4. Save to Supabase (Mapping camelCase DTO to snake_case DB)
      const chatEntries = [
        { 
          child_id: data.childId, 
          content: data.content, 
          role: "user", 
          user_id: user.id 
        },
        { 
          child_id: data.childId, 
          content: aiResponse, 
          role: "assistant", 
          user_id: user.id 
        }
      ];

      const { data: savedChats, error: saveError } = await supabase
        .from('chats')
        .insert(chatEntries)
        .select();

      if (saveError) throw new HttpException(500, "Failed to save chat history.");

      // Return Assistant message mapped back to camelCase
      const lastChat = savedChats[1];
      return {
        ...lastChat,
        childId: lastChat.child_id,
        userId: lastChat.user_id
      } as Chat;
    } else {
      throw new HttpException(httpStatus.BAD_REQUEST, "AI failed to generate response.");
    }
  } catch (error) {
    throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, `AI Service Error: ${error.message}`);
  }
};

/**
 * Retrieve Chat History
 */
export const getChatts = async (childId: string, user: User): Promise<Chat[]> => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', user.id) // FIX: user_id
    .eq('child_id', childId) // FIX: child_id
    .order('created_at', { ascending: true });

  if (error) throw new HttpException(500, error.message);

  // Map results back to camelCase for the frontend
  return data.map(chat => ({
    ...chat,
    childId: chat.child_id,
    userId: chat.user_id,
    createdAt: chat.created_at
  })) as Chat[];
};