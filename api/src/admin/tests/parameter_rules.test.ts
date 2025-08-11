import app from '../../index'
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabaseAdmin: SupabaseClient
let adminToken: string;
let testParam: any;
let testVehicle: any;

describe('Admin Parameter Rules API', () => {

  beforeEach(async () => {
    supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    const { data: adminData } = await supabaseAdmin.auth.admin.createUser({ email: `admin.rules.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true })
    await supabaseAdmin.from('profiles').update({ roles: ['ROLE_ADMIN'] }).eq('id', adminData.user.id)
    const loginRes = await app.request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: adminData.user.email, password: 'password123' })})
    adminToken = (await loginRes.json()).session.access_token;

    // Create a test parameter and vehicle
    const { data: paramData } = await supabaseAdmin.from('setup_parameters').insert({ name: 'Tire Pressure', value_type: 'number' }).select().single()
    testParam = paramData;
    const { data: vehicleData } = await supabaseAdmin.from('vehicles').insert({ name: 'Test Car' }).select().single()
    testVehicle = vehicleData;
  })

  afterEach(async () => {
    const { data: adminUser } = await supabaseAdmin.from('profiles').select('id').like('email', 'admin.rules.%').single();
    if(adminUser) await supabaseAdmin.auth.admin.deleteUser(adminUser.id);
    await supabaseAdmin.from('parameter_rules').delete().neq('id', 0);
    await supabaseAdmin.from('setup_parameters').delete().neq('id', 0);
    await supabaseAdmin.from('vehicles').delete().neq('id', 0);
  })

  it('should allow an admin to create a parameter rule', async () => {
      const rule = {
          parameter_id: testParam.id,
          vehicle_id: testVehicle.id,
          min_value: 20,
          max_value: 40,
          default_value: '28',
          dependencies: { "if": { "param": "tire_compound", "is": "wet" }, "then": { "max_value": 35 } }
      }
      const req = new Request('http://localhost/api/admin/parameter-rules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
          body: JSON.stringify(rule),
      })
      const res = await app.request(req)
      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.parameter_id).toBe(testParam.id)
      expect(data.max_value).toBe(40)
  })

  it('should list all parameter rules', async () => {
    await supabaseAdmin.from('parameter_rules').insert({ parameter_id: testParam.id })
    const req = new Request('http://localhost/api/admin/parameter-rules', {
        headers: { 'Authorization': `Bearer ${adminToken}` },
    })
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
  })

  it('should update a parameter rule', async () => {
    const { data: rule } = await supabaseAdmin.from('parameter_rules').insert({ parameter_id: testParam.id, default_value: '28' }).select().single()
    const updatedRule = { default_value: '30' }
    const req = new Request(`http://localhost/api/admin/parameter-rules/${rule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(updatedRule),
    })
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.default_value).toBe('30')
  })

  it('should delete a parameter rule', async () => {
    const { data: rule } = await supabaseAdmin.from('parameter_rules').insert({ parameter_id: testParam.id }).select().single()
    const req = new Request(`http://localhost/api/admin/parameter-rules/${rule.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` },
    })
    const res = await app.request(req)
    expect(res.status).toBe(204)
  })
})
