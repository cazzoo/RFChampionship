import app from './index'
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// These will be passed via command line
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabaseAdmin: SupabaseClient

describe('POST /api/users/register', () => {
  const users_to_cleanup: string[] = []

  beforeEach(() => {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase creds not provided')
    }
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  })

  afterEach(async () => {
    for (const userId of users_to_cleanup) {
      await supabaseAdmin.auth.admin.deleteUser(userId)
    }
    users_to_cleanup.length = 0
  })

  it('should register a new user successfully', async () => {
    const email = `test.user.${Date.now()}@rfc-test.com`
    const password = 'password123'

    const req = new Request('http://localhost/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const res = await app.request(req)
    expect(res.status).toBe(201)

    const { user, session } = await res.json()
    expect(user).toBeDefined()
    expect(session).toBeDefined()
    expect(user.email).toBe(email)

    // Add user to cleanup list
    if (user && user.id) {
        users_to_cleanup.push(user.id)
    }
  })

  it('should return 400 for invalid email', async () => {
    const req = new Request('http://localhost/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid', password: 'password123' }),
    })
    const res = await app.request(req)
    expect(res.status).toBe(400)
  })

  it('should return 400 for short password', async () => {
    const email = `test.user.${Date.now()}@rfc-test.com`
    const req = new Request('http://localhost/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: '123' }),
    })
    const res = await app.request(req)
    expect(res.status).toBe(400)
  })

  it('should return 409 for duplicate email', async () => {
    const email = `test.user.${Date.now()}@rfc-test.com`
    const password = 'password123'

    // First, create the user
    const { data: { user } } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    })
    if (user) {
        users_to_cleanup.push(user.id)
    }

    // Then, try to register again with the same email
    const req = new Request('http://localhost/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const res = await app.request(req)
    // Now that email confirmation is disabled, Supabase signUp throws an error for duplicates.
    expect(res.status).toBe(409) // Conflict
  })
})

describe('POST /api/auth/login', () => {
  let testUser: { email: string, password: string};
  let createdUserId: string;

  beforeEach(async () => {
    testUser = {
        email: `login.user.${Date.now()}@rfc-test.com`,
        password: 'password123',
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Supabase creds not provided')
    }
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
    // Create a user to test login
    const { data: { user } } = await supabaseAdmin.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true, // User is already confirmed
    })
    if (!user) throw new Error('Failed to create test user for login tests');
    createdUserId = user.id;
  })

  afterEach(async () => {
    if (createdUserId) {
      await supabaseAdmin.auth.admin.deleteUser(createdUserId)
    }
  })

  it('should log in a user successfully', async () => {
    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    })

    const res = await app.request(req)
    expect(res.status).toBe(200)

    const { user, session } = await res.json()
    expect(user).toBeDefined()
    expect(session).toBeDefined()
    expect(user.email).toBe(testUser.email)
  })

  it('should return 401 for incorrect password', async () => {
    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'wrongpassword' }),
    })
    const res = await app.request(req)
    expect(res.status).toBe(401)
  })

  it('should return 401 for non-existent user', async () => {
    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nouser@rfc-test.com', password: 'password123' }),
    })
    const res = await app.request(req)
    expect(res.status).toBe(401)
  })
})

describe('GET /api/me', () => {
    let testUser: { email: string, password: string};
    let createdUserId: string;
    let authToken: string;

    beforeEach(async () => {
      testUser = {
          email: `me.user.${Date.now()}@rfc-test.com`,
          password: 'password123',
      }
      if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
          throw new Error('Supabase creds not provided')
      }
      supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
          auth: {
              autoRefreshToken: false,
              persistSession: false,
          },
      })
      // Create a user
      const { data: { user } } = await supabaseAdmin.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
      })
      if (!user) throw new Error('Failed to create test user');
      createdUserId = user.id;

      // Log in to get a token
      const loginRes = await app.request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
      })
      const { session } = await loginRes.json()
      authToken = session.access_token;
    })

    afterEach(async () => {
      if (createdUserId) {
        await supabaseAdmin.auth.admin.deleteUser(createdUserId)
      }
    })

    it('should return user data for a valid token', async () => {
        const req = new Request('http://localhost/api/me', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        const res = await app.request(req)
        expect(res.status).toBe(200)
        const user = await res.json()
        expect(user.email).toBe(testUser.email)
    })

    it('should return 401 if no token is provided', async () => {
        const req = new Request('http://localhost/api/me')
        const res = await app.request(req)
        expect(res.status).toBe(401)
    })

    it('should return 401 for an invalid token', async () => {
        const req = new Request('http://localhost/api/me', {
            headers: {
                'Authorization': `Bearer an-invalid-token`
            }
        })
        const res = await app.request(req)
        expect(res.status).toBe(401)
    })
})
