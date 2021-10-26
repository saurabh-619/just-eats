module.exports = {
  client: {
    tagName: "gql",
    inlcudes: ["./src/**/*.ts", "./src/**/*.tsx"],
    service: {
      name: "just-eats-backend",
      url: "http://localhost:4000/graphql",
    },
  },
};
