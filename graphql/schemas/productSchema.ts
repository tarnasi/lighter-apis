import gql from "graphql-tag";

const productSchema = gql`
  enum SortOrder {
    ASC
    DESC
  }

  input SortProductInput {
    field: String!
    order: SortOrder!
  }

  input PaginationProductInput {
    page: Int!
    pageSize: Int!
  }

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
    category: Category
    brand: Brand
  }

  type PaginateProduct {
    items: [Product!]!
    total: Int!
    page: Int!
    pageSize: Int!
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
    productList(
      categoryId: ID,
      brandId: ID,
      search: String,
      sort: SortProductInput,
      pagination: PaginationProductInput
    ): PaginateProduct!
    productByCategorySlug(
      catSlug: String!,
      pagination: PaginationProductInput,
      sort: SortProductInput
    ): PaginateProduct!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;

export default productSchema;
