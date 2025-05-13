const userSchema = `
    type User {
        id: ID!
        full_name: String!
        mobile: String!
        email: String
        role: String!
        wholesaler: Boolean!
        birthday: String
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
    }
`;

export default userSchema;
