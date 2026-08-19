'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Shield, Camera, User, Phone, MapPin, Car, FileText,
    CheckCircle2, AlertCircle, Loader2, Building2, ChevronDown, Clock
} from 'lucide-react'
import { GatePublicService } from '@/services/gate.service'
import { connectUser, getSocket } from '@/lib/socket'
import { Badge } from '@/components/ui/badge'

export default function VisitorEntryPage() {
    const searchParams = useSearchParams()
    const gateId = searchParams.get('gateId') || ''

    // Gate validation state
    const [gateInfo, setGateInfo] = useState<any>(null)
    const [gateError, setGateError] = useState('')
    const [validating, setValidating] = useState(true)

    // Units for resident selector
    const [units, setUnits] = useState<any[]>([])

    // Form state
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [purpose, setPurpose] = useState('')
    const [whomToMeet, setWhomToMeet] = useState('')
    const [visitingUnitId, setVisitingUnitId] = useState('')
    const [vehicleNo, setVehicleNo] = useState('')
    const [fromLocation, setFromLocation] = useState('')
    const [photoBlob, setPhotoBlob] = useState<Blob | null>(null)
    const [photoPreview, setPhotoPreview] = useState('')

    // Camera state
    const [cameraOpen, setCameraOpen] = useState(false)
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Submission
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [visitorId, setVisitorId] = useState<number | null>(null)
    const [visitorStatus, setVisitorStatus] = useState<string>('PENDING')

    // Validate gate on load
    useEffect(() => {
        if (!gateId) {
            setGateError('No gate ID provided. Please scan a valid QR code.')
            setValidating(false)
            return
        }
        GatePublicService.validate(gateId)
            .then((data) => {
                setGateInfo(data)
                setValidating(false)
                // Load units
                GatePublicService.getUnits(gateId)
                    .then(setUnits)
                    .catch(() => { })
            })
            .catch((err) => {
                setGateError(err.message || 'Invalid gate')
                setValidating(false)
            })
    }, [gateId])

    // Camera helpers
    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            })
            setCameraStream(stream)
            setCameraOpen(true)
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    videoRef.current.play()
                }
            }, 100)
        } catch {
            alert('Unable to access camera. Please allow camera permissions.')
        }
    }, [])

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return
        const canvas = canvasRef.current
        canvas.width = videoRef.current.videoWidth || 640
        canvas.height = videoRef.current.videoHeight || 480
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(videoRef.current, 0, 0)
        canvas.toBlob((blob) => {
            if (blob) {
                setPhotoBlob(blob)
                setPhotoPreview(URL.createObjectURL(blob))
            }
        }, 'image/jpeg', 0.8)
        // Stop camera
        cameraStream?.getTracks().forEach(t => t.stop())
        setCameraStream(null)
        setCameraOpen(false)
    }, [cameraStream])

    const retakePhoto = () => {
        setPhotoBlob(null)
        setPhotoPreview('')
        startCamera()
    }

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            cameraStream?.getTracks().forEach(t => t.stop())
        }
    }, [cameraStream])

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitError('')
        if (!name.trim()) return setSubmitError('Full name is required')
        if (!phone.trim() || phone.length < 10) return setSubmitError('Valid mobile number is required')
        if (!purpose.trim()) return setSubmitError('Purpose of visit is required')

        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('phone', phone.trim())
            formData.append('purpose', purpose.trim())
            formData.append('whomToMeet', whomToMeet.trim())
            if (visitingUnitId) formData.append('visitingUnitId', visitingUnitId)
            if (vehicleNo.trim()) formData.append('vehicleNo', vehicleNo.trim())
            if (fromLocation.trim()) formData.append('fromLocation', fromLocation.trim())
            if (photoBlob) formData.append('photo', photoBlob, 'visitor-photo.jpg')

            const response = await GatePublicService.submitEntry(gateId, formData)
            setVisitorId(response.id)
            setSubmitted(true)
        } catch (err: any) {
            setSubmitError(err.message || 'Submission failed')
        } finally {
            setSubmitting(false)
        }
    }

    // Listen for status updates if submitted
    useEffect(() => {
        if (submitted && visitorId) {
            console.log(`Connecting for visitor_${visitorId}`)
            const socket = connectUser(`visitor_${visitorId}`)

            socket.on('visitor_status_updated', (data: any) => {
                console.log('Status updated:', data)
                setVisitorStatus(data.status)
                if (data.status === 'APPROVED' || data.status === 'CHECKED_IN') {
                    // Play success sound
                    try { new Audio('/sounds/success.mp3').play() } catch { }
                }
            })

            return () => {
                socket.off('visitor_status_updated')
            }
        }
    }, [submitted, visitorId])

    const isApproved = visitorStatus === 'APPROVED' || visitorStatus === 'CHECKED_IN'
    const isRejected = visitorStatus === 'REJECTED'
    if (validating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center text-white"
                >
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-cyan-400" />
                    <p className="text-lg font-medium">Validating gate...</p>
                </motion.div>
            </div>
        )
    }

    // ─── Error ───
    if (gateError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/50 to-slate-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center border border-white/20"
                >
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Invalid Gate</h2>
                    <p className="text-gray-300">{gateError}</p>
                </motion.div>
            </div>
        )
    }

    // ─── Success ───
    if (submitted) {
        return (
            <div className={`min-h-screen bg-gradient-to-br flex items-center justify-center p-4 transition-colors duration-500 ${isApproved ? 'from-slate-900 via-emerald-900/50 to-slate-900' :
                isRejected ? 'from-slate-900 via-red-900/50 to-slate-900' :
                    'from-slate-900 via-blue-900/50 to-slate-900'
                }`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 max-w-md w-full text-center border border-white/20"
                >
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        key={visitorStatus}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    >
                        {isApproved ? (
                            <CheckCircle2 className="h-20 w-20 text-emerald-400 mx-auto mb-6" />
                        ) : isRejected ? (
                            <AlertCircle className="h-20 w-20 text-red-400 mx-auto mb-6" />
                        ) : (
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                <Clock className="h-20 w-20 text-cyan-400 mx-auto mb-6" />
                            </motion.div>
                        )}
                    </motion.div>

                    <h2 className="text-3xl font-bold text-white mb-3">
                        {isApproved ? '🎉 Entry Approved!' : isRejected ? '❌ Entry Rejected' : '✅ Entry Form Submitted!'}
                    </h2>

                    <p className="text-gray-300 text-lg leading-relaxed">
                        {isApproved ? (
                            <>Welcome! Your entry has been approved.<br />Please proceed to the gate.</>
                        ) : isRejected ? (
                            <>Sorry, your entry request was rejected.<br />Please contact the resident or security.</>
                        ) : (
                            <>Your details have been successfully saved in database.<br />Please wait for security guard to verify & approve your entry.</>
                        )}
                    </p>

                    <div className="mt-8 px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-sm text-gray-400">
                            Gate: <span className="text-white font-semibold">{gateInfo?.name}</span>
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            Society: <span className="text-white font-semibold">{gateInfo?.society?.name}</span>
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            Status: <Badge variant="outline" className={`ml-1 text-[10px] ${isApproved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50' :
                                isRejected ? 'bg-red-500/10 text-red-400 border-red-500/50' :
                                    'bg-cyan-500/10 text-cyan-400 border-cyan-500/50'
                                }`}>
                                {isApproved ? 'APPROVED' : isRejected ? 'REJECTED' : 'WAITING FOR GUARD APPROVAL'}
                            </Badge>
                        </p>
                    </div>

                    {isApproved && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 text-sm text-emerald-400 font-medium"
                        >
                            You can now enter the society Premise.
                        </motion.div>
                    )}
                </motion.div>
            </div>
        )
    }

    // ─── Main Form ───
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-xl">
                        <Shield className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">igate Visitor Entry</h1>
                        <p className="text-xs text-gray-400">
                            {gateInfo?.society?.name} — {gateInfo?.name}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-6 space-y-5">
                {/* Photo Capture Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20"
                >
                    <label className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Camera className="h-4 w-4 text-cyan-400" />
                        Your Photo
                    </label>

                    {!photoPreview && !cameraOpen && (
                        <button
                            type="button"
                            onClick={startCamera}
                            className="w-full mt-2 py-12 border-2 border-dashed border-white/20 rounded-xl text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-all flex flex-col items-center gap-2"
                        >
                            <Camera className="h-10 w-10" />
                            <span className="text-sm font-medium">Tap to open camera</span>
                        </button>
                    )}

                    {cameraOpen && (
                        <div className="mt-2 space-y-3">
                            <video
                                ref={videoRef}
                                autoPlay playsInline muted
                                className="w-full rounded-xl bg-black aspect-[4/3] object-cover"
                            />
                            <button
                                type="button"
                                onClick={capturePhoto}
                                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-colors"
                            >
                                📸 Capture Photo
                            </button>
                        </div>
                    )}

                    {photoPreview && (
                        <div className="mt-2 space-y-3">
                            <img
                                src={photoPreview}
                                alt="Captured"
                                className="w-full rounded-xl aspect-[4/3] object-cover"
                            />
                            <button
                                type="button"
                                onClick={retakePhoto}
                                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
                            >
                                Retake Photo
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Personal Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 space-y-4"
                >
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <User className="h-4 w-4 text-cyan-400" />
                        Personal Details
                    </h3>

                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">
                            Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">
                            Mobile Number <span className="text-red-400">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm font-medium bg-white/5 px-3 py-3 rounded-xl border border-white/10">+91</span>
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="10-digit mobile number"
                                inputMode="numeric"
                                maxLength={10}
                                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                                required
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Visit Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 space-y-4"
                >
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="h-4 w-4 text-cyan-400" />
                        Visit Details
                    </h3>

                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">
                            Purpose of Visit <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
                            required
                        >
                            <option value="" className="bg-slate-800">Select purpose...</option>
                            <option value="Delivery" className="bg-slate-800">Delivery</option>
                            <option value="Guest Visit" className="bg-slate-800">Guest Visit</option>
                            <option value="Maintenance" className="bg-slate-800">Maintenance / Repair</option>
                            <option value="Domestic Help" className="bg-slate-800">Domestic Help</option>
                            <option value="Cab / Taxi" className="bg-slate-800">Cab / Taxi</option>
                            <option value="Official Meeting" className="bg-slate-800">Official Meeting</option>
                            <option value="Other" className="bg-slate-800">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">
                            Whom to Meet
                        </label>
                        <input
                            value={whomToMeet}
                            onChange={(e) => setWhomToMeet(e.target.value)}
                            placeholder="Resident name or flat number"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        />
                    </div>

                    {units.length > 0 && (
                        <div>
                            <label className="text-xs font-medium text-gray-400 mb-1 block">
                                <Building2 className="h-3 w-3 inline mr-1" />
                                Select Flat / Unit
                            </label>
                            <select
                                value={visitingUnitId}
                                onChange={(e) => setVisitingUnitId(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
                                required
                            >
                                <option value="" className="bg-slate-800">Choose the flat you are visiting (Required)...</option>

                                {units.map((u: any) => (
                                    <option key={u.id} value={u.id} className="bg-slate-800">
                                        {u.block}-{u.number} {u.tenant?.name ? `(${u.tenant.name})` : u.owner?.name ? `(${u.owner.name})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </motion.div>

                {/* Optional Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 space-y-4"
                >
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Car className="h-4 w-4 text-cyan-400" />
                        Additional Info (Optional)
                    </h3>

                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">
                            Vehicle Number
                        </label>
                        <input
                            value={vehicleNo}
                            onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                            placeholder="e.g. MH 01 AB 1234"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 uppercase"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            Coming From
                        </label>
                        <input
                            value={fromLocation}
                            onChange={(e) => setFromLocation(e.target.value)}
                            placeholder="City or area"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        />
                    </div>
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                    {submitError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
                        >
                            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                            <p className="text-red-300 text-sm">{submitError}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white font-bold text-lg rounded-2xl shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Shield className="h-5 w-5" />
                            Submit Entry Request
                        </>
                    )}
                </motion.button>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 pb-8">
                    Powered by <span className="text-cyan-400 font-semibold">igate</span> — Secure Visitor Management
                </p>
            </form>

            {/* Hidden canvas for photo capture */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    )
}
