import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { createClient } from '@supabase/supabase-js'

const setups = new Hono()

// --- Middleware ---
const authMiddleware = (c, next) => jwt({ secret: process.env.JWT_SECRET! })(c, next)
import { supabaseAdminClient } from './middleware'

setups.use('/form', authMiddleware, supabaseAdminClient) // Protect and provide admin client

// --- Routes ---

// GET /form - The brains of the setup system
setups.get('/form', async (c) => {
    const { vehicleId, trackId, ruleId, gameId } = c.req.query()
    const supabaseAdmin = c.get('supabaseAdmin')

    // 1. Fetch all possible parameters for the game
    const { data: parameters, error: paramsError } = await supabaseAdmin
        .from('setup_parameters')
        .select('*')
        .eq('game_id', gameId)
    if (paramsError) return c.json({ error: 'Failed to fetch parameters' }, 500)
    if (!parameters) return c.json({ parameters: [] })

    // 2. Fetch all rules for the game and filter in code to avoid complex query issues
    const { data: allRules, error: rulesError } = await supabaseAdmin
        .from('parameter_rules')
        .select('*')
        .eq('game_id', gameId)
    if (rulesError) return c.json({ error: 'Failed to fetch rules' }, 500)

    const rules = allRules.filter(r =>
        (r.vehicle_id === null || r.vehicle_id === parseInt(vehicleId)) &&
        (r.track_id === null || r.track_id === parseInt(trackId)) &&
        (r.rule_id === null || r.rule_id === parseInt(ruleId))
    )

    // 3. Resolve the final parameters and their constraints
    const resolvedParameters = parameters.map(param => {
        const applicableRules = rules
            .filter(r => r.parameter_id === param.id)
            .sort((a, b) => { // Sort by specificity (more context fields = more specific)
                const scoreA = (a.vehicle_id ? 4 : 0) + (a.track_id ? 2 : 0) + (a.rule_id ? 1 : 0);
                const scoreB = (b.vehicle_id ? 4 : 0) + (b.track_id ? 2 : 0) + (b.rule_id ? 1 : 0);
                return scoreB - scoreA;
            })

        // The most specific rule is the first one after sorting
        const winningRule = applicableRules[0];

        // Combine base parameter with the winning rule's constraints
        return {
            ...param,
            min_value: winningRule?.min_value ?? null,
            max_value: winningRule?.max_value ?? null,
            options: winningRule?.options ?? null,
            default_value: winningRule?.default_value ?? null,
            is_locked: winningRule?.is_locked ?? false,
            dependencies: winningRule?.dependencies ?? null,
        }
    })

    return c.json({ parameters: resolvedParameters })
})

export default setups
