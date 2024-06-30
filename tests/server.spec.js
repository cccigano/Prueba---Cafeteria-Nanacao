import { describe, it, expect } from "vitest";
const request = require("supertest");
const app = require("../index");

describe("Operaciones CRUD de cafes", () => {
  it("GET /cafes - debería devolver un status code 200 y un arreglo con al menos 1 objeto", async () => {
    const response = await request(app).get("/cafes");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("DELETE /cafes/:id - debería devolver un status code 404 si se intenta eliminar un café con un id que no existe", async () => {
    const nonExistentId = "9999";
    const response = await request(app)
      .delete(`/cafes/${nonExistentId}`)
      .set("Authorization", "someValidToken");
    expect(response.status).toBe(404);
  });

  it("POST /cafes - debería agregar un nuevo café y devolver un código 201", async () => {
    const newCafe = {
      id: 5,
      nombre: "Café nuevo",
    };
    const response = await request(app).post("/cafes").send(newCafe);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining(newCafe)])
    );
  });

  it("PUT /cafes/:id - debería devolver un status code 400 si el id del parámetro es diferente al id del payload", async () => {
    const idParam = 2;
    const cafeToUpdate = {
      id: 3,
      nombre: "Café actualizado",
    };
    const response = await request(app)
      .put(`/cafes/${idParam}`)
      .send(cafeToUpdate);
    expect(response.status).toBe(400);
  });

  it("GET /cafes/:id - debería devolver un status code 404 si no se encuentra el café con el id proporcionado", async () => {
    const nonExistentId = "9999";
    const response = await request(app).get(`/cafes/${nonExistentId}`);
    expect(response.status).toBe(404);
  });

  it("PUT /cafes/:id - debería devolver un status code 404 si el café con el id proporcionado no existe", async () => {
    const nonExistentId = "9999";
    const cafeToUpdate = {
      id: nonExistentId,
      nombre: "Café inexistente",
    };
    const response = await request(app)
      .put(`/cafes/${nonExistentId}`)
      .send(cafeToUpdate);
    expect(response.status).toBe(404);
  });

  it("Debería devolver un status code 404 para una ruta no existente", async () => {
    const response = await request(app).get("/ruta-inexistente");
    expect(response.status).toBe(404);
  });
});
