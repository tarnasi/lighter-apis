import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

import userSchema from "./schemas/userSchema";
import categorySchema from "./schemas/categorySchema";
import brandSchema from "./schemas/brandSchema";
import productSchema from "./schemas/productSchema";

import userResolver from "./resolvers/userResolver";
import categoryResolver from "./resolvers/categoryResolver";
import brandResolver from "./resolvers/brandResolver";
import productResolver from "./resolvers/productResolver";

const typeDefs = mergeTypeDefs([
  userSchema,
  categorySchema,
  brandSchema,
  productSchema,
]);
const resolvers = mergeResolvers([
  userResolver,
  categoryResolver,
  brandResolver,
  productResolver,
]);

export { typeDefs, resolvers };
