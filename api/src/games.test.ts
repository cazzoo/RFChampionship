import app from './index'
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabaseAdmin: SupabaseClient
let adminUser: any;
let adminToken: string;

describe('Game Management API', () => {

  beforeEach(async () => {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
    })

    // Create an admin user for the tests
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: `admin.${Date.now()}@rfc-test.com`,
        password: 'password123',
        email_confirm: true,
    })
    if (error || !data.user) throw new Error('Failed to create admin user: ' + error?.message)
    adminUser = data.user;

    // Update the user's profile to give them the admin role
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ roles: ['ROLE_ADMIN'] })
      .eq('id', adminUser.id)
    if (profileError) throw new Error('Failed to update admin profile: ' + profileError.message)

    // Log in as the admin user to get a token
    const loginRes = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminUser.email, password: 'password123' }),
    })
    const { session } = await loginRes.json()
    adminToken = session.access_token;
  })

  afterEach(async () => {
    if (adminUser) {
      await supabaseAdmin.auth.admin.deleteUser(adminUser.id)
    }
    // Also clean up any created games
    const { data: games } = await supabaseAdmin.from('games').select('id')
    if (games) {
        for (const game of games) {
            await supabaseAdmin.from('games').delete().eq('id', game.id)
        }
    }
  })

  it('should allow an admin to create a new game', async () => {
    const newGame = { name: 'Test Game', short_name: 'TG', description: 'A test game' }
    const req = new Request('http://localhost/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(newGame),
    })
    const res = await app.request(req)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.name).toBe(newGame.name)
  })

  it('should list all games', async () => {
    // Create a game first
    await supabaseAdmin.from('games').insert({ name: 'Game 1' })
    const req = new Request('http://localhost/api/games', {
        headers: { 'Authorization': `Bearer ${adminToken}` },
    })
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
  })

  it('should get a single game by id', async () => {
    const { data: game } = await supabaseAdmin.from('games').insert({ name: 'Game 2' }).select().single()
    const req = new Request(`http://localhost/api/games/${game.id}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
    })
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe('Game 2')
  })

  it('should allow an admin to update a game', async () => {
    const { data: game } = await supabaseAdmin.from('games').insert({ name: 'Game 3' }).select().single()
    const updatedGame = { name: 'Updated Test Game' }
    const req = new Request(`http://localhost/api/games/${game.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(updatedGame),
    })
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe(updatedGame.name)
  })

  it('should allow an admin to delete a game', async () => {
    const { data: game } = await supabaseAdmin.from('games').insert({ name: 'Game 4' }).select().single()
    const req = new Request(`http://localhost/api/games/${game.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` },
    })
    const res = await app.request(req)
    expect(res.status).toBe(204) // No Content
  })
})
