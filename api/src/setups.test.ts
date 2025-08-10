import app from './index'
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabaseAdmin: SupabaseClient
let regularUser: any;
let regularUserToken: string;
let testVehicle: any;
let testTrack: any;

describe('Car Setup Management API', () => {

  beforeEach(async () => {
    supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
    })

    // Create a regular user
    const { data: userData } = await supabaseAdmin.auth.admin.createUser({
        email: `setup.user.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true,
    })
    regularUser = userData.user;
    const loginRes = await app.request('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regularUser.email, password: 'password123' }),
    })
    regularUserToken = (await loginRes.json()).session.access_token;

    // Create a test game, vehicle, and track
    const { data: gameData } = await supabaseAdmin.from('games').insert({ name: 'Test Game for Setups' }).select().single()
    const { data: vehicleData } = await supabaseAdmin.from('vehicles').insert({ name: 'Test Car', game_id: gameData.id }).select().single()
    const { data: trackData } = await supabaseAdmin.from('tracks').insert({ name: 'Test Track', game_id: gameData.id }).select().single()
    testVehicle = vehicleData;
    testTrack = trackData;
  })

  afterEach(async () => {
    if (regularUser) await supabaseAdmin.auth.admin.deleteUser(regularUser.id)
    const { data: game } = await supabaseAdmin.from('games').select('id').eq('name', 'Test Game for Setups').single()
    if (game) await supabaseAdmin.from('games').delete().eq('id', game.id)
  })

  it('should allow a user to create a new setup', async () => {
    const newSetup = {
        name: 'My Nurburgring Setup',
        vehicle_id: testVehicle.id,
        track_id: testTrack.id,
        setup_data: { "tire_pressure": 28, "wing_angle": 5 }
    }
    const req = new Request('http://localhost/api/setups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${regularUserToken}` },
        body: JSON.stringify(newSetup),
    })
    const res = await app.request(req)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.name).toBe(newSetup.name)
    expect(data.user_id).toBe(regularUser.id)
  })

  it('should list setups for the authenticated user', async () => {
    await supabaseAdmin.from('setups').insert({ name: 'My Setup', vehicle_id: testVehicle.id, track_id: testTrack.id, user_id: regularUser.id })
    const req = new Request('http://localhost/api/setups', {
        headers: { 'Authorization': `Bearer ${regularUserToken}` },
    })
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.length).toBe(1)
    expect(data[0].name).toBe('My Setup')
  })

  it('should not allow a user to see setups from another user', async () => {
    // Create another user and their setup
    const { data: otherUserData } = await supabaseAdmin.auth.admin.createUser({ email: `other.user.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true })
    await supabaseAdmin.from('setups').insert({ name: 'Other User Setup', vehicle_id: testVehicle.id, track_id: testTrack.id, user_id: otherUserData.user.id })

    const req = new Request('http://localhost/api/setups', {
        headers: { 'Authorization': `Bearer ${regularUserToken}` },
    })
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.length).toBe(0) // Should not see the other user's setup

    // Cleanup
    await supabaseAdmin.auth.admin.deleteUser(otherUserData.user.id)
  })
})

describe('Setup Versioning', () => {
    let initialSetup: any;

    beforeEach(async () => {
        supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
            auth: { autoRefreshToken: false, persistSession: false },
        })
        // Create a regular user and get token
        const { data: userData } = await supabaseAdmin.auth.admin.createUser({ email: `version.user.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true })
        regularUser = userData.user;
        const loginRes = await app.request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: regularUser.email, password: 'password123' }) })
        regularUserToken = (await loginRes.json()).session.access_token;

        // Create a base setup
        const { data: setupData } = await supabaseAdmin.from('setups').insert({ name: 'Initial Version', user_id: regularUser.id, setup_data: { wing: 1 } }).select().single()
        initialSetup = setupData;
    })

    afterEach(async () => {
        if (regularUser) await supabaseAdmin.auth.admin.deleteUser(regularUser.id);
        // Clean up all setups created during the test
        await supabaseAdmin.from('setups').delete().neq('id', 0);
    })

    it('should create a new version when updating a setup', async () => {
        const updatedSetupData = { name: 'Version 2', setup_data: { wing: 2 } }
        const req = new Request(`http://localhost/api/setups/${initialSetup.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${regularUserToken}` },
            body: JSON.stringify(updatedSetupData),
        })
        const res = await app.request(req)
        expect(res.status).toBe(200)
        const v2 = await res.json()

        expect(v2.id).not.toBe(initialSetup.id)
        expect(v2.version).toBe(2)
        expect(v2.parent_setup_id).toBe(initialSetup.id)
        expect(v2.name).toBe('Version 2')
    })

    it('should retrieve the version history for a setup', async () => {
        // Create v2
        const { data: v2 } = await supabaseAdmin.from('setups').insert({ name: 'Version 2', user_id: regularUser.id, version: 2, parent_setup_id: initialSetup.id }).select().single()
        // Create v3
        await supabaseAdmin.from('setups').insert({ name: 'Version 3', user_id: regularUser.id, version: 3, parent_setup_id: v2.id }).select().single()

        const req = new Request(`http://localhost/api/setups/${initialSetup.id}/history`, {
            headers: { 'Authorization': `Bearer ${regularUserToken}` },
        })
        const res = await app.request(req)
        expect(res.status).toBe(200)
        const history = await res.json()

        expect(history.length).toBe(3)
        expect(history.find(s => s.version === 1)).toBeDefined()
        expect(history.find(s => s.version === 2)).toBeDefined()
        expect(history.find(s => s.version === 3)).toBeDefined()
    })
})

describe('Setup Sharing and Copying', () => {
    let user1: any, user1Token: string;
    let user2: any, user2Token: string;
    let user1Setup: any;
    let publicTemplate: any;

    beforeEach(async () => {
        supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
        // Create User 1
        const { data: u1 } = await supabaseAdmin.auth.admin.createUser({ email: `user1.share.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true })
        user1 = u1.user;
        const loginRes1 = await app.request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user1.email, password: 'password123' }) })
        user1Token = (await loginRes1.json()).session.access_token;

        // Create User 2
        const { data: u2 } = await supabaseAdmin.auth.admin.createUser({ email: `user2.share.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true })
        user2 = u2.user;
        const loginRes2 = await app.request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user2.email, password: 'password123' }) })
        user2Token = (await loginRes2.json()).session.access_token;

        // Create User 1's private setup
        const { data: s1 } = await supabaseAdmin.from('setups').insert({ name: 'User 1 Private Setup', user_id: user1.id }).select().single()
        user1Setup = s1;

        // Create a public template
        const { data: t } = await supabaseAdmin.from('setups').insert({ name: 'Public Template', is_template: true, is_public: true }).select().single()
        publicTemplate = t;
    })

    afterEach(async () => {
        if(user1) await supabaseAdmin.auth.admin.deleteUser(user1.id);
        if(user2) await supabaseAdmin.auth.admin.deleteUser(user2.id);
        await supabaseAdmin.from('setups').delete().neq('id', 0);
    })

    it('should allow a user to make their own setup public', async () => {
        const req = new Request(`http://localhost/api/setups/${user1Setup.id}/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user1Token}` },
            body: JSON.stringify({ public: true }),
        })
        const res = await app.request(req)
        expect(res.status).toBe(200)
        const data = await res.json()
        expect(data.is_public).toBe(true)
    })

    it('should allow a user to copy a public setup', async () => {
        const req = new Request(`http://localhost/api/setups/${publicTemplate.id}/copy`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${user2Token}` },
        })
        const res = await app.request(req)
        expect(res.status).toBe(201)
        const data = await res.json()
        expect(data.name).toBe(publicTemplate.name) // Name is copied
        expect(data.user_id).toBe(user2.id) // Belongs to user 2 now
        expect(data.is_template).toBe(false) // Copied setup is not a template
    })

    it('should list public setups and user-owned setups', async () => {
        // User 1 makes their setup public
        await supabaseAdmin.from('setups').update({ is_public: true }).eq('id', user1Setup.id)

        // User 2 requests the list of setups
        const req = new Request('http://localhost/api/setups', {
            headers: { 'Authorization': `Bearer ${user2Token}` },
        })
        const res = await app.request(req)
        expect(res.status).toBe(200)
        const data = await res.json()

        // User 2 should see the public template AND user 1's public setup
        // but not their own setups (they haven't created any)
        expect(data.length).toBe(2)
        expect(data.find(s => s.name === 'Public Template')).toBeDefined()
        expect(data.find(s => s.name === 'User 1 Private Setup')).toBeDefined()
    })
})
