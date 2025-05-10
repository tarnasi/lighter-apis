import bycrypt from 'bcryptjs';
import User from '../../models/User';
import { generateToken } from '../../utils/jwt';

const userResolver = {
  Query: {
    me: async (_: any, __: any, { user }: any) => {
      if (!user) throw new Error('Not authenticated');
      return await User.findById(user.userId);
    },
  },

  Mutation: {
    register: async (_: any, { username, email, password }: any) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('Email already in use');

      const hashedPassword = await bycrypt.hash(password, 10);
      const newUser = await User.create({ username, email, password: hashedPassword });

      return { token: generateToken(newUser.id), user: newUser };
    },

    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid email');

      const isValid = await bycrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid password');

      return { token: generateToken(user.id), user };
    },
  },
};

export default userResolver;
