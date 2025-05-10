const userSchema = `
    type User {
        id: ID!
        username: String!
        email: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        me: User
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload
    }
`;

export default userSchema;
