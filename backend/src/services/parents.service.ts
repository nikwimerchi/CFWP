import { supabase } from "../db";
import { IChild } from "../interfaces/child.interface";
import { IUser } from "../interfaces/users.interface";
import { HttpException } from "../exceptions/HttpException";

/**
 * Find all users with the role 'parent' (Paginated)
 */
export const findAllParents = async (
  filter: object,
  skip: number,
  limit: number
): Promise<{ parents: IUser[]; total: number }> => {
  
  // 1. Fetch parents and the total count in a single request
  const { data: parents, count, error } = await supabase
    .from('users')
    .select('*, password', { count: 'exact' }) // Select password to remove it manually for safety
    .eq('role', 'parent')
    .match(filter)
    .range(skip, skip + limit - 1)
    .order('names', { ascending: true });

  if (error) throw new HttpException(500, error.message);

  // 2. Sanitize data: Exclude password from the response
  const sanitizedParents = (parents || []).map(({ password, ...rest }) => rest as IUser);

  return { 
    parents: sanitizedParents, 
    total: count || 0 
  };
};

/**
 * Find all children belonging to a specific parent
 */
export const findMyChildren = async (parentId: string): Promise<IChild[]> => {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('parentId', parentId)
    .order('firstName', { ascending: true });

  if (error) throw new HttpException(500, error.message);
  
  return data as IChild[];
};