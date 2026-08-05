import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CheckCircle, XCircle, Loader2, User, Mail, Briefcase, Calendar } from 'lucide-react';

export default function CertificateVerify() {
    const { id } = useParams();
    const [certificateData, setCertificateData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCertificateData = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/api/admin/v1/issuecertificate/${id}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                
                if (data.success) {
                    setCertificateData(data.data);
                    setError(false);
                } else {
                    setError(true);
                    setCertificateData(null);
                }
            } catch (err) {
                console.error("Error fetching certificate:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCertificateData();
        } else {
            setLoading(false);
            setError(true);
        }
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#070514] flex items-center justify-center p-6 font-sans text-white">
            <div className="w-full max-w-lg">
                
                {/* Loading State */}
                {loading && (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center space-y-4 shadow-xl">
                        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                        <p className="text-gray-400 font-medium tracking-wide">Verifying Certificate...</p>
                    </div>
                )}

                {/* Error / Not Found State */}
                {!loading && error && (
                    <div className="bg-white/5 backdrop-blur-md border border-red-500/30 rounded-3xl p-10 text-center shadow-[0_0_30px_rgba(239,68,68,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-white">Verification Failed</h2>
                        <p className="text-gray-400">We could not find a valid certificate matching this ID. It may be invalid, expired, or removed.</p>
                        <p className="mt-6 text-sm text-gray-500 break-all bg-black/30 p-3 rounded-xl border border-white/5">
                            ID: {id}
                        </p>
                    </div>
                )}

                {/* Success State */}
                {!loading && !error && certificateData && (
                    <div className="bg-white/5 backdrop-blur-md border border-emerald-500/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(16,185,129,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                        
                        <div className="flex flex-col items-center mb-8 border-b border-white/10 pb-8">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <CheckCircle className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Certificate Verified</h2>
                            <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
                                Official Record
                            </span>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5 hover:bg-black/30 transition-colors">
                                <div className="bg-white/10 p-2.5 rounded-xl">
                                    <User className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Full Name</p>
                                    <p className="text-lg font-semibold text-gray-100">{certificateData.fullName}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5 hover:bg-black/30 transition-colors">
                                <div className="bg-white/10 p-2.5 rounded-xl">
                                    <Briefcase className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Position</p>
                                    <p className="text-lg font-semibold text-gray-100">{certificateData.position}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5 hover:bg-black/30 transition-colors">
                                <div className="bg-white/10 p-2.5 rounded-xl">
                                    <Mail className="w-5 h-5 text-pink-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Email</p>
                                    <p className="text-[15px] font-medium text-gray-300">{certificateData.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5 hover:bg-black/30 transition-colors">
                                <div className="bg-white/10 p-2.5 rounded-xl">
                                    <Calendar className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Issue Date</p>
                                    <p className="text-[15px] font-medium text-gray-300">{formatDate(certificateData.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-[11px] text-gray-500 uppercase tracking-widest break-all">
                                Cert ID: {certificateData._id}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}