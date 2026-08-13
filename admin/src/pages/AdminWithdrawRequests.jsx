const StatusIcon = ({ action }) => (
  <span className="text-sm" aria-hidden="true">
    {action === 'send' ? '✓' : '○'}
  </span>
)

const AdminWithdrawRequests = ({
  requests,
  fetching,
  actionLoading,
  onRefresh,
  onSendMoney,
}) => (
  <section className="space-y-6">
    <div className="glass-card rounded-[32px] p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#8b5cff]/70">Payouts</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Withdraw Requests</h2>
          <p className="mt-2 text-sm text-slate-400">Review payout details and mark completed transfers as sent.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-3xl border border-white/10 bg-[#ffffff0d] px-4 py-2 text-sm text-slate-200">
            Total: {requests.length}
          </span>
          <button
            type="button"
            onClick={onRefresh}
            disabled={fetching}
            className="rounded-full border border-[#8b5cff]/30 bg-[#8b5cff]/10 px-4 py-2 text-sm font-semibold text-[#d8c7ff] transition hover:bg-[#8b5cff]/20 disabled:cursor-wait disabled:opacity-60"
          >
            {fetching ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    </div>

    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1220]/90">
      <div className="hidden grid-cols-[1.1fr_1fr_0.8fr_0.8fr_1.1fr_0.8fr_auto] gap-3 border-b border-white/10 px-5 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-slate-500 lg:grid">
        <span>User</span>
        <span>Application</span>
        <span>Amount</span>
        <span>Coins</span>
        <span>Method</span>
        <span>Status</span>
        <span>Action</span>
      </div>

      {fetching ? (
        <div className="space-y-3 p-5">
          <div className="h-20 animate-pulse rounded-3xl bg-white/10"></div>
          <div className="h-20 animate-pulse rounded-3xl bg-white/10"></div>
          <div className="h-20 animate-pulse rounded-3xl bg-white/10"></div>
        </div>
      ) : requests.length > 0 ? (
        <div className="divide-y divide-white/10">
          {requests.map((request) => {
            const isSending = actionLoading[request._id]
            const isSent = request.action === 'send'

            return (
              <div key={request._id} className="grid gap-4 px-5 py-5 text-sm lg:grid-cols-[1.1fr_1fr_0.8fr_0.8fr_1.1fr_0.8fr_auto] lg:items-center">
                <div>
                  <p className="font-bold text-white">{request.userName || 'Unknown girl'}</p>
                  <p className="mt-1 text-xs text-slate-400">Phone: {request.userPhoneNumber || 'N/A'}</p>
                  <p className="mt-1 break-all text-xs text-slate-500">{request.userId}</p>
                </div>

                <div className="font-bold text-[#ff9abc]">#{request.applicationId}</div>
                <div className="font-semibold text-white">Rs. {Number(request.withdrawAmount || 0).toFixed(2)}</div>
                <div className="font-semibold text-amber-200">{Number(request.coinValueForWithdraw || 0).toLocaleString()}</div>

                <div>
                  <p className="font-bold uppercase text-white">{request.withdrawMethod}</p>
                  <p className="mt-1 max-w-[240px] break-words text-xs text-slate-400">
                    {request.withdrawMethod === 'upi'
                      ? request.details?.upiId
                      : `${request.details?.accountNumber || ''} / ${request.details?.ifscCode || ''}`}
                  </p>
                </div>

                <div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black uppercase ${isSent ? 'bg-emerald-500/15 text-emerald-300' : 'bg-yellow-400/15 text-yellow-300'}`}>
                    <StatusIcon action={request.action} />
                    {request.action || 'pending'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onSendMoney(request)}
                  disabled={isSent || isSending}
                  className="rounded-full bg-[#ff2a73] px-4 py-2 text-xs font-black uppercase text-white transition hover:bg-[#ff4d8d] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-400"
                >
                  {isSending ? 'Sending...' : isSent ? 'Sent' : 'Send'}
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-10 text-center text-sm text-slate-400">No withdraw requests found.</div>
      )}
    </div>
  </section>
)

export default AdminWithdrawRequests
