import bcrypt from "bcryptjs";
import User from "../../models/User";
import { generateToken } from "../../utils/jwt";

const userResolver = {
  Query: {
    me: async (_: any, __: any, { user }: any) => {
      if (!user) throw new Error("مجاز نمیباشد");
      return await User.findById(user.userId);
    },

    userList: async (_: any, __: any, { user }: any) => {
      if (!user) throw new Error("مجاز نمیباشد");

      const currentUser = await User.findById(user.userId);
      if (currentUser?.role !== "admin") throw new Error("دسترسی غیرمجاز است");

      return await User.find({});
    },
  },

  Mutation: {
    register: async (_: any, { full_name, mobile, email, password, birthday, wholesaler }: any) => {
      const existingUser = await User.findOne({ mobile });
      if (existingUser) throw new Error("شماره موبایل قبلا ثبت شده است");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        full_name,
        mobile,
        email,
        birthday,
        password: hashedPassword,
        wholesaler
      });

      return { token: generateToken(newUser.id), user: newUser };
    },

    login: async (_: any, { mobile, password }: any) => {
      const user = await User.findOne({ mobile });
      if (!user) throw new Error("شماره موبایل خود را اصلاح کنید");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("پسورد غیرمجاز");

      return { token: generateToken(user.id), user };
    },
  },
};

export default userResolver;
