const request = require("supertest");

const BASE_URL = `http://localhost:3000`;

describe("Task 3: POST requests to /api/personalize", () => {
    it("should return data", async () => {
      const validPostResponse = await request(BASE_URL)
        .post("/api/personalize")
        .send({
          name: "Alice",
          age: 25,
          preferences: {
            color: "blue",
            hobby: "painting",
          },
        });
      expect(validPostResponse.status).toBe(200);
      expect(validPostResponse.body.message).toBe("Hello, Alice!");
      expect(validPostResponse.body.ageMessage).toBe("You're 25 years old.");
      expect(validPostResponse.body.preferencesMessage).toBe(
        "Your favorite color is blue and you enjoy painting."
      );
      expect(validPostResponse.body.offerMessage).toBe(
        "You're eligible for our special offers!"
      );
    });

    it("should return error for invalid data", async () => {
      try {
        await request(BASE_URL).post("/api/personalize").send({
          name: "",
          age: "twenty",
          preferences: {},
        });
      } catch (error) {
        expect(error.status).toBeGreaterThanOrEqual(400);
        expect(error.status).toBeLessThan(500);
      }
    });
  });
