import gql from "graphql-tag";

const brandSchema = gql`
  type Brand {
    id: ID!
    name: String!
    slug: String!
    image: String
    description: String
    category: Category!
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
    brandList: [Brand!]!
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
