import gql from 'graphql-tag';

const productSchema = gql`
  type Product {
    id: ID!
    title: String!
    slug: String!
    images: [String!]!
    description: String
    price: Float!
    discount: Float
    quantity: Int!
    is_pack: Boolean!
    created_at: String!
    updated_at: String!
    category: Category!
    brand: Brand!
  }

  input CreateProductInput {
    title: String!
    slug: String!
    images: [String!]!
    description: String
    price: Float!
    discount: Float
    quantity: Int!
    is_pack: Boolean!
    categoryId: ID!
    brandId: ID!
  }

  input UpdateProductInput {
    id: ID!
    title: String
    slug: String
    images: [String!]
    description: String
    price: Float
    discount: Float
    quantity: Int
    is_pack: Boolean
    categoryId: ID
    brandId: ID
  }

  type Query {
    productList(categoryId: ID): [Product!]!
    productSearch(keyword: String!): [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;

export default productSchema;
