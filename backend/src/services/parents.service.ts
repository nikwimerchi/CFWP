import { IChild } from "../interfaces/child.interface";
import { IUser } from "../interfaces/users.interface";
import childModel from "../models/child.model";
import userModel from "../models/users.model";

export const findAllParents = async (
  filter: object,
  skip: number,
  limit: number
): Promise<{ parents: IUser[]; total: number }> => {
  //all
  const allParents: IUser[] = await userModel.find({ role: "parent" });

  //specific
  const parents: IUser[] = await userModel
    .find({ ...filter, role: "parent" })
    .select("-password") // Exclude password field
    .skip(skip)
    .limit(limit);

  return { parents, total: allParents.length };
};

export const findMyChildren = async (parentId: string): Promise<IChild[]> => {
  const children: IChild[] = await childModel.find({ parentId });
  return children;
};
