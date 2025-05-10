import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

import userSchema from "./schemas/userSchema";

import userResolver from "./resolvers/userResolver";

const typeDefs = mergeTypeDefs([
  userSchema,
]);
const resolvers = mergeResolvers([
  userResolver,
]);

export { typeDefs, resolvers };
