import { useEffect, useMemo, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import './App.css'

const API_BASE = import.meta.env.VITE_ADMIN_API_URL;

const formatValue = (value) => {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'object') return JSON.stringify(value, null, 0)
  return String(value)
}

const showError = (message) => message || 'Something went wrong. Please try again.'

// --- SKELETON COMPONENTS ---
const SkeletonCard = () => (
  <div className="glass-card rounded-[28px] p-6 animate-pulse">
    <div className="h-3 w-1/3 rounded-full bg-white/10 mb-5"></div>
    <div className="h-8 w-1/2 rounded-full bg-white/20 mb-4"></div>
    <div className="h-3 w-2/3 rounded-full bg-white/10"></div>
  </div>
)

const SkeletonListItem = () => (
  <div className="glass-card rounded-[32px] border border-white/10 bg-[#0b1220]/90 p-6 animate-pulse mb-4">
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="h-3 w-1/4 rounded-full bg-white/10"></div>
        <div className="h-5 w-2/4 rounded-full bg-white/20"></div>
        <div className="h-4 w-1/3 rounded-full bg-white/10"></div>
      </div>
      <div className="space-y-4">
        <div className="h-3 w-1/4 rounded-full bg-white/10"></div>
        <div className="h-5 w-2/4 rounded-full bg-white/20"></div>
        <div className="h-4 w-1/3 rounded-full bg-white/10"></div>
      </div>
    </div>
  </div>
)

const SkeletonDashboardRow = () => (
  <div className="rounded-3xl border border-white/10 bg-[#070a13]/90 px-4 py-3 animate-pulse mb-3">
    <div className="flex items-center justify-between mb-2">
      <div className="h-4 w-1/3 rounded bg-white/20"></div>
      <div className="h-3 w-1/5 rounded bg-white/10"></div>
    </div>
    <div className="h-3 w-1/4 rounded bg-white/10"></div>
  </div>
)
// ---------------------------

function App() {
  const [token, setToken] = useState(localStorage.getItem('addaAdminToken') || '')
  const [view, setView] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [adminName, setAdminName] = useState('Admin')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [certificateForm, setCertificateForm] = useState({ fullName: '', email: '', position: '' })
  
  // Popup state for generated certificate
  const [generatedCertId, setGeneratedCertId] = useState(null)

  const [reports, setReports] = useState([])
  const [transactions, setTransactions] = useState([])
  const [rooms, setRooms] = useState([])
  const [applications, setApplications] = useState([])
  const [applicationActionLoading, setApplicationActionLoading] = useState({})

  useEffect(() => {
    if (!token) {
      setView('login')
      return
    }
    setView((current) => (current === 'login' ? 'dashboard' : current))
    loadDashboardData()
  }, [token])

  const saveToken = (newToken, adminEmail) => {
    localStorage.setItem('addaAdminToken', newToken)
    setAdminName(adminEmail || 'Admin')
    setToken(newToken)
  }

  const clearSession = () => {
    localStorage.removeItem('addaAdminToken')
    setToken('')
    setView('login')
    setReports([])
    setTransactions([])
    setRooms([])
    setApplications([])
    setMessage('')
    setError('')
  }

  const request = async (path, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      ...options,
      headers,
    })

    const body = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(body?.message || `Request failed: ${response.status}`)
    }
    return body
  }

  const loadDashboardData = async () => {
    setFetchingData(true)
    setError('')
    try {
      const [reportRes, transactionRes, roomsRes, applicationsRes] = await Promise.all([
        request('/all-report'),
        request('/all-transaction'),
        request('/all-openrooms'),
        request('/all-application'),
      ])

      setReports([...(reportRes?.data || [])].reverse())
      setTransactions([...(transactionRes?.data || [])].reverse())
      setRooms([...(roomsRes?.data || [])].reverse())
      setApplications([...(applicationsRes?.data || [])].reverse())
    } catch (err) {
      if (err.message.toLowerCase().includes('unauthorized')) {
        clearSession()
      } else {
        setError(showError(err.message))
      }
    } finally {
      setFetchingData(false)
    }
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const body = await request('/admin-login', {
        method: 'POST',
        body: JSON.stringify(loginData),
      })

      const authToken = body?.data?.token
      if (!authToken) {
        throw new Error('Login succeeded but token is unavailable.')
      }

      saveToken(authToken, loginData.email)
      setView('dashboard')
      setMessage('Login successful. Loading admin dashboard...')
    } catch (err) {
      setError(showError(err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleCertificateSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const body = await request('/create-certificate', {
        method: 'POST',
        body: JSON.stringify(certificateForm),
      })
      
      const certId = body?.data || 'ID_UNAVAILABLE'
      setGeneratedCertId(certId)
      setMessage(`Certificate successfully created.`)
      setCertificateForm({ fullName: '', email: '', position: '' })
    } catch (err) {
      setError(showError(err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleApplicationAction = async (application, action) => {
    const actionKey = `${application._id}-${action}`
    setApplicationActionLoading((prev) => ({ ...prev, [actionKey]: true }))
    setError('')
    setMessage('')

    try {
      const path = action === 'accept' ? '/accpect' : '/reject'
      await request(path, {
        method: 'POST',
        body: JSON.stringify({
          userID: application._id,
          email: application.email || '',
        }),
      })

      setApplications((prev) =>
        prev.map((item) =>
          item._id === application._id
            ? { ...item, applicationStatus: action === 'accept' ? 'accepted' : 'rejected' }
            : item,
        ),
      )
      setMessage(`Task done. Application ${action === 'accept' ? 'accepted' : 'rejected'} successfully.`)
    } catch (err) {
      setError(showError(err.message))
    } finally {
      setApplicationActionLoading((prev) => {
        const next = { ...prev }
        delete next[actionKey]
        return next
      })
    }
  }

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-canvas-element')
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `Certificate-QR-${generatedCertId}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  const dashboardCards = useMemo(
    () => [
      { title: 'Coin Purchases', value: transactions.length, description: 'All coin purchase history' },
      { title: 'Reports', value: reports.length, description: 'Reported user and girls cases' },
      { title: 'Open Rooms', value: rooms.length, description: 'Live rooms currently opened' },
      { title: 'Applications', value: applications.length, description: 'Pending profile applications' },
    ],
    [applications.length, reports.length, rooms.length, transactions.length],
  )

  const NavLink = ({ label, id }) => (
    <button
      type="button"
      onClick={() => setView(id)}
      className={`transition rounded-full border px-4 py-2 text-sm font-semibold tracking-wide ${view === id ? 'border-transparent bg-[#ff2a73] text-white shadow-[0_14px_35px_rgba(255,41,148,0.26)]' : 'border-white/10 bg-white/5 text-slate-200 hover:border-[#8B2BFF]/50 hover:bg-[#8B2BFF]/10'}`}
    >
      {label}
    </button>
  )

  return (
    <div className="app-shell min-h-screen text-slate-100">
      
      {/* Certificate QR Popup Modal */}
      {generatedCertId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#04050c]/80 backdrop-blur-md px-4">
          <div className="w-full max-w-sm rounded-[32px] border border-white/10 bg-[#0b1220] p-8 shadow-2xl flex flex-col items-center text-center">
            <h3 className="mb-2 text-2xl font-bold text-white">QR Generated</h3>
            <p className="mb-6 text-sm text-slate-400">Scan to view the certificate online.</p>
            
            {/* White background ensures high contrast for QR scanning */}
            <div className="rounded-3xl bg-white p-4 shadow-inner mb-6">
              <QRCodeCanvas
                id="qr-canvas-element"
                value={`https://addalove.com/${generatedCertId}`}
                size={220}
                level={"H"}
                includeMargin={true}
              />
            </div>
            
            <p className="mb-8 w-full truncate rounded-2xl bg-[#040711] px-4 py-3 text-xs text-slate-300 ring-1 ring-white/10">
              https://addalove.com/{generatedCertId}
            </p>
            
            <div className="flex w-full gap-3">
              <button
                onClick={() => setGeneratedCertId(null)}
                className="flex-1 rounded-full border border-white/10 bg-transparent py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                Close
              </button>
              <button
                onClick={downloadQRCode}
                className="flex-1 rounded-full bg-gradient-to-r from-[#ff2a73] to-[#8b2bff] py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(255,41,148,0.2)] transition hover:opacity-90"
              >
                Download QR
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-white/10 bg-[#04050c]/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm uppercase tracking-[0.3em] text-[#8b5cff]/70">Admin Panel</p>
            <h1 className="text-3xl font-black text-white">AddaLove Dashboard</h1>
            <p className="mt-2 text-sm text-slate-400">Manage reports, rooms, transactions, applications, and certificates.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <NavLink label="Dashboard" id="dashboard" />
            <NavLink label="Reports" id="reports" />
            <NavLink label="Transactions" id="transactions" />
            <NavLink label="Applications" id="applications" />
            <NavLink label="Create Certificate" id="certificate" />
            <button
              type="button"
              onClick={clearSession}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-[#ff2a73]/60 hover:bg-[#ff2a73]/10"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {error && (
          <div className="mb-6 rounded-3xl border border-[#ff2a73]/20 bg-[#ff2a73]/10 p-4 text-sm text-[#ffe4ef] shadow-lg shadow-[#ff2a73]/10">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 rounded-3xl border border-[#8b2bff]/20 bg-[#8b2bff]/10 p-4 text-sm text-[#eef0ff] shadow-lg shadow-[#8b2bff]/10">
            {message}
          </div>
        )}

        {!token && (
          <section className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-[#090b16]/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.28em] text-[#ff4d8d]/80">Secure login</p>
              <h2 className="mt-4 text-3xl font-black text-white">Admin Sign In</h2>
              <p className="mt-3 text-slate-400">Log in with your admin credentials to access the AddaLove control center.</p>
            </div>

            <form className="space-y-5" onSubmit={handleLoginSubmit}>
              <label className="block text-sm font-semibold text-slate-200">
                Email
                <input
                  value={loginData.email}
                  onChange={(event) => setLoginData((prev) => ({ ...prev, email: event.target.value }))}
                  type="email"
                  required
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-[#06101f] px-4 py-3 text-slate-100 outline-none transition focus:border-[#ff2a73]/50 focus:ring-2 focus:ring-[#ff2a73]/20"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-200">
                Password
                <input
                  value={loginData.password}
                  onChange={(event) => setLoginData((prev) => ({ ...prev, password: event.target.value }))}
                  type="password"
                  required
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-[#06101f] px-4 py-3 text-slate-100 outline-none transition focus:border-[#8b2bff]/50 focus:ring-2 focus:ring-[#8b2bff]/20"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-3xl bg-gradient-to-r from-[#ff2a73] to-[#8b2bff] px-5 py-3 text-base font-semibold text-white shadow-[0_18px_45px_rgba(255,41,148,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </section>
        )}

        {token && view === 'dashboard' && (
          <section className="space-y-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {fetchingData ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                dashboardCards.map((item) => (
                  <div key={item.title} className="glass-card rounded-[28px] p-6 transition hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{item.title}</p>
                    <p className="mt-4 text-4xl font-black text-white">{item.value}</p>
                    <p className="mt-3 text-sm text-slate-300">{item.description}</p>
                  </div>
                ))
              )}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="glass-card rounded-[32px] p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-[#8b5cff]/70">Overview</p>
                    <h2 className="mt-3 text-2xl font-bold text-white">Recent activity</h2>
                    <p className="mt-2 text-sm text-slate-400">Live data from transactions, reports, and open rooms.</p>
                  </div>
                  <div className="rounded-3xl bg-[#10131f] px-4 py-2 text-sm text-slate-300">Welcome, {adminName}</div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-[28px] border border-white/10 bg-[#031019]/80 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Latest Transactions</p>
                      <span className="text-xs uppercase tracking-[0.25em] text-slate-500">{transactions.length} items</span>
                    </div>
                    <div className="space-y-3">
                      {fetchingData ? (
                        <>
                          <SkeletonDashboardRow />
                          <SkeletonDashboardRow />
                          <SkeletonDashboardRow />
                        </>
                      ) : (
                        transactions.slice(0, 4).map((item) => (
                          <div key={item._id || item.id || Math.random()} className="rounded-3xl border border-white/10 bg-[#070a13]/90 px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-white truncate max-w-[150px]">{item?.userDetails?.fullName || item?.userDetails?.email || 'Unknown user'}</p>
                              <span className="text-xs text-slate-400">{item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-300">Amount: <span className="font-semibold text-white">{item.amount || item.coins || '–'}</span></p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-[#031019]/80 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Latest Reports</p>
                      <span className="text-xs uppercase tracking-[0.25em] text-slate-500">{reports.length} items</span>
                    </div>
                    <div className="space-y-3">
                      {fetchingData ? (
                        <>
                          <SkeletonDashboardRow />
                          <SkeletonDashboardRow />
                          <SkeletonDashboardRow />
                        </>
                      ) : (
                        reports.slice(0, 4).map((report) => (
                          <div key={report._id || Math.random()} className="rounded-3xl border border-white/10 bg-[#070a13]/90 px-4 py-3">
                            <p className="text-sm font-semibold text-white">{report?.reportedByDetails?.fullName || report?.reportedByDetails?.phoneNumber || 'Reporter'}</p>
                            <p className="mt-1 text-sm text-slate-300">Target: {report?.reportedUserDetails?.fullName || report?.reportedUserDetails?.phoneNumber || 'Unknown'}</p>
                            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#ff2a73]/80">{report?.userModel || report?.reportedUserModel || 'Report'}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-[32px] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-[#8b5cff]/70">Quick view</p>
                    <h2 className="mt-3 text-2xl font-bold text-white">Open rooms</h2>
                  </div>
                </div>
                <div className="space-y-4">
                  {fetchingData ? (
                    <>
                      <SkeletonDashboardRow />
                      <SkeletonDashboardRow />
                      <SkeletonDashboardRow />
                    </>
                  ) : (
                    rooms.slice(0, 4).map((room) => (
                      <div key={room._id || room.id || Math.random()} className="rounded-3xl border border-white/10 bg-[#070a13]/90 px-4 py-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="truncate">
                            <p className="text-sm font-semibold text-white truncate">{room?.name || room?.title || 'Room'}</p>
                            <p className="mt-1 text-sm text-slate-400 truncate">Host: {room?.creator || room?.host || 'Unknown'}</p>
                          </div>
                          <span className="rounded-full bg-[#0f172a] px-3 py-1 text-[10px] uppercase tracking-widest text-slate-300 shrink-0 border border-white/5">{room?.category || room?.roomType || 'Room'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {token && view === 'applications' && (
          <section className="space-y-6">
            <div className="glass-card rounded-[32px] p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#8b5cff]/70">Applications</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">Pending applicant data</h2>
                  <p className="mt-2 text-sm text-slate-400">Review every field for each application.</p>
                </div>
                <span className="rounded-3xl border border-white/10 bg-[#ffffff0d] px-4 py-2 text-sm text-slate-200">Total: {applications.length}</span>
              </div>
            </div>

            <div className="grid gap-5">
              {fetchingData ? (
                <>
                  <SkeletonListItem />
                  <SkeletonListItem />
                </>
              ) : (
                applications.map((application) => (
                  <div key={application._id || Math.random()} className="glass-card rounded-[32px] p-6">
                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Application ID</p>
                        <p className="mt-1 text-lg font-semibold text-white">{application._id || 'Unknown'}</p>
                        <p className="mt-2 text-sm text-slate-300">{application.fullName || application.name || 'Applicant'}</p>
                      </div>
                      {application.applicationStatus === 'pending' ? (
                        <div className="flex flex-wrap gap-3">
                          {(() => {
                            const isAccepting = applicationActionLoading[`${application._id}-accept`]
                            const isRejecting = applicationActionLoading[`${application._id}-reject`] 
                            return (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApplicationAction(application, 'accept')}
                                  disabled={isAccepting || isRejecting}
                                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isAccepting || isRejecting ? 'cursor-wait border border-[#14b8a6]/20 bg-[#14b8a6]/20 text-[#8ee7dc] opacity-80' : 'border border-[#14b8a6]/20 bg-[#14b8a6]/10 text-[#8ee7dc] hover:bg-[#14b8a6]/20'}`}
                                >
                                  {isAccepting ? (
                                    <span className="inline-flex items-center gap-2">
                                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/10 border-t-white"></span>
                                      Accepting...
                                    </span>
                                  ) : (
                                    'Accept'
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleApplicationAction(application, 'reject')}
                                  disabled={isAccepting || isRejecting}
                                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isAccepting || isRejecting ? 'cursor-wait border border-[#ef4444]/20 bg-[#ef4444]/20 text-[#fecaca] opacity-80' : 'border border-[#ef4444]/20 bg-[#ef4444]/10 text-[#fecaca] hover:bg-[#ef4444]/20'}`}
                                >
                                  {isRejecting ? (
                                    <span className="inline-flex items-center gap-2">
                                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/10 border-t-white"></span>
                                      Rejecting...
                                    </span>
                                  ) : (
                                    'Reject'
                                  )}
                                </button>
                              </>
                            )
                          })()}
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {Object.entries(application)
                        .filter(([key]) => key !== '__v')
                        .map(([key, value]) => (
                          <div key={key} className="rounded-3xl border border-white/5 bg-[#0b1220]/90 p-4">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 truncate">{key}</p>
                            <p className="mt-2 text-sm text-slate-100 break-words">{formatValue(value)}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {token && view === 'reports' && (
          <section className="space-y-6">
            <div className="glass-card rounded-[32px] p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#8b5cff]/70">Reports</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">All report data</h2>
                  <p className="mt-2 text-sm text-slate-400">Inspect every report record from users and girls in one place.</p>
                </div>
                <span className="rounded-3xl border border-white/10 bg-[#ffffff0d] px-4 py-2 text-sm text-slate-200">Total: {reports.length}</span>
              </div>
            </div>

            <div className="space-y-4">
              {fetchingData ? (
                <>
                  <SkeletonListItem />
                  <SkeletonListItem />
                </>
              ) : (
                reports.map((report) => (
                  <div key={report._id || Math.random()} className="glass-card rounded-[32px] border border-white/10 bg-[#0b1220]/90 p-6">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="space-y-3">
                        <p className="text-sm text-slate-400">Report ID</p>
                        <p className="text-lg font-semibold text-white">{report._id || 'Unknown'}</p>
                       
                        <p className="text-sm text-slate-300">Model: <span className="font-semibold text-white">{report.userModel || 'Unknown'}</span></p>
                      </div>

                      <div className="space-y-3 rounded-3xl bg-white/5 p-4 border border-white/5">
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">Reported by</p>
                          <p className="text-sm text-slate-100 font-semibold">{report?.reportedByDetails?.fullName || report?.reportedByDetails?.phoneNumber || 'Unknown'}</p>
                        </div>
                        <div className="h-[1px] w-full bg-white/10"></div>
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">Target Account</p>
                          <p className="text-sm text-slate-100 font-semibold">{report?.reportedUserDetails?.fullName || report?.reportedUserDetails?.phoneNumber || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border border-white/10 bg-[#040711]/90 p-4">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Description</p>
                        <p className="mt-2 text-sm text-slate-100">{formatValue(report.description || report.reason || report.details || 'No description')}</p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-[#040711]/90 p-4">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Created at</p>
                        <p className="mt-2 text-sm text-slate-100">{report.createdAt ? new Date(report.createdAt).toLocaleString() : 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {token && view === 'transactions' && (
          <section className="space-y-6">
            <div className="glass-card rounded-[32px] p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#8b5cff]/70">Transactions</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">All purchase history</h2>
                  <p className="mt-2 text-sm text-slate-400">Review every coin purchase transaction in full detail.</p>
                </div>
                <span className="rounded-3xl border border-white/10 bg-[#ffffff0d] px-4 py-2 text-sm text-slate-200">Total: {transactions.length}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {fetchingData ? (
                <>
                  <SkeletonListItem />
                  <SkeletonListItem />
                </>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction._id || transaction.id || Math.random()} className="glass-card rounded-[32px] border border-white/10 bg-[#0b1220]/90 p-6">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="space-y-3">
                        <p className="text-sm text-slate-400">Transaction ID</p>
                        <p className="text-lg font-semibold text-white">{transaction._id || transaction.id || 'Unknown'}</p>
                        <p className="text-sm text-slate-300">User</p>
                        <p className="text-sm font-semibold text-slate-100">{transaction?.userDetails?.fullName || transaction?.userDetails?.email || 'Unknown'}</p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm text-slate-400">Amount</p>
                        <p className="text-lg font-bold text-[#8b2bff]">{transaction.amount || transaction.coins || '—'}</p>
                        <p className="text-sm text-slate-300">Date</p>
                        <p className="text-sm text-slate-100">{transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : 'Unknown'}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border border-white/10 bg-[#040711]/90 p-4">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">razorpay_payment_id</p>
                        <p className="mt-2 text-sm text-slate-100 break-all">{transaction.razorpay_payment_id || 'N/A'}</p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-[#040711]/90 p-4">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Phone Number</p>
                        <p className="mt-2 text-sm text-slate-100">{transaction.userDetails?.phoneNumber || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {token && view === 'certificate' && (
          <section className="space-y-6">
            <div className="glass-card rounded-[32px] p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#8b5cff]/70">Certificate creator</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Create a new certificate</h2>
                <p className="mt-2 text-sm text-slate-400">Use the protected create-certificate endpoint to issue a new certificate.</p>
              </div>

              <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleCertificateSubmit}>
                <label className="space-y-2 text-sm font-semibold text-slate-200">
                  Full name
                  <input
                    value={certificateForm.fullName}
                    onChange={(event) => setCertificateForm((prev) => ({ ...prev, fullName: event.target.value }))}
                    type="text"
                    required
                    className="w-full rounded-3xl border border-white/10 bg-[#06101f] px-4 py-3 text-slate-100 outline-none transition focus:border-[#ff2a73]/50 focus:ring-2 focus:ring-[#ff2a73]/20"
                  />
                </label>

                <label className="space-y-2 text-sm font-semibold text-slate-200">
                  Email
                  <input
                    value={certificateForm.email}
                    onChange={(event) => setCertificateForm((prev) => ({ ...prev, email: event.target.value }))}
                    type="email"
                    required
                    className="w-full rounded-3xl border border-white/10 bg-[#06101f] px-4 py-3 text-slate-100 outline-none transition focus:border-[#8b2bff]/50 focus:ring-2 focus:ring-[#8b2bff]/20"
                  />
                </label>

                <label className="space-y-2 text-sm font-semibold text-slate-200 sm:col-span-2">
                  Position
                  <input
                    value={certificateForm.position}
                    onChange={(event) => setCertificateForm((prev) => ({ ...prev, position: event.target.value }))}
                    type="text"
                    required
                    className="w-full rounded-3xl border border-white/10 bg-[#06101f] px-4 py-3 text-slate-100 outline-none transition focus:border-[#8b2bff]/50 focus:ring-2 focus:ring-[#8b2bff]/20"
                  />
                </label>

                <button
                  type="submit"
                  className="sm:col-span-2 rounded-3xl bg-gradient-to-r from-[#ff2a73] to-[#8b2bff] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_45px_rgba(255,41,148,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? 'Creating certificate...' : 'Create Certificate'}
                </button>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App