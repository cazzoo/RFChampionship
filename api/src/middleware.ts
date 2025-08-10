import { createMiddleware } from 'hono/factory'
import { createClient } from '@supabase/supabase-js'

// --- Type Definition for Context Variables ---
type AppContext = {
    Variables: {
        supabase: ReturnType<typeof createClient>,
        supabaseAdmin: ReturnType<typeof createClient>,
        userRoles: string[]
    }
}

// --- Middleware Definitions ---

// Attaches a Supabase client with the public anon key
export const supabaseClient = createMiddleware<AppContext>(async (c, next) => {
    c.set('supabase', createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    ))
    await next()
})

// Attaches a Supabase client with the service role key for admin operations
export const supabaseAdminClient = createMiddleware<AppContext>(async (c, next) => {
    c.set('supabaseAdmin', createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    ))
    await next()
})


// Checks if the user has the ROLE_ADMIN
export const adminOnly = createMiddleware<AppContext>(async (c, next) => {
    const payload = c.get('jwtPayload')
    if (!payload || !payload.sub) {
        return c.json({ error: 'Unauthorized' }, 401)
    }

    const supabaseAdmin = c.get('supabaseAdmin') // Assumes supabaseAdminClient middleware has run
    if (!supabaseAdmin) {
        return c.json({ error: 'Server configuration error' }, 500)
    }

    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('roles')
        .eq('id', payload.sub)
        .single()

    if (error || !data) {
        return c.json({ error: 'User profile not found' }, 404)
    }

    const roles = data.roles || []
    if (!roles.includes('ROLE_ADMIN')) {
        return c.json({ error: 'Forbidden' }, 403)
    }

    c.set('userRoles', roles)
    await next()
})
