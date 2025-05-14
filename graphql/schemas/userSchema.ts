import gql from 'graphql-tag'

const userSchema = gql`
  type User {
    id: ID!
    full_name: String!
    mobile: String!
    email: String
    role: String!
    wholesaler: Boolean!
    birthday: String
  }
  
  input UpdateUserInput {
    id: ID!
    full_name: String
    email: String
    mobile: String
    role: String
    birthday: String
    wholesaler: Boolean
  }
  
  input UpdateUserProfileInput {
    full_name: String
    email: String
    mobile: String
    role: String
    birthday: String
    wholesaler: Boolean
  }
  
  input ResetPasswordInput {
    new_password: String!
    confirm_password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    userList: [User!]!
  }

  type Mutation {
    register(full_name: String!, mobile: String!, email: String, password: String!, birthday: String, wholesaler: Boolean): AuthPayload
    login(mobile: String!, password: String!): AuthPayload
    createUser(role: String!, full_name: String!, mobile: String!, email: String, password: String!, birthday: String, wholesaler: Boolean): User
    updateUser(input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    resetPassword(input: ResetPasswordInput): Boolean!
    updateProfile(input: UpdateUserProfileInput!): User!
  }
`;

export default userSchema;
