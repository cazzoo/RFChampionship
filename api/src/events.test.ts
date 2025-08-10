import app from './index'
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabaseAdmin: SupabaseClient
let adminUser: any;
let adminToken: string;
let regularUser: any;
let regularUserToken: string;
let testChampionship: any;

describe('Event Management API', () => {

  beforeEach(async () => {
    supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
    })

    // Create Admin User
    const { data: adminData } = await supabaseAdmin.auth.admin.createUser({
        email: `admin.events.${Date.now()}@rfc-test.com`,
        password: 'password123',
        email_confirm: true,
    })
    adminUser = adminData.user;
    await supabaseAdmin.from('profiles').update({ roles: ['ROLE_ADMIN'] }).eq('id', adminUser.id)
    const adminLoginRes = await app.request('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminUser.email, password: 'password123' }),
    })
    adminToken = (await adminLoginRes.json()).session.access_token;

    // Create Regular User
    const { data: userData } = await supabaseAdmin.auth.admin.createUser({
        email: `reg.events.${Date.now()}@rfc-test.com`,
        password: 'password123',
        email_confirm: true,
    })
    regularUser = userData.user;
    const userLoginRes = await app.request('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regularUser.email, password: 'password123' }),
    })
    regularUserToken = (await userLoginRes.json()).session.access_token;

    // Create a test game and championship
    const { data: gameData } = await supabaseAdmin.from('games').insert({ name: 'Test Game for Events' }).select().single()
    const { data: champData } = await supabaseAdmin.from('championships').insert({ name: 'Test Champ for Events', game_id: gameData.id }).select().single()
    testChampionship = champData;
  })

  afterEach(async () => {
    if (adminUser) await supabaseAdmin.auth.admin.deleteUser(adminUser.id)
    if (regularUser) await supabaseAdmin.auth.admin.deleteUser(regularUser.id)
    // games and championships will be cleaned up by cascade delete if we set it up,
    // but it's safer to clean them up manually if not. For now, assume they are cleaned up with the user or test run.
    // Let's explicitly delete the championship, which should cascade to events.
    if (testChampionship) await supabaseAdmin.from('championships').delete().eq('id', testChampionship.id)
  })

  it('should list all events for a championship', async () => {
    // Create an event first
    await supabaseAdmin.from('events').insert({ name: 'Event 1', championship_id: testChampionship.id })

    const req = new Request(`http://localhost/api/championships/${testChampionship.id}/events`)
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
    expect(data[0].name).toBe('Event 1')
  })

  it('should allow an admin to create a new event', async () => {
    const newEvent = { name: 'New Test Event', description: 'An event created by an admin' }
    const req = new Request(`http://localhost/api/championships/${testChampionship.id}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(newEvent),
    })
    const res = await app.request(req)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.name).toBe(newEvent.name)
    expect(data.championship_id).toBe(testChampionship.id)
  })

  it('should not allow a regular user to create a new event', async () => {
    const newEvent = { name: 'Disallowed Event' }
    const req = new Request(`http://localhost/api/championships/${testChampionship.id}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${regularUserToken}` },
        body: JSON.stringify(newEvent),
    })
    const res = await app.request(req)
    expect(res.status).toBe(403) // Forbidden
  })

  it('should get a single event by id', async () => {
    const { data: event } = await supabaseAdmin.from('events').insert({ name: 'Event to Get', championship_id: testChampionship.id }).select().single()
    const req = new Request(`http://localhost/api/events/${event.id}`)
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe('Event to Get')
  })

  it('should allow an admin to update an event', async () => {
    const { data: event } = await supabaseAdmin.from('events').insert({ name: 'Event to Update', championship_id: testChampionship.id }).select().single()
    const updatedEvent = { name: 'Updated Event Name' }
    const req = new Request(`http://localhost/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(updatedEvent),
    })
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe(updatedEvent.name)
  })

  it('should allow an admin to delete an event', async () => {
    const { data: event } = await supabaseAdmin.from('events').insert({ name: 'Event to Delete', championship_id: testChampionship.id }).select().single()
    const req = new Request(`http://localhost/api/events/${event.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` },
    })
    const res = await app.request(req)
    expect(res.status).toBe(204)
  })
})
