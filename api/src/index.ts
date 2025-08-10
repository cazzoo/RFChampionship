import { Hono } from 'hono'

import { supabaseClient } from './middleware'

const app = new Hono()

// Attach Supabase client to all requests
app.use('*', supabaseClient)

import auth from './auth'
import games from './games'
import championships from './championships'
import events from './events'
import sessions from './sessions'
import setups from './setups'
import admin from './admin'

// All auth routes are now handled in the auth module
app.route('/api', auth)
app.route('/api/games', games)
app.route('/api/championships', championships)
app.route('/api/events', events)
app.route('/api/sessions', sessions)
app.route('/api/setups', setups)
app.route('/api/admin', admin)

export default app
