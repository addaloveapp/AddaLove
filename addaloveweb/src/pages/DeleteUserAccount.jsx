import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2, ShieldAlert, Trash2 } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/v1`;

const getErrorMessage = (response, body) => {
    if (body?.message) return body.message;
    return response.ok ? 'Something went wrong. Please try again.' : 'Request failed. Please try again.';
};

const request = async (path, body) => {
    const response = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
        throw new Error(getErrorMessage(response, data));
    }
    return data;
};

export default function DeleteUserAccount() {
    const navigate = useNavigate();
    const [step, setStep] = useState('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [account, setAccount] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const runRequest = async (action) => {
        setLoading(true);
        setError('');
        try {
            await action();
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    };

    const findAccount = (event) => {
        event.preventDefault();
        runRequest(async () => {
            const result = await request('/find-data-for-delete', { phoneNumber });
            setAccount(result.data);
            setStep('review');
        });
    };

    const verifyPassword = (event) => {
        event.preventDefault();
        runRequest(async () => {
            await request('/check-delete-password', {
                userId: account._id,
                userType: account.userType,
                password,
            });
            setStep('confirm');
        });
    };

    const deleteAccount = () => {
        runRequest(async () => {
            await request('/delete-account', {
                userId: account._id,
                userType: account.userType,
                password,
            });
            setStep('success');
            setTimeout(() => navigate('/'), 1800);
        });
    };

    const reset = () => {
        setStep('phone');
        setPhoneNumber('');
        setPassword('');
        setAccount(null);
        setError('');
    };

    return (
        <main className="min-h-screen bg-[#070514] px-6 py-16 font-sans text-white">
            <div className="mx-auto w-full max-w-xl">
                <Link to="/" className="mb-8 inline-block text-sm text-gray-400 transition hover:text-white">
                    ← Back to home
                </Link>

                <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-10">
                    <div className="mb-8 flex items-center gap-4">
                        <div className="rounded-2xl bg-red-500/15 p-3 text-red-400">
                            <Trash2 />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Delete your account</h1>
                            <p className="mt-1 text-sm text-gray-400">This action permanently removes your AddaLove account.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {step === 'phone' && (
                        <form onSubmit={findAccount} className="space-y-5">
                            <label className="block text-sm font-medium text-gray-300" htmlFor="phoneNumber">
                                First, enter the phone number linked to your account
                            </label>
                            <input
                                id="phoneNumber"
                                type="tel"
                                inputMode="numeric"
                                required
                                value={phoneNumber}
                                onChange={(event) => setPhoneNumber(event.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-pink-500"
                                placeholder="Phone number"
                            />
                            <button disabled={loading} className="w-full rounded-xl bg-linear-to-r from-pink-500 to-purple-600 px-5 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                                {loading ? <Loader2 className="mx-auto animate-spin" /> : 'Find my account'}
                            </button>
                        </form>
                    )}

                    {step === 'review' && account && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold">Is this your account?</h2>
                                <div className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10 bg-black/20">
                                    {Object.entries(account)
                                        .filter(([field]) => !['_id', '__v', 'password'].includes(field))
                                        .map(([field, value]) => (
                                        <div key={field} className="flex justify-between gap-4 px-4 py-3 text-sm">
                                            <span className="text-gray-400">{field}</span>
                                            <span className="max-w-[65%] wrap-break-word text-right text-white">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={reset} className="flex-1 rounded-xl border border-white/10 px-4 py-3 font-medium text-gray-300 transition hover:bg-white/5">No, go back</button>
                                <button onClick={() => { setError(''); setStep('password'); }} className="flex-1 rounded-xl bg-red-500 px-4 py-3 font-semibold transition hover:bg-red-400">Yes, continue</button>
                            </div>
                        </div>
                    )}

                    {step === 'password' && (
                        <form onSubmit={verifyPassword} className="space-y-5">
                            <div className="flex items-center gap-3 text-amber-300">
                                <ShieldAlert />
                                <h2 className="font-semibold">Confirm with your account password</h2>
                            </div>
                            <p className="text-sm text-gray-400">Enter your password to verify that you own this account.</p>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-pink-500"
                                placeholder="Account password"
                            />
                            <button disabled={loading} className="w-full rounded-xl bg-linear-to-r from-pink-500 to-purple-600 px-5 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                                {loading ? <Loader2 className="mx-auto animate-spin" /> : 'Verify password'}
                            </button>
                        </form>
                    )}

                    {step === 'confirm' && (
                        <div className="space-y-6 text-center">
                            <ShieldAlert className="mx-auto h-12 w-12 text-red-400" />
                            <div>
                                <h2 className="text-xl font-bold">Are you sure you want to delete your account?</h2>
                                <p className="mt-2 text-sm text-gray-400">Your profile and account access will be permanently deleted. This cannot be undone.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep('password')} className="flex-1 rounded-xl border border-white/10 px-4 py-3 font-medium text-gray-300 transition hover:bg-white/5">No, keep my account</button>
                                <button onClick={deleteAccount} disabled={loading} className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold transition hover:bg-red-500 disabled:opacity-60">
                                    {loading ? <Loader2 className="mx-auto animate-spin" /> : 'Yes, I want to delete'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-8 text-center">
                            <CheckCircle2 className="mx-auto h-16 w-16 text-green-400" />
                            <h2 className="mt-5 text-2xl font-bold">Account deleted successfully</h2>
                            <p className="mt-2 text-gray-400">You are being redirected to the home page.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
