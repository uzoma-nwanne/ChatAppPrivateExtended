import supertest from "supertest";
import {connectDB} from "../lib/db";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const URL = "localhost:3006";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJvbmVAZ21haWwuY29tIiwidXNlcklkIjoiNTIzNDNjMzctMjExMS00ZDFmLWEwNmEtYjMyMTcwOTEwN2M2IiwiaWF0IjoxNjgzNzAxODQ0LCJleHAiOjE2ODM3MDU0NDR9.wP92Jsu1_fnxURLXsUzFoFWW0PP4zupKy_v5sHAinb0";
const request = supertest(URL);
beforeAll(async () => {
  await connectDB(); //connect to dev database since we are  using dev localhost. .env.test also points to dev server
  await User.deleteOne({email: "okiri@gmail.com"}); // should have been in use if we are using testing db
});

describe("Tests the auth route", () => {
  test("sign up a user", async () => {
    const response = await request
      .post("/api/auth/signup")
      .send({fullName: "Ogbo Kiri", email: "okiri@gmail.com", password: "123456"})
      .set("Accept", "application/json");
    expect(response.status).toBe(201);
    // const user = await User.find({email: response.body.email});
    // expect(user.password).not.ToBe("123456");
  });
  test("should log out a user", async () => {
    const response = await request.post("/api/auth/logout").send().expect(200);
    expect(response.body.message).toBe("Logged out successfully");
  });

  test("it should login a user", async () => {
    const response = await request
      .post("/api/auth/login")
      .send({email: "okiri@gmail.com", password: "123456"})
      .expect(200);
    expect(response.body.fullName).toBe("Ogbo Kiri");
  });

  test("it should throw error if a user picture is not provided for update", async () => {
    jest.mock("jsonwebtoken");
    jwt.verify.mockResolvedValue({decoded: token});
    jest.mock("User");
    User.findById.mockResolvedValue({fullName: "Ogbo Kiri", email: "okiri@gmail.com"});
    const response = await request
      .put("/api/auth/update-profile")
      .set("cookies", `Bearer ${token}`)
      .send({profilePic: "xyz", userId: ""})
      .expect(200);

    expect(response.body.message).toBe("Profile pic is required");
  });

  test("it should check a user's auth status", () => {});
});
