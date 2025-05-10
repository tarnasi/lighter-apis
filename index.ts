import express, { Express } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import connectDB from "./config/db";
import { typeDefs, resolvers } from "./graphql";
import { getUserFromToken, AuthRequest } from "./middleware/auth";
import { GraphQLError } from "graphql";
import { GeneralAppException } from "./utils/exceptions";

const app: Express = express();
const port = process.env.PORT || 4000;

connectDB();
app.use(cors());
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }: { req: AuthRequest }) => {
        const user = getUserFromToken(req);
        const operationName = req.body?.operationName;
        const publicOperation = ["SendOtp", "VerifyOtp"];
        if (!user && !publicOperation.includes(operationName)) {
          if (!user) {
            throw new GeneralAppException(
              "Not authenticated 🛑",
              "NOT_AUTHORIZED",
              401
            );
          }
        }
        return { user };
      },
    })
  );

  // Start Express server
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}/graphql`);
  });
}

startServer();
