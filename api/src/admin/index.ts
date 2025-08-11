import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { adminOnly, supabaseAdminClient } from '../middleware'
import setupParameters from './setup_parameters'
import parameterRules from './parameter_rules'

const admin = new Hono()

// All admin routes are protected by the admin middleware
admin.use('*', (c, next) => jwt({ secret: process.env.JWT_SECRET! })(c, next))
admin.use('*', supabaseAdminClient)
admin.use('*', adminOnly)

admin.route('/setup-parameters', setupParameters)
admin.route('/parameter-rules', parameterRules)

export default admin
