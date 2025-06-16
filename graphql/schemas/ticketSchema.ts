import gql from "graphql-tag";

const TicketSchema = gql`
  type Message {
    sender: String!
    message: String!
    created_at: String!
  }

  type Ticket {
    id: ID!
    user: User!
    subject: String!
    status: String!
    messages: [Message!]!
    created_at: String!
    updated_at: String!
  }

  type Query {
    myTickets: [Ticket!]!
    getTicket(id: ID!): Ticket
  }

  type Mutation {
    createTicket(subject: String!, message: String!): Ticket!
    replyToTicket(ticketId: ID!, message: String!): Ticket!
    closeTicket(ticketId: ID!): Ticket!
  }
`;

export default TicketSchema;
