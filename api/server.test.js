const db = require('../data/dbConfig');
const Users = require('./auth/auth-model')
const bcrypt = require('bcryptjs')

test('is NODE_ENV set correctly', () => {
  expect(process.env.NODE_ENV).toBe('testing');
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

beforeEach(async () => {
  await db('users').truncate();
  await db.seed.run();
});

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

const request = require('supertest');
const server = require('./server');
// const password = req.body.password
// const hash = bcrypt.hashSync(password, 8)
describe('HTTP endpoints', () =>{
  test('POST /auth/register', async () => {
    let result = await request(server).post('/api/auth/register').send({ username: 'chad', })
    expect(result.body).toMatchObject({ message: 'username and password required'})
  })
  test('POST /auth/register', async () => {
    let result = await request(server).post('/api/auth/register').send({ username: 'chad', password: 'something' })
    
    // expect(result.body).toEqual({ id: 2, password: hash, username: 'chad', })
    expect(result.status).toBe(201)
  })
  test('POST /auth/login', async () => {
    let result = await request(server).post('/api/auth/login').send({ username: 'chad', })
    expect(result.body).toMatchObject({ message: 'username and password required'})
  })
  test('POST /auth/login', async () => {
    let result = await request(server).post('/api/auth/login').send({ username: 'sam', password: 'newpassword' })
    expect(result.body).toMatchObject({ message: 'Invalid Credentials'})
  })
})