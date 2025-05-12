const userSchema = `
    type User {
        id: ID!
        mobile: String!
        email: String
        role: String!
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
        register(mobile: String!, email: String, password: String!, birthday: String): AuthPayload
        login(mobile: String!, password: String!): AuthPayload
    }
`;

export default userSchema;
