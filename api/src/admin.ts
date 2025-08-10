import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { adminOnly, supabaseAdminClient } from './middleware'

const admin = new Hono()

// All admin routes are protected by the admin middleware
admin.use('*', (c, next) => jwt({ secret: process.env.JWT_SECRET! })(c, next))
admin.use('*', supabaseAdminClient)
admin.use('*', adminOnly)


const templates = new Hono()

// POST /templates - Create a new setup template
templates.post('/', async (c) => {
    const templateData = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')

    const newTemplate = {
        ...templateData,
        is_template: true,
        is_public: true, // Templates are public by default
    }

    const { data, error } = await supabaseAdmin.from('setups').insert(newTemplate).select().single()

    if (error) {
        return c.json({ error: error.message }, 500)
    }
    return c.json(data, 201)
})

// PUT /templates/:id - Update a setup template
templates.put('/:id', async (c) => {
    const { id } = c.req.param()
    const templateData = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin
        .from('setups')
        .update(templateData)
        .eq('id', id)
        .eq('is_template', true) // ensure we only update templates
        .select()
        .single()

    if (error) { return c.json({ error: error.message }, 500) }
    return c.json(data)
})

// DELETE /templates/:id - Delete a setup template
templates.delete('/:id', async (c) => {
    const { id } = c.req.param()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { error } = await supabaseAdmin
        .from('setups')
        .delete()
        .eq('id', id)
        .eq('is_template', true)

    if (error) { return c.json({ error: error.message }, 500) }
    return c.body(null, 204)
})

admin.route('/templates', templates)

export default admin
