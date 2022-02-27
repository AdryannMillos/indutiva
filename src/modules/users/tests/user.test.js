const request = require("supertest");
const app = require("../../../app");
const User = require("../../../models/User")

describe("Post -> Create an User --> /api/v1/users/create", () => {
  const user = {
    userName: "1nsaw2me",
    email: "e1masiw2l@example.com",
    password: "Thriller",
    confirmPassword: "Thriller",
  };
  it("Create an book", async () => {
    return await request(app)
      .post("/api/v1/users/create")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(201)
      .expect({message:'User Created successfully'});
  });
//   afterAll(async () => {
//     await User.destroy({ where: { email: user.email }});
//   });
});
