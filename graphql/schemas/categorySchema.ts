// schema.ts
import gql from "graphql-tag";

const categorySchema = gql`
  type Brand {
    id: ID!
    name: String!
    slug: String!
    image: String
    description: String
    category: Category!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    image: String
    description: String
    brands: [Brand!]! # 👈 Add this field
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
    categoryList: [Category!]!
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
