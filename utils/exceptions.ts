import { GraphQLError } from "graphql";

export class GeneralAppException extends GraphQLError {
  constructor(
    message: string = "Server Crashed 🛬",
    code: string = "SERVER_ERROR",
    status: Number = 500
  ) {
    super(message, {
      extensions: {
        code: code,
        status: status,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
