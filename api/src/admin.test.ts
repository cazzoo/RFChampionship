import app from './index'
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabaseAdmin: SupabaseClient
let adminUser: any;
let adminToken: string;
let regularUserToken: string;

describe('Admin API', () => {

  beforeEach(async () => {
    supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    // Create Admin User
    const { data: adminData } = await supabaseAdmin.auth.admin.createUser({ email: `admin.template.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true })
    adminUser = adminData.user;
    await supabaseAdmin.from('profiles').update({ roles: ['ROLE_ADMIN'] }).eq('id', adminUser.id)
    const adminLoginRes = await app.request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: adminUser.email, password: 'password123' })})
    adminToken = (await adminLoginRes.json()).session.access_token;

    // Create Regular User
    const { data: userData } = await supabaseAdmin.auth.admin.createUser({ email: `reg.template.${Date.now()}@rfc-test.com`, password: 'password123', email_confirm: true })
    const userLoginRes = await app.request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: userData.user.email, password: 'password123' })})
    regularUserToken = (await userLoginRes.json()).session.access_token;
  })

  afterEach(async () => {
    await supabaseAdmin.from('setups').delete().eq('is_template', true);
    if(adminUser) await supabaseAdmin.auth.admin.deleteUser(adminUser.id);
    const { data: regularUser } = await supabaseAdmin.from('profiles').select('id').like('email', 'reg.template.%').single();
    if(regularUser) await supabaseAdmin.auth.admin.deleteUser(regularUser.id);
  })

  describe('/api/admin/templates', () => {
    it('should allow an admin to create a setup template', async () => {
        const template = { name: 'Template Setup', description: 'A base template' }
        const req = new Request('http://localhost/api/admin/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
            body: JSON.stringify(template),
        })
        const res = await app.request(req)
        expect(res.status).toBe(201)
        const data = await res.json()
        expect(data.name).toBe(template.name)
        expect(data.is_template).toBe(true)
        expect(data.is_public).toBe(true) // Templates should be public by default
    })

    it('should not allow a regular user to create a setup template', async () => {
        const template = { name: 'Disallowed Template' }
        const req = new Request('http://localhost/api/admin/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${regularUserToken}` },
            body: JSON.stringify(template),
        })
        const res = await app.request(req)
        expect(res.status).toBe(403) // Forbidden
    })

    it('should allow an admin to update a template', async () => {
        const { data: t } = await supabaseAdmin.from('setups').insert({ name: 'Template to Update', is_template: true, is_public: true }).select().single()
        const updatedData = { name: 'Updated Template Name' }
        const req = new Request(`http://localhost/api/admin/templates/${t.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
            body: JSON.stringify(updatedData),
        })
        const res = await app.request(req)
        expect(res.status).toBe(200)
        const data = await res.json()
        expect(data.name).toBe(updatedData.name)
    })

    it('should allow an admin to delete a template', async () => {
        const { data: t } = await supabaseAdmin.from('setups').insert({ name: 'Template to Delete', is_template: true, is_public: true }).select().single()
        const req = new Request(`http://localhost/api/admin/templates/${t.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` },
        })
        const res = await app.request(req)
        expect(res.status).toBe(204)
    })
  })
})
