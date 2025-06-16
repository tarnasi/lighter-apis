import gql from "graphql-tag";

const OrderSchema = gql`
  type OrderItem {
    product: Product!
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    user: User!
    items: [OrderItem!]!
    status: String!
    total_price: Float!
    is_wholesaler: Boolean!
    created_at: String!
    updated_at: String!
  }

  input OrderItemInput {
    product: ID!
    quantity: Int!
    price: Float!
  }

  input CreateOrderInput {
    items: [OrderItemInput!]!
    is_wholesaler: Boolean
  }

  type Query {
    myOrders: [Order!]!
    getOrder(id: ID!): Order
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: String!): Order!
    cancelOrder(id: ID!): Order!
  }
`;

export default OrderSchema;
