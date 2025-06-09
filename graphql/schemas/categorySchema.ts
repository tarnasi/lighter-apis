// schema.ts
import gql from "graphql-tag";

const categorySchema = gql`
  enum SortOrder {
    ASC
    DESC
  }

  input CategorySortInput {
    field: String!
    order: SortOrder!
  }

  input CategoryPaginationInput {
    page: Int!
    pageSize: Int!
  }

  type PaginatedCategories {
    items: [Category!]
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

  type Category {
    id: ID!
    name: String!
    slug: String!
    image: String
    description: String
    brands: [Brand!]!
  }

  input CreateCategoryInput {
    name: String!
    slug: String!
    image: String
    description: String
  }

  input UpdateCategoryInput {
    id: ID!
    name: String
    slug: String
    image: String
    description: String
  }

  type Query {
    categoryList(
      search: String
      sort: CategorySortInput
      pagination: CategoryPaginationInput
    ): PaginatedCategories!
    categorySearch(keyword: String!): [Category!]!
    category(id: ID!): Category
  }

  type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;

export default categorySchema;
