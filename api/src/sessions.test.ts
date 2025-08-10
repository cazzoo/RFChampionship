import app from './index'
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabaseAdmin: SupabaseClient
let adminUser: any;
let adminToken: string;
let testEvent: any;

describe('Session Management API', () => {

  beforeEach(async () => {
    supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
    })

    // Create Admin User, Game, Champ, Event
    const { data: adminData } = await supabaseAdmin.auth.admin.createUser({
        email: `admin.sessions.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true,
    })
    adminUser = adminData.user;
    await supabaseAdmin.from('profiles').update({ roles: ['ROLE_ADMIN'] }).eq('id', adminUser.id)
    const adminLoginRes = await app.request('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminUser.email, password: 'password123' }),
    })
    adminToken = (await adminLoginRes.json()).session.access_token;
    const { data: gameData } = await supabaseAdmin.from('games').insert({ name: 'Test Game for Sessions' }).select().single()
    const { data: champData } = await supabaseAdmin.from('championships').insert({ name: 'Test Champ for Sessions', game_id: gameData.id }).select().single()
    const { data: eventData } = await supabaseAdmin.from('events').insert({ name: 'Test Event for Sessions', championship_id: champData.id }).select().single()
    testEvent = eventData;
  })

  afterEach(async () => {
    if (adminUser) await supabaseAdmin.auth.admin.deleteUser(adminUser.id)
    const { data: game } = await supabaseAdmin.from('games').select('id').eq('name', 'Test Game for Sessions').single()
    if (game) await supabaseAdmin.from('games').delete().eq('id', game.id)
  })

  it('should list all sessions for a given eventId', async () => {
    await supabaseAdmin.from('sessions').insert({ name: 'Session 1', event_id: testEvent.id })
    const req = new Request(`http://localhost/api/sessions?eventId=${testEvent.id}`)
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.length).toBe(1)
    expect(data[0].name).toBe('Session 1')
  })

  it('should allow an admin to create a new session', async () => {
    const newSession = { name: 'New Test Session', event_id: testEvent.id }
    const req = new Request(`http://localhost/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(newSession),
    })
    const res = await app.request(req)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.name).toBe(newSession.name)
  })

  it('should get a single session by id', async () => {
    const { data: session } = await supabaseAdmin.from('sessions').insert({ name: 'Session to Get', event_id: testEvent.id }).select().single()
    const req = new Request(`http://localhost/api/sessions/${session.id}`)
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe('Session to Get')
  })

  it('should allow an admin to update a session', async () => {
    const { data: session } = await supabaseAdmin.from('sessions').insert({ name: 'Session to Update', event_id: testEvent.id }).select().single()
    const updatedSession = { name: 'Updated Session Name' }
    const req = new Request(`http://localhost/api/sessions/${session.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(updatedSession),
    })
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe(updatedSession.name)
  })

  it('should allow an admin to delete a session', async () => {
    const { data: session } = await supabaseAdmin.from('sessions').insert({ name: 'Session to Delete', event_id: testEvent.id }).select().single()
    const req = new Request(`http://localhost/api/sessions/${session.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` },
    })
    const res = await app.request(req)
    expect(res.status).toBe(204)
  })
})
