const supabase = require('../config/db')

const createCv = async (req, res) => {
  const { name } = req.body
  const userId = req.user.id

  if (!name) {
    return res.status(400).json({ success: false, message: 'Nama CV wajib diisi' })
  }

  try {
    const { data, error } = await supabase
      .from('cvs')
      .insert([{ user_id: userId, name }])
      .select()
      .single()

    if (error) throw error

    return res.status(201).json({
      success: true,
      message: 'CV berhasil dibuat',
      data
    })
  } catch (error) {
    console.error('Gagal membuat CV:', error.message)
    return res.status(500).json({ success: false, message: 'Gagal membuat CV' })
  }
}

const getAllCvs = async (req, res) => {
  const userId = req.user.id

  try {
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return res.status(200).json({ success: true, data })
  } catch (error) {
    console.error('Gagal mengambil CV:', error.message)
    return res.status(500).json({ success: false, message: 'Gagal mengambil data CV' })
  }
}

const getCvById = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle()

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'CV tidak ditemukan' })
    }

    return res.status(200).json({ success: true, data })
  } catch (error) {
    console.error('Gagal mengambil detail CV:', error.message)
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail CV' })
  }
}

const updateCv = async (req, res) => {
  const { id } = req.params
  const { name } = req.body
  const userId = req.user.id

  try {
    const { data, error } = await supabase
      .from('cvs')
      .update({ name })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .maybeSingle()

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'CV tidak ditemukan' })
    }

    return res.status(200).json({
      success: true,
      message: 'CV berhasil diperbarui',
      data
    })
  } catch (error) {
    console.error('Gagal update CV:', error.message)
    return res.status(500).json({ success: false, message: 'Gagal update CV' })
  }
}

const deleteCv = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const { data, error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .maybeSingle()

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'CV tidak ditemukan' })
    }

    return res.status(200).json({ success: true, message: 'CV berhasil dihapus' })
  } catch (error) {
    console.error('Gagal hapus CV:', error.message)
    return res.status(500).json({ success: false, message: 'Gagal menghapus CV' })
  }
}

module.exports = { createCv, getAllCvs, getCvById, updateCv, deleteCv }