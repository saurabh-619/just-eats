describe("Create an Account", () => {
  const user = cy;
  it("should see email/password validation errors", () => {
    user.visit("/login");
    user.findByText(/create an account/i).click();

    user.findByPlaceholderText(/email/i).type("test@gmail");
    user.findByRole("alert").should("have.text", "*email is invalid");

    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "*email is a required field");

    user.findByPlaceholderText(/email/i).clear();
    user.findByPlaceholderText(/email/i).type("test@gmail.com");

    //   password
    user.findByPlaceholderText(/password/i).type("123");
    user
      .findByRole("alert")
      .should("have.text", "*password length should be at least 4");
  });

  it("should be able to create account", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;

      if (operationName && operationName === "CreateAccountOutput") {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: "CreateAccountOutput",
              },
            },
          });
        });
      }
    });

    user.findByPlaceholderText(/email/i).clear();
    user.findByPlaceholderText(/email/i).type("test@cypress.com");
    user.findByPlaceholderText(/password/).clear();
    user.findByPlaceholderText(/password/i).type("1234");
    user.findByRole("button").click();

    user.wait(1000);

    //   Login

    // @ts-ignore
    user.login("test@cypress.com", "1234");

    //Check token
    user.window().its("localStorage.just-eats-token").should("be.a", "string");
  });
});
