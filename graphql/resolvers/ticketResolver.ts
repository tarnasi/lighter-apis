import Ticket from "../../models/Ticket";

const ticketResolvers = {
  Query: {
    myTickets: async (_: any, __: any, { user }: any) => {
      return Ticket.find({ user: user._id })
        .sort({ created_at: -1 })
        .populate("user");
    },
    getTicket: async (_: any, { id }: any, { user }: any) => {
      const ticket = await Ticket.findById(id).populate("user");
      if (!ticket) throw new Error("Ticket not found");
      if (ticket.user._id.toString() !== user.userId.toString())
        throw new Error("Unauthorized");
      return ticket;
    },
  },
  Mutation: {
    createTicket: async (_: any, { subject, message }: any, { user }: any) => {
      if (!user) throw new Error("Unauthorized");

      const ticket = new Ticket({
        user: user.userId,
        subject,
        messages: [{ sender: "user", message }],
      });

      await ticket.save();
      return ticket.populate("user");
    },

    replyToTicket: async (
      _: any,
      { ticketId, message }: any,
      { user }: any
    ) => {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) throw new Error("Ticket not found");

      const sender = user.role === 'admin' ? "admin" : "user";

      if (!sender && ticket.user.toString() !== user.userId.toString()) {
        throw new Error("Unauthorized");
      }

      ticket.messages.push({ sender, message, created_at: new Date() });
      ticket.status = sender ? "answered" : "pending";
      await ticket.save();
      return ticket.populate('user')
    },

    closeTicket: async (_: any, { ticketId }: any, { user }: any) => {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) throw new Error("Ticket not found");

      if (ticket.user.toString() !== user.userId.toString())
        throw new Error("Unauthorized");

      ticket.status = "closed";
      await ticket.save();
      return ticket.populate('user')
    },
  },
};

export default ticketResolvers;
