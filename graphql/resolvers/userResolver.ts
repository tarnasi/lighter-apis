import bcrypt from "bcryptjs";
import User from "../../models/User";
import { generateToken } from "../../utils/jwt";
import {
  CreateUserArgs,
  ResetPasswordInput,
  UpdateUserInput,
  UpdateUserProfileInput,
  UserContext,
} from "../../types/UserInterface";
import { GraphQLError } from "graphql";

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
    register: async (
      _: any,
      { full_name, mobile, email, password, birthday, wholesaler }: any
    ) => {
      const existingUser = await User.findOne({ mobile });
      if (existingUser) throw new Error("شماره موبایل قبلا ثبت شده است");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        full_name,
        mobile,
        email,
        birthday,
        password: hashedPassword,
        wholesaler,
      });

      return { token: generateToken(newUser.id), user: newUser };
    },

    login: async (_: any, { mobile, password }: any) => {
      const user = await User.findOne({ mobile });
      if (!user) throw new Error("شماره موبایل خود را اصلاح کنید");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("پسورد غیرمجاز");

      return { token: generateToken({ id: user.id, role: user.role }), user };
    },

    createUser: async (_: any, args: CreateUserArgs, context: UserContext) => {
      if (!context.user) {
        throw new Error("برای انجام این عملیات باید وارد شوید.");
      }

      if (context?.user?.role !== "admin") {
        throw new Error(
          "دسترسی غیرمجاز. فقط مدیران می‌توانند کاربر جدید بسازند."
        );
      }

      // ✅ destructure args
      const { role, full_name, mobile, email, password, birthday, wholesaler } =
        args;

      // ✅ بررسی تکراری بودن کاربر
      const existingUser = await User.findOne({
        $or: [{ email }, { mobile }],
      });

      if (existingUser) {
        throw new Error(
          "کاربری با این ایمیل یا شماره موبایل قبلاً ثبت شده است."
        );
      }

      // ✅ هش رمز عبور
      const hashedPassword = await bcrypt.hash(password, 12);

      // ✅ ساخت کاربر جدید
      const newUser = new User({
        role,
        full_name,
        mobile,
        email,
        password: hashedPassword,
        birthday,
        wholesaler,
      });

      await newUser.save();

      return {
        id: newUser._id,
        email: newUser.email,
        full_name: newUser.full_name,
        mobile: newUser.mobile,
        birthday: newUser.birthday,
        wholesaler: newUser.wholesaler,
        role: newUser.role,
      };
    },

    updateUser: async (
      _: any,
      { input }: { input: UpdateUserInput },
      context: UserContext
    ) => {
      if (!context.user) {
        throw new GraphQLError("باید وارد شوید", {
          extensions: { code: "UNAUTHORIZED", http: { status: 401 } },
        });
      }

      if (context.user.role !== "admin") {
        throw new GraphQLError(
          "دسترسی غیرمجاز. فقط مدیران می‌توانند کاربران را ویرایش کنند.",
          {
            extensions: { code: "FORBIDDEN", http: { status: 403 } },
          }
        );
      }

      const { id, ...updateFields } = input;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true }
      );

      if (!updatedUser) {
        throw new GraphQLError("کاربر یافت نشد", {
          extensions: { code: "NOT_FOUND", http: { status: 404 } },
        });
      }

      return {
        id: updatedUser._id,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        birthday: updatedUser.birthday,
        wholesaler: updatedUser.wholesaler,
      };
    },

    deleteUser: async (
      _: any,
      { id }: { id: string },
      context: UserContext
    ) => {
      if (!context.user) {
        throw new GraphQLError("باید وارد شوید", {
          extensions: { code: "UNAUTHORIZED", http: { status: 401 } },
        });
      }

      if (context.user.role !== "admin") {
        throw new GraphQLError(
          "دسترسی غیرمجاز. فقط مدیران می‌توانند کاربران را حذف کنند.",
          {
            extensions: { code: "FORBIDDEN", http: { status: 403 } },
          }
        );
      }

      const deleted = await User.findByIdAndDelete(id);

      if (!deleted) {
        throw new GraphQLError("کاربر یافت نشد", {
          extensions: { code: "NOT_FOUND", http: { status: 404 } },
        });
      }

      return true;
    },

    resetPassword: async (
      _: any,
      { input }: { input: ResetPasswordInput },
      context: UserContext
    ) => {
      if (!context.user) {
        throw new GraphQLError("برای انجام این عملیات باید وارد شوید.", {
          extensions: { code: "UNAUTHORIZED", http: { status: 401 } },
        });
      }

      const { confirm_password, new_password } = input;
      const user = await User.findById(context.user.userId);

      if (!user) {
        throw new GraphQLError("کاربر یافت نشد.", {
          extensions: { code: "NOT_FOUND", http: { status: 404 } },
        });
      }

      if (confirm_password !== new_password) {
        throw new GraphQLError("پسورد شما مورد تایید نمیباشد", {
          extensions: { code: "UNPROCESS", http: { status: 422 } },
        });
      }

      const hashedPassword = await bcrypt.hash(new_password, 12);
      user.password = hashedPassword;
      await user.save();
      return true;
    },

    updateProfile: async (
      _: any,
      { input }: { input: UpdateUserProfileInput },
      context: UserContext
    ) => {
      if (!context.user) {
        throw new GraphQLError("برای انجام این عملیات باید وارد شوید.", {
          extensions: { code: "UNAUTHORIZED", http: { status: 401 } },
        });
      }

      const { ...updateFields } = input;

      const updatedUser = await User.findByIdAndUpdate(
        context.user.userId,
        { $set: updateFields },
        { new: true }
      );

      if (!updatedUser) {
        throw new GraphQLError("کاربر یافت نشد", {
          extensions: { code: "NOT_FOUND", http: { status: 404 } },
        });
      }

      return {
        id: updatedUser._id,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        birthday: updatedUser.birthday,
        wholesaler: updatedUser.wholesaler,
      };
    },
  },
};

export default userResolver;
