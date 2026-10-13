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
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          code: 'TOKEN_EXPIRED',
          message: 'Sesi login telah berakhir, silakan login kembali.',
        })
      }
      return res.status(401).json({
        success: false,
        code: 'TOKEN_INVALID',
        message: 'Token tidak valid, silakan login kembali.',
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'TOKEN_MISSING',
      message: 'Token tidak ditemukan, silakan login terlebih dahulu.',
    })
  }
}

module.exports = { protect }