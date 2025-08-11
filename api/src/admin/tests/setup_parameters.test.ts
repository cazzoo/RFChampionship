import app from '../../index'
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabaseAdmin: SupabaseClient
let adminUser: any;
let adminToken: string;

describe('Admin Setup Parameters API', () => {

  beforeEach(async () => {
    supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    const { data: adminData } = await supabaseAdmin.auth.admin.createUser({ email: `admin.params.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true })
    adminUser = adminData.user;
    await supabaseAdmin.from('profiles').update({ roles: ['ROLE_ADMIN'] }).eq('id', adminUser.id)
    const adminLoginRes = await app.request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: adminUser.email, password: 'password123' })})
    adminToken = (await adminLoginRes.json()).session.access_token;
  })

  afterEach(async () => {
    await supabaseAdmin.from('setup_parameters').delete().neq('id', 0);
    if(adminUser) await supabaseAdmin.auth.admin.deleteUser(adminUser.id);
  })

  it('should allow an admin to create a setup parameter', async () => {
      const param = { name: 'Tire Pressure', category: 'Tires', value_type: 'number' }
      const req = new Request('http://localhost/api/admin/setup-parameters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
          body: JSON.stringify(param),
      })
      const res = await app.request(req)
      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.name).toBe(param.name)
  })

  it('should list all setup parameters', async () => {
    await supabaseAdmin.from('setup_parameters').insert({ name: 'Test Param', value_type: 'string' })
    const req = new Request('http://localhost/api/admin/setup-parameters', {
        headers: { 'Authorization': `Bearer ${adminToken}` },
    })
    const res = await app.request(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
  })
})
