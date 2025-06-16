import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

import userSchema from "./schemas/userSchema";
import categorySchema from "./schemas/categorySchema";
import brandSchema from "./schemas/brandSchema";
import productSchema from "./schemas/productSchema";
import ticketSchema from "./schemas/ticketSchema";
import OrderSchema from "./schemas/OrderSchema";

import userResolver from "./resolvers/userResolver";
import categoryResolver from "./resolvers/categoryResolver";
import brandResolver from "./resolvers/brandResolver";
import productResolver from "./resolvers/productResolver";
import ticketResolvers from "./resolvers/ticketResolver";
import orderResolver from "./resolvers/orderResolver";

const typeDefs = mergeTypeDefs([
  userSchema,
  categorySchema,
  brandSchema,
  productSchema,
  ticketSchema,
  OrderSchema,
]);
const resolvers = mergeResolvers([
  userResolver,
  categoryResolver,
  brandResolver,
  productResolver,
  ticketResolvers,
  orderResolver,
]);

export { typeDefs, resolvers };
