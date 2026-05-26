import { NextRequest, NextResponse } from 'next/server'

const KLAVIYO_LIST_ID = 'XQCMLb'
const KLAVIYO_API_REVISION = '2024-10-15'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const privateKey = process.env.KLAVIYO_PRIVATE_KEY
    if (!privateKey) {
      console.error('[klaviyo] KLAVIYO_PRIVATE_KEY is not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const res = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${privateKey}`,
        'Content-Type': 'application/json',
        'revision': KLAVIYO_API_REVISION,
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    email,
                    subscriptions: {
                      email: {
                        marketing: {
                          consent: 'SUBSCRIBED',
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: KLAVIYO_LIST_ID,
              },
            },
          },
        },
      }),
    })

    // Klaviyo returns 202 Accepted on success (async job)
    if (!res.ok) {
      const body = await res.text()
      console.error('[klaviyo] API error:', res.status, body)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[klaviyo] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
