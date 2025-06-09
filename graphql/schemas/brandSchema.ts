import gql from "graphql-tag";

const brandSchema = gql`
  enum SortType {
    ASC
    DESC
  }

  input sortBrandInput {
    field: String!
    order: SortType!
  }

  input BrandPaginationInput {
    page: Int!
    pageSize: Int!
  }

  type PaginatedBrands {
    items: [Brand!]!
    total: Int!
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
  }

  type Brand {
    id: ID!
    name: String!
    slug: String!
    image: String
    description: String
    category: Category!
    products: [Product!]!
  }

  input CreateBrandInput {
    name: String!
    slug: String!
    image: String
    description: String
    categoryId: ID!
  }

  input UpdateBrandInput {
    id: ID!
    name: String
    slug: String
    image: String
    description: String
    categoryId: ID
  }

  type Query {
    brandList(
      search: String
      sort: sortBrandInput
      pagination: BrandPaginationInput
    ): PaginatedBrands!
    brandSearch(keyword: String!): [Brand!]!
    brand(id: ID!): Brand
  }

  type Mutation {
    createBrand(input: CreateBrandInput!): Brand!
    updateBrand(input: UpdateBrandInput!): Brand!
    deleteBrand(id: ID!): Boolean!
  }
`;

export default brandSchema;
