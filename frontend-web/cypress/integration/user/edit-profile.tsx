describe("Edit profile", () => {
  const user = cy;
  beforeEach(() => {
    user.login("test@cypress.com", "1234");
  });

  it("can go to the /edit-profile using header", () => {
    user.get('a[href="/edit-profile"]').click();
    user.title().should("eq", "Edit profile | just eats");
  });

  it("can change the email", () => {
    user.visit("/edit-profile");
    user.findByPlaceholderText(/email/i).clear().type("hello@cypress.com");
    user.findByRole("button").click();
  });
});
