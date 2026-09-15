const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token dari header "Bearer <token>"
      token = req.headers.authorization.split(' ')[1]

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Simpan payload ({ id: user.id }) ke req.user
      req.user = decoded

      return next()
    } catch (error) {
      console.error('Auth middleware error:', error.message)
      return res.status(401).json({ success: false, message: 'Token tidak valid' })
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token Tidak Ditemukan!' })
  }
}

module.exports = { protect }