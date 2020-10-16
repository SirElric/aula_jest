const request = require("supertest");
const app = require("../../src/app");
const connection = require("../../src/database");
const {cpf} = require("cpf-cnpj-validator");
const truncate = require("./truncate");

describe("MANAGERS", () => {

  afterAll(() => {
    connection.close();
  })

  beforeEach(async (done) => {
    await truncate(connection.models)
    done()
  });

  it("é possivel criar um novo gerente", async () => {
    const response = await request(app).post("/managers").send({
        "name": "Erick Matheus",
        "cpf": cpf.generate(),
        "email": "test.user@gmail.com",
        "cellphone": "5511312318532",
        "password": "123456",
    });
    expect(response.ok).toBeTruthy();
    expect(response.body).toHaveProperty("id");

  });

  it("não é possivel cadastrar um gerente com cpf existente", async () => {
    let cpfGerente = cpf.generate();
    let response = await request(app).post("/managers").send({
      "name": "Erick Matheus",
      "cpf": cpfGerente,
      "email": "test.user@gmail.com",
      "cellphone": "5511312318532",
      "password": "123456",
    });

    response = await request(app).post("/managers").send({
      "name": "Mateus Gabriel",
      "cpf": cpfGerente,
      "email": "test.user2@gmail.com",
      "cellphone": "2358132131155",
      "password": "654321",
    });

    expect(response.ok).toBeFalsy();
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("cpf already exists");
  });
});