import app from './index'
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabaseAdmin: SupabaseClient
let adminUser: any;
let adminToken: string;
let testGame: any;

describe('Championship Management API', () => {

  beforeEach(async () => {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
    })

    // Create an admin user
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
        email: `admin.${Date.now()}@rfc-test.com`,
        password: 'password123',
        email_confirm: true,
    })
    if (adminError || !adminData.user) throw new Error('Failed to create admin user: ' + adminError?.message)
    adminUser = adminData.user;

    await supabaseAdmin.from('profiles').update({ roles: ['ROLE_ADMIN'] }).eq('id', adminUser.id)

    // Log in as the admin user to get a token
    const loginRes = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminUser.email, password: 'password123' }),
    })
    const { session } = await loginRes.json()
    adminToken = session.access_token;

    // Create a test game to associate championships with
    const { data: gameData, error: gameError } = await supabaseAdmin.from('games').insert({ name: 'Test Game for Champs' }).select().single()
    if (gameError || !gameData) throw new Error('Failed to create test game: ' + gameError.message)
    testGame = gameData;
  })

  afterEach(async () => {
    if (adminUser) {
      await supabaseAdmin.auth.admin.deleteUser(adminUser.id)
    }
    if (testGame) {
        await supabaseAdmin.from('games').delete().eq('id', testGame.id)
    }
    // Clean up any created championships
    const { data: championships } = await supabaseAdmin.from('championships').select('id')
    if (championships) {
        for (const champ of championships) {
            await supabaseAdmin.from('championships').delete().eq('id', champ.id)
        }
    }
  })

  it('should allow an admin to create a new championship', async () => {
    const newChamp = { name: 'Test Championship', description: 'A test champ', game_id: testGame.id }
    const req = new Request('http://localhost/api/championships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(newChamp),
    })
    const res = await app.request(req)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.name).toBe(newChamp.name)
    expect(data.game_id).toBe(testGame.id)
  })

  it('should list all championships', async () => {
    await supabaseAdmin.from('championships').insert({ name: 'Champ 1', game_id: testGame.id })
    const req = new Request('http://localhost/api/championships')
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
  })

  it('should get a single championship by id', async () => {
    const { data: champ } = await supabaseAdmin.from('championships').insert({ name: 'Champ 2', game_id: testGame.id }).select().single()
    const req = new Request(`http://localhost/api/championships/${champ.id}`)
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe('Champ 2')
  })

  it('should allow an admin to update a championship', async () => {
    const { data: champ } = await supabaseAdmin.from('championships').insert({ name: 'Champ 3', game_id: testGame.id }).select().single()
    const updatedChamp = { name: 'Updated Test Champ' }
    const req = new Request(`http://localhost/api/championships/${champ.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(updatedChamp),
    })
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe(updatedChamp.name)
  })

  it('should allow an admin to delete a championship', async () => {
    const { data: champ } = await supabaseAdmin.from('championships').insert({ name: 'Champ 4', game_id: testGame.id }).select().single()
    const req = new Request(`http://localhost/api/championships/${champ.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` },
    })
    const res = await app.request(req)
    expect(res.status).toBe(204)
  })
})

describe('POST /api/championships/:id/register', () => {
    let regularUser: any;
    let regularUserToken: string;
    let testChampionship: any;

    beforeEach(async () => {
        supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
            auth: { autoRefreshToken: false, persistSession: false },
        })
        // Create a regular user
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
            email: `reg.user.${Date.now()}@rfc-test.com`,
            password: 'password123',
            email_confirm: true,
        })
        if (userError) throw new Error('Failed to create regular user: ' + userError.message)
        regularUser = userData.user;

        // Log in as the regular user to get a token
        const loginRes = await app.request('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: regularUser.email, password: 'password123' }),
        })
        const { session } = await loginRes.json()
        regularUserToken = session.access_token;

        // Create a test game and championship
        const { data: gameData } = await supabaseAdmin.from('games').insert({ name: 'Test Game for Reg' }).select().single()
        const { data: champData } = await supabaseAdmin.from('championships').insert({ name: 'Test Champ for Reg', game_id: gameData.id }).select().single()
        testChampionship = champData;
    })

    afterEach(async () => {
        if (regularUser) await supabaseAdmin.auth.admin.deleteUser(regularUser.id)
        if (testChampionship) await supabaseAdmin.from('championships').delete().eq('id', testChampionship.id)
        // The game will be deleted by the cascade rule
    })

    it('should allow an authenticated user to register for a championship', async () => {
        const req = new Request(`http://localhost/api/championships/${testChampionship.id}/register`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${regularUserToken}` },
        })
        const res = await app.request(req)
        expect(res.status).toBe(201)
        const data = await res.json()
        expect(data.championship_id).toBe(testChampionship.id)
        expect(data.user_id).toBe(regularUser.id)
    })

    it('should return 401 for an unauthenticated user', async () => {
        const req = new Request(`http://localhost/api/championships/${testChampionship.id}/register`, {
            method: 'POST',
        })
        const res = await app.request(req)
        expect(res.status).toBe(401)
    })

    it('should return 409 when registering for the same championship twice', async () => {
        // First registration
        await app.request(`http://localhost/api/championships/${testChampionship.id}/register`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${regularUserToken}` },
        })

        // Second attempt
        const req = new Request(`http://localhost/api/championships/${testChampionship.id}/register`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${regularUserToken}` },
        })
        const res = await app.request(req)
        expect(res.status).toBe(409)
    })
})
