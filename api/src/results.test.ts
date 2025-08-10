import app from './index'
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabaseAdmin: SupabaseClient
let adminUser: any;
let adminToken: string;
let testSession: any;
let testUsers: any[] = [];

describe('Result Management API', () => {

  beforeEach(async () => {
    supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
    })

    // Create Admin User
    const { data: adminData } = await supabaseAdmin.auth.admin.createUser({
        email: `admin.results.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true,
    })
    adminUser = adminData.user;
    await supabaseAdmin.from('profiles').update({ roles: ['ROLE_ADMIN'] }).eq('id', adminUser.id)
    const adminLoginRes = await app.request('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminUser.email, password: 'password123' }),
    })
    adminToken = (await adminLoginRes.json()).session.access_token;

    // Create a test game, championship, event, and session
    const { data: gameData } = await supabaseAdmin.from('games').insert({ name: 'Test Game for Results' }).select().single()
    const { data: champData } = await supabaseAdmin.from('championships').insert({ name: 'Test Champ for Results', game_id: gameData.id }).select().single()
    const { data: eventData } = await supabaseAdmin.from('events').insert({ name: 'Test Event for Results', championship_id: champData.id }).select().single()
    const { data: sessionData } = await supabaseAdmin.from('sessions').insert({ name: 'Test Session for Results', event_id: eventData.id }).select().single()
    testSession = sessionData;

    // Create a couple of test users
    for (let i = 0; i < 2; i++) {
        const { data: userData } = await supabaseAdmin.auth.admin.createUser({
            email: `racer${i}.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true,
        })
        testUsers.push(userData.user)
    }
  })

  afterEach(async () => {
    if (adminUser) await supabaseAdmin.auth.admin.deleteUser(adminUser.id)
    for (const user of testUsers) {
        if(user) await supabaseAdmin.auth.admin.deleteUser(user.id)
    }
    testUsers = [];
    const { data: game } = await supabaseAdmin.from('games').select('id').eq('name', 'Test Game for Results').single()
    if (game) await supabaseAdmin.from('games').delete().eq('id', game.id)
  })

  it('should allow an admin to bulk-add results for a session', async () => {
    const resultsPayload = [
        { user_id: testUsers[0].id, position: 1, comments: 'Good race' },
        { user_id: testUsers[1].id, position: 2, comments: 'Nice battle' },
    ]

    const req = new Request(`http://localhost/api/sessions/${testSession.id}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(resultsPayload),
    })
    const res = await app.request(req)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.length).toBe(2)
    expect(data[0].position).toBe(1)

    // Verify data in the database
    const { data: dbResults } = await supabaseAdmin.from('results').select('*').eq('session_id', testSession.id)
    expect(dbResults?.length).toBe(2)
  })
})
