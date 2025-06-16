import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

import userSchema from "./schemas/userSchema";
import categorySchema from "./schemas/categorySchema";
import brandSchema from "./schemas/brandSchema";
import productSchema from "./schemas/productSchema";
import ticketSchema from "./schemas/ticketSchema";

import userResolver from "./resolvers/userResolver";
import categoryResolver from "./resolvers/categoryResolver";
import brandResolver from "./resolvers/brandResolver";
import productResolver from "./resolvers/productResolver";
import { ticketResolvers } from "./resolvers/ticketResolver";

const typeDefs = mergeTypeDefs([
  userSchema,
  categorySchema,
  brandSchema,
  productSchema,
  ticketSchema,
]);
const resolvers = mergeResolvers([
  userResolver,
  categoryResolver,
  brandResolver,
  productResolver,
  ticketResolvers,
]);

export { typeDefs, resolvers };
