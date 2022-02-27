const request = require("supertest");
const app = require("../../../app");
const Models = require("../../../models/index");

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
      .expect({ message: "User Created successfully" });
  });
  it("Password does not match", async () => {
    return await request(app)
      .post("/api/v1/users/create")
      .send({
        userName: "lulu",
        email: "elias@example.com",
        password: "1234",
        confirmPassword: "12344",
      })
      .expect("Content-Type", /json/)
      .expect(401)
      .expect({ message: "Password does not match" });
  });
  afterAll(async () => {
    await Models.User.destroy({ where: { email: "e1masiw2l@example.com" } });
  });
});

describe("Get -> Get all Uses --> /api/v1/users/", () => {
  it("should return all uses", async () => {
    return await request(app)
      .get("/api/v1/users/")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Put -> Update an user --> /api/v1/users/update/:id", () => {
  it("should update an user", async () => {
    const user = {
      userName: "Adryann123",
      email: "el123@example.com",
      password: "Thriller",
      confirmPassword: "Thriller",
    };
    await Models.User.create(user);
    const foundUser = await Models.User.findOne({
      where: { email: "el123@example.com" },
    });
    const userId = foundUser.id;
    return await request(app)
      .put("/api/v1/users/update/" + userId)
      .send({
        userName: "lulu",
        email: "elias@example.com",
        password: "12344",
        confirmPassword: "12344",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect({ message: "User Updated successfully" });
  });
  it("should not found an user", async () => {
    return await request(app)
      .put("/api/v1/users/update/999")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect({ message: "User Not Found" });
  });
  afterAll(async () => {
    await Models.User.destroy({ where: { email: "elias@example.com" } });
  });
});

describe("Delete -> Delete an user --> /api/v1/users/delete/:id", () => {
  it("should delete an user", async () => {
    const user = {
      userName: "Adryann123",
      email: "el123@example.com",
      password: "Thriller",
      confirmPassword: "Thriller",
    };
    await Models.User.create(user);
    const foundUser = await Models.User.findOne({
      where: { email: "el123@example.com" },
    });
    const userId = foundUser.id;
    return await request(app)
      .delete("/api/v1/users/delete/" + userId)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect({ message: "User Deleted successfully" });
  });
  it("should not found an user", async () => {
    return await request(app)
      .delete("/api/v1/users/delete/999")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect({ message: "User Not Found" });
  });
});

describe("Post -> Login an user --> /api/v1/users/login", () => {
  it("should not found an user", async () => {
    return await request(app)
      .post("/api/v1/users/login")
      .expect("Content-Type", /json/)
      .send({email: "adryann312@gmail.com", password: "123456"})
      .expect(200)
  });
})
