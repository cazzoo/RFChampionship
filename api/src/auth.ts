import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

const auth = new Hono()

auth.post('/users/register', async (c) => {
    const supabase = c.get('supabase')
    try {
      const { email, password } = await c.req.json()

      if (!email) { return c.json({ error: 'Email is required' }, 400) }
      if (!password) { return c.json({ error: 'Password is required' }, 400) }
      if (password.length < 6) { return c.json({ error: 'Password must be at least 6 characters long' }, 400) }

      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) {
        if (error.message.includes('User already registered')) { return c.json({ error: 'User already exists' }, 409) }
        if (error.message.includes('Unable to validate email address')) { return c.json({ error: 'Invalid email address' }, 400) }
        return c.json({ error: error.message }, 500)
      }

      if (data.user && data.session) { return c.json({ user: data.user, session: data.session }, 201) }
      else { return c.json({ message: 'User created, confirmation may be required' }, 201) }

    } catch (err) {
      return c.json({ error: 'Invalid request body' }, 400)
    }
})

auth.post('/auth/login', async (c) => {
    const supabase = c.get('supabase')
    try {
        const { email, password } = await c.req.json()

        if (!email || !password) { return c.json({ error: 'Email and password are required' }, 400) }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) { return c.json({ error: error.message }, 401) }

        return c.json({ user: data.user, session: data.session }, 200)

    } catch (err) {
        return c.json({ error: 'Invalid request body' }, 400)
    }
})

auth.use('/me', (c, next) => jwt({ secret: process.env.JWT_SECRET! })(c, next))
auth.get('/me', async (c) => {
    const payload = c.get('jwtPayload')
    if (!payload || !payload.sub) {
        return c.json({ error: 'Unauthorized' }, 401)
    }

    const supabase = c.get('supabase')
    const { data, error } = await supabase
        .from('profiles')
        .select('roles')
        .eq('id', payload.sub)
        .single()

    if (error || !data) {
        // Fallback for users who might not have a profile entry yet
        const user = { id: payload.sub, email: payload.email, aud: payload.aud, roles: [] }
        return c.json(user)
    }

    const user = { id: payload.sub, email: payload.email, aud: payload.aud, roles: data.roles || [] }
    return c.json(user)
})

export default auth
