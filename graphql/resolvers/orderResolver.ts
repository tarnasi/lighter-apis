import Order from "../../models/Order";
import Product from "../../models/Product";

const orderResolvers = {
  Query: {
    myOrders: async (_: any, __: any, { user }: any) => {
      return Order.find({ user: user._id })
        .sort({ created_at: -1 })
        .populate("items.product user");
    },
    getOrder: async (_: any, { id }: any, { user }: any) => {
      const order = await Order.findById(id).populate("items.product user");
      if (!order) throw new Error("Order not found");
      if (order.user.toString() !== user.userId.toString())
        throw new Error("Unauthorized");
      return order;
    },
  },

  Mutation: {
    createOrder: async (_: any, { input }: any, { user }: any) => {
      if (!user) throw new Error("Unauthorized");

      const total_price = input.items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.price,
        0
      );

      const order = new Order({
        user: user.userId,
        items: input.items,
        total_price,
        is_wholesaler: input.is_wholesaler || false,
      });

      await order.save();
      return order.populate("items.product user");
    },

    updateOrderStatus: async (_: any, { id, status }: any, { user }: any) => {
      const order = await Order.findById(id);
      if (!order) throw new Error("Order not found");
      // optional: check admin role
      order.status = status;
      await order.save();
      return order.populate("items.product user");
    },

    cancelOrder: async (_: any, { id }: any, { user }: any) => {
      const order = await Order.findById(id);
      if (!order) throw new Error("Order not found");
      if (order.user.toString() !== user.userId.toString())
        throw new Error("Unauthorized");

      order.status = "cancelled";
      await order.save();
      return order.populate("items.product user");
    },
  },
};

export default orderResolvers;
