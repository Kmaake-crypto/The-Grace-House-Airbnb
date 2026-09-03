import { Router } from 'express'

const router = Router()
const TAPLINE_BASE_URL = 'https://tapline.sh'

async function forward(path, body, res) {
  if (!process.env.TAPLINE_API_KEY) {
    return res.status(503).json({ success: false, message: 'Live listings service is not configured' })
  }

  try {
    const response = await fetch(`${TAPLINE_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TAPLINE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    res.status(502).json({ success: false, message: `Live listings request failed: ${error.message}` })
  }
}

router.post('/search', (req, res) => forward('/v1/airbnb/search', req.body, res))
router.post('/details', (req, res) => forward('/v1/airbnb/details', req.body, res))
router.post('/price', (req, res) => forward('/v1/airbnb/priceFetch', req.body, res))

export default router
