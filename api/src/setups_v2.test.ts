import app from './index'
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabaseAdmin: SupabaseClient
let adminToken: string;
let regularUserToken: string;
let testGame: any, testVehicle: any, testTrack: any, testRule: any;
let paramTirePressure: any, paramTireCompound: any;

describe('User-Facing Setups API v2', () => {

  beforeEach(async () => {
    supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    // Create Admin and Regular User
    const { data: adminData } = await supabaseAdmin.auth.admin.createUser({ email: `admin.form.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true })
    await supabaseAdmin.from('profiles').update({ roles: ['ROLE_ADMIN'] }).eq('id', adminData.user.id)
    const adminLoginRes = await app.request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: adminData.user.email, password: 'password123' })})
    adminToken = (await adminLoginRes.json()).session.access_token;
    const { data: userData } = await supabaseAdmin.auth.admin.createUser({ email: `user.form.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true })
    const userLoginRes = await app.request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: userData.user.email, password: 'password123' })})
    regularUserToken = (await userLoginRes.json()).session.access_token;

    // Create test data
    const { data: g } = await supabaseAdmin.from('games').insert({ name: 'Test Game' }).select().single()
    testGame = g;
    const { data: v } = await supabaseAdmin.from('vehicles').insert({ name: 'Test Car', game_id: g.id }).select().single()
    testVehicle = v;
    const { data: t } = await supabaseAdmin.from('tracks').insert({ name: 'Test Track', game_id: g.id }).select().single()
    testTrack = t;
    const { data: r } = await supabaseAdmin.from('rules').insert({ name: 'GT3 Rules', game_id: g.id }).select().single()
    testRule = r;
    const { data: p1 } = await supabaseAdmin.from('setup_parameters').insert({ name: 'Tire Pressure', value_type: 'number', game_id: g.id }).select().single()
    paramTirePressure = p1;
    const { data: p2 } = await supabaseAdmin.from('setup_parameters').insert({ name: 'Tire Compound', value_type: 'enum', game_id: g.id }).select().single()
    paramTireCompound = p2;
  })

  afterEach(async () => {
    // Cascade delete should clean up everything when the game is deleted
    if (testGame) await supabaseAdmin.from('games').delete().eq('id', testGame.id);
    const { data: adminUser } = await supabaseAdmin.from('profiles').select('id').like('email', 'admin.form.%').single();
    if(adminUser) await supabaseAdmin.auth.admin.deleteUser(adminUser.id);
    const { data: regUser } = await supabaseAdmin.from('profiles').select('id').like('email', 'user.form.%').single();
    if(regUser) await supabaseAdmin.auth.admin.deleteUser(regUser.id);
  })

  describe('GET /api/setups/form', () => {
    it('should resolve the correct parameters and constraints for a given context', async () => {
        // Create parameter rules
        // General rule for tire pressure
        await supabaseAdmin.from('parameter_rules').insert({ parameter_id: paramTirePressure.id, game_id: testGame.id, min_value: 20, max_value: 40 })
        // Vehicle-specific rule for tire pressure (should override general rule)
        await supabaseAdmin.from('parameter_rules').insert({ parameter_id: paramTirePressure.id, vehicle_id: testVehicle.id, min_value: 22, max_value: 38 })
        // Rule for tire compound options
        await supabaseAdmin.from('parameter_rules').insert({ parameter_id: paramTireCompound.id, game_id: testGame.id, options: ['Soft', 'Medium', 'Hard'] })

        const req = new Request(`http://localhost/api/setups/form?vehicleId=${testVehicle.id}&trackId=${testTrack.id}&ruleId=${testRule.id}`, {
            headers: { 'Authorization': `Bearer ${regularUserToken}` },
        })

        const res = await app.request(req)
        expect(res.status).toBe(200)

        const form = await res.json()

        // Expect to see both parameters
        expect(form.parameters.length).toBe(2)
        const pressureParam = form.parameters.find(p => p.name === 'Tire Pressure')
        const compoundParam = form.parameters.find(p => p.name === 'Tire Compound')

        // Check that the vehicle-specific rule was applied for tire pressure
        expect(pressureParam.min_value).toBe(22)
        expect(pressureParam.max_value).toBe(38)

        // Check that the options were applied for tire compound
        expect(compoundParam.options).toEqual(['Soft', 'Medium', 'Hard'])
    })
  })
})
