import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Use the same database connection as the CMS
const pool = new Pool({
    connectionString: process.env.DATABASE_URI,
})

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')
        const id = searchParams.get('id')

        let query: string
        let params: any[]

        if (id) {
            // Fetch single customer by ID
            query = `SELECT * FROM cms.customer_profiles WHERE id = $1`
            params = [id]
        } else if (search) {
            // Search by name, email, or phone
            query = `
                SELECT * FROM cms.customer_profiles
                WHERE name ILIKE $1
                   OR email ILIKE $1
                   OR phone ILIKE $1
                   OR company ILIKE $1
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
            `
            params = [`%${search}%`, limit, offset]
        } else {
            // List all customers
            query = `
                SELECT * FROM cms.customer_profiles
                ORDER BY created_at DESC
                LIMIT $1 OFFSET $2
            `
            params = [limit, offset]
        }

        const result = await pool.query(query, params)

        // Get total count for pagination
        let total = result.rowCount || 0
        if (!id) {
            const countQuery = search
                ? `SELECT COUNT(*) FROM cms.customer_profiles WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1 OR company ILIKE $1`
                : `SELECT COUNT(*) FROM cms.customer_profiles`
            const countParams = search ? [`%${search}%`] : []
            const countResult = await pool.query(countQuery, countParams)
            total = parseInt(countResult.rows[0]?.count || '0')
        }

        return NextResponse.json({
            docs: id ? result.rows : result.rows,
            totalDocs: total,
            limit,
            offset,
            hasNextPage: offset + limit < total,
        })
    } catch (error: any) {
        console.error('Customer profiles API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch customer profiles', details: error.message },
            { status: 500 }
        )
    }
}
