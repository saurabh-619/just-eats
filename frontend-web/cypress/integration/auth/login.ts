describe("Login page", () => {
  const user = cy;
  it("should see login page", () => {
    user.visit("/login").title().should("eq", "Login | just eats");
  });

  it("can see email / password validation errors", () => {
    user.visit("/login").get('[name="email"]').type("saurabh@gmail.com");
    user
      .get('[name="password"]')
      .type("123")
      .get("small")
      .should("have.text", "*password length should be at least 4");

    user.findByPlaceholderText(/password/i).type("1234");

    user.findByPlaceholderText(/email/i).clear();
    const errors = user.findAllByRole("alert");

    errors.should("have.text", "*email is a required field");
    user.findByPlaceholderText(/email/i).type("saurabh@gmail.com");
  });

  it("can fill out the form", () => {
    // @ts-ignore
    user.login("saurabhbomble107@gmail.com", "1234");
  });
});
