const supabase = require('../config/db')

const getDashboardStats = async (req, res) => {
  const userId = req.user.id

  try {
    // 1. Total Application Count
    const { count: totalApplications, error: countError } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError) throw countError

    // 2. Fetch data status untuk dihitung per kelompok (Breakdown)
    const { data: statusData, error: statusError } = await supabase
      .from('applications')
      .select('status')
      .eq('user_id', userId)

    if (statusError) throw statusError

    // Olah breakdown jumlah per status
    const statusCounts = statusData.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {})

    const statusBreakdown = Object.keys(statusCounts).map(status => ({
      status,
      count: statusCounts[status]
    }))

    // 3. 5 Lamaran Terbaru
    const { data: recentApplications, error: recentError } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('applied_date', { ascending: false })
      .limit(5)

    if (recentError) throw recentError

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data statistik dashboard',
      data: {
        totalApplications: totalApplications || 0,
        statusBreakdown,
        recentApplications
      }
    })
  } catch (error) {
    console.error('Gagal mengambil statistik dashboard:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data statistik dashboard'
    })
  }
}

module.exports = { getDashboardStats }