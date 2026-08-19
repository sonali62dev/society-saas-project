"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  Phone,
  CheckCircle2,
  AlertCircle,
  Send,
  Plus,
  Loader2,
  FileText,
  CreditCard,
  Banknote,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { residentService } from "@/services/resident.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGuard } from "@/components/auth/role-guard";
import { iconMap } from "@/lib/constants/icons";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  booked: "bg-indigo-100 text-indigo-700 border border-indigo-200",
};

const colorClasses: Record<
  string,
  { bg: string; text: string; light: string }
> = {
  blue: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
  green: { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50" },
  cyan: { bg: "bg-cyan-500", text: "text-cyan-600", light: "bg-cyan-50" },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-600",
    light: "bg-orange-50",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-600",
    light: "bg-purple-50",
  },
  teal: { bg: "bg-teal-500", text: "text-teal-600", light: "bg-teal-50" },
  pink: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50" },
  red: { bg: "bg-red-500", text: "text-red-600", light: "bg-red-50" },
  indigo: {
    bg: "bg-indigo-500",
    text: "text-indigo-600",
    light: "bg-indigo-50",
  },
};

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [selectedVariants, setSelectedVariants] = useState<any[]>([]);

  // Form states
  const [unit, setUnit] = useState(user?.unit || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [notes, setNotes] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [pincode, setPincode] = useState((user as any)?.pinCode || "");
  const isIndividual = (user?.role || "").toLowerCase() === "individual";
  const PIN_LEN = 6;
  const pincodeValid = !isIndividual || (pincode.trim().length >= 5 && pincode.trim().length <= 10);

  const {
    data: servicesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: residentService.getServices,
  });

  const createInquiryMutation = useMutation({
    mutationFn: residentService.createServiceInquiry,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });

      // If it was a booking (not callback), trigger payment immediately
      if (data && data.type === 'BOOKING' && paymentMethod) {
        // Calculate total from variants locally if backend returns 0/null (just in case)
        const localTotal = selectedVariants.reduce((sum: number, v: any) => sum + (v.price || 0), 0);
        const finalAmount = (data.payableAmount && Number(data.payableAmount) > 0)
          ? data.payableAmount
          : localTotal;

        initiatePaymentMutation.mutate({
          id: data.id,
          data: {
            paymentMethod: paymentMethod,
            amount: finalAmount
          }
        });
      } else {
        // For callbacks, just close and toast
        setIsCallbackOpen(false);
        setIsBookingOpen(false);
        setNotes("");
        toast.success("Callback request submitted successfully!");
      }
    },
    onError: (err: any) =>
      toast.error(err.message || "Failed to submit request"),
  });

  const initiatePaymentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { paymentMethod: string; amount?: number } }) =>
      residentService.initiatePayment(id, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      // Final Success Flow
      setIsPaymentOpen(false);
      setIsBookingOpen(false); // Close the booking dialog which is still open
      setSelectedRequest(null);

      // Reset Form
      setPaymentMethod("");
      setPaymentAmount("");
      setNotes("");
      setPreferredDate("");
      setPreferredTime("");
      setSelectedVariants([]);

      toast.success("Booking confirmed & Payment successful!");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.error || err.message || "Payment failed"),
  });

  const handleBookService = () => {
    if (!selectedCategory || !user) return;
    if (isIndividual && !pincodeValid) {
      toast.error("PIN Code is required (5–10 digits) for vendor assignment.");
      return;
    }
    createInquiryMutation.mutate({
      serviceId: selectedCategory.id,
      serviceName: selectedCategory.name,
      type: "BOOKING",
      preferredDate,
      preferredTime,
      phone: phone || user?.phone || "",
      notes,
      ...(isIndividual && { pincode: pincode.trim() }),
      variants: selectedVariants,
      total: selectedVariants.reduce((sum: number, v: any) => sum + (v.price || 0), 0),
    });
  };

  const handleRequestCallback = () => {
    if (!selectedCategory || !user) return;
    if (isIndividual && !pincodeValid) {
      toast.error("PIN Code is required (5–10 digits) for vendor assignment.");
      return;
    }
    createInquiryMutation.mutate({
      serviceId: selectedCategory.id,
      serviceName: selectedCategory.name,
      type: "CALLBACK",
      notes,
      preferredTime,
      phone,
      ...(isIndividual && { pincode: pincode.trim() }),
    });
  };

  const serviceCategories = servicesData?.categories || [];
  const inquiries = servicesData?.myRequests || [];
  const vendors = servicesData?.vendors || [];

  const matchingVendor = useMemo(() => {
    if (!selectedCategory) return null;
    const catName = (selectedCategory.name || '').toLowerCase();
    
    return vendors.find((v: any) => {
      const st = (v.serviceType || v.type || '').toLowerCase();
      if (catName.includes('electric') && st.includes('electric')) return true;
      if (catName.includes('plumb') && st.includes('plumb')) return true;
      if ((catName.includes('clean') || catName.includes('housekeeping')) && (st.includes('clean') || st.includes('housekeeping'))) return true;
      if (catName.includes('security') && st.includes('security')) return true;
      if (catName.includes('pest') && st.includes('pest')) return true;
      if (catName.includes('carpent') && st.includes('carpent')) return true;
      if (catName.includes('paint') && st.includes('paint')) return true;
      if (catName.includes('garden') && st.includes('garden')) return true;
      return st === catName || catName.includes(st);
    }) || vendors[0] || null;
  }, [selectedCategory, vendors]);

  if (isLoading)
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="w-1/4 h-10 rounded-lg" />
        <Skeleton className="w-full h-[400px] rounded-3xl" />
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-gray-900">
          Failed to load services
        </h3>
        <p className="text-gray-600">
          Please try again later or contact support.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["services"] })
          }
        >
          Try Again
        </Button>
      </div>
    );

  return (
    <RoleGuard
      allowedRoles={[
        "resident",
        "committee",
        "admin",
        "super_admin",
        "society_admin",
        "individual",
      ]}
    >
      <div className="space-y-6 container mx-auto p-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Services & Bookings
            </h1>
            <p className="text-gray-600 mt-1">
              Book trusted service providers for your home
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100 p-1 rounded-xl h-auto">
            <TabsTrigger
              value="browse"
              className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Building2 className="h-4 w-4" />
              Browse Services
            </TabsTrigger>
            <TabsTrigger
              value="my-requests"
              className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Calendar className="h-4 w-4" />
              My Orders & Tracking
            </TabsTrigger>
          </TabsList>


          <TabsContent value="browse" className="mt-6">
            {!selectedCategory ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {serviceCategories.map((category: any) => {
                  const Icon = iconMap[category.icon] || Building2;
                  const colors =
                    colorClasses[category.color] || colorClasses.blue;
                  return (
                    <Card
                      key={category.id}
                      className="group border-0 shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden relative"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between">
                          <div
                            className={`p-4 rounded-2xl ${colors.light} transition-transform group-hover:scale-110 duration-300`}
                          >
                            <Icon className={`h-8 w-8 ${colors.text}`} />
                          </div>
                          <ArrowRight className="h-6 w-6 text-gray-300 transition-all group-hover:text-indigo-500 group-hover:translate-x-1" />
                        </div>
                        <div className="mt-6">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 mt-2 line-clamp-2">
                            {category.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-0 shadow-lg mb-8 overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b bg-gray-50/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div
                          className={`p-6 rounded-2xl ${colorClasses[selectedCategory.color]?.light || "bg-gray-100 shadow-inner"}`}
                        >
                          {(() => {
                            const SelectedIcon =
                              iconMap[selectedCategory.icon] || Building2;
                            return (
                              <SelectedIcon
                                className={`h-12 w-12 ${colorClasses[selectedCategory.color]?.text || "text-gray-600"}`}
                              />
                            );
                          })()}
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-bold text-gray-900">
                            {selectedCategory.name}
                          </CardTitle>
                          <CardDescription className="text-lg mt-1 text-gray-600">
                            {selectedCategory.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          size="lg"
                          className="bg-white hover:bg-gray-50 text-gray-700"
                          onClick={() => setIsCallbackOpen(true)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Callback
                        </Button>
                        <Button
                          size="lg"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 px-8"
                          onClick={() => setIsBookingOpen(true)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Now
                        </Button>
                      </div>
                    </div>

                    {/* Assigned Vendor Banner */}
                    {matchingVendor ? (
                      <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-md">
                            <Building2 className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Assigned Society Vendor</span>
                              {matchingVendor.rating > 0 && <span className="text-xs font-semibold text-amber-600">⭐ {matchingVendor.rating}</span>}
                            </div>
                            <p className="font-bold text-slate-900 text-base mt-0.5">{matchingVendor.name} {matchingVendor.company ? `(${matchingVendor.company})` : ''}</p>
                            <p className="text-xs text-slate-600 flex flex-wrap items-center gap-3 mt-0.5">
                              <span>Vendor Direct Phone: <strong className="text-slate-900">{matchingVendor.contact || matchingVendor.phone}</strong></span>
                              {matchingVendor.contactPerson && <span>• Contact Person: <strong>{matchingVendor.contactPerson}</strong></span>}
                            </p>
                          </div>
                        </div>
                        <a href={`tel:${matchingVendor.contact || matchingVendor.phone}`} className="flex-shrink-0">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold rounded-xl shadow-md px-5">
                            <Phone className="h-4 w-4" />
                            Call Vendor ({matchingVendor.contact || matchingVendor.phone})
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 flex items-center justify-between">
                        <span>No specific vendor assigned yet for this category. Society admin / support will assign an active provider upon booking.</span>
                      </div>
                    )}
                  </CardHeader>
                  {selectedCategory.variants?.length > 0 && (
                    <CardContent className="p-8">
                      <h4 className="font-bold text-gray-900 mb-6 text-lg uppercase tracking-wider text-muted-foreground">
                        Available Variants
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedCategory.variants.map((variant: any) => (
                          <div
                            key={variant.id}
                            className="p-6 rounded-2xl border-2 border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all flex justify-between items-center group"
                          >
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {variant.name}
                              </p>
                              <p className="text-indigo-600 font-bold mt-1 text-lg">
                                ₹{variant.price}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-full bg-white shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Plus className="h-4 w-4 text-indigo-600" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="my-requests" className="mt-6">
            <div className="space-y-4">
              {inquiries.length === 0 ? (
                <Card className="border-0 shadow-md bg-white">
                  <CardContent className="p-16 text-center">
                    <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      No service requests yet
                    </h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                      Browse our trusted services and book your first home
                      maintenance appointment.
                    </p>
                    <Button
                      className="mt-8 bg-indigo-600 hover:bg-indigo-700 px-8 py-6 h-auto text-lg rounded-xl shadow-lg shadow-indigo-100"
                      onClick={() => setActiveTab("browse")}
                    >
                      Browse Services
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                inquiries
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((request: any) => (
                    <Card
                      key={request.id}
                      className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden group"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div
                              className={`p-4 rounded-xl ${request.type === "BOOKING" ? "bg-indigo-50" : "bg-teal-50"}`}
                            >
                              {request.type === "BOOKING" ? (
                                <Calendar
                                  className={`h-6 w-6 ${request.type === "BOOKING" ? "text-indigo-600" : "text-teal-600"}`}
                                />
                              ) : (
                                <Phone className="h-6 w-6 text-teal-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="font-bold text-xl text-gray-900">
                                  {request.serviceName}
                                </h3>
                                <Badge
                                  className={`${statusColors[request.status?.toLowerCase()] || "bg-gray-100"} px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider`}
                                >
                                  {request.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-6 mt-2">
                                <p className="text-gray-600 flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-gray-400" />
                                  {request.vendorName ||
                                    "Vendor Assignment Pending"}
                                </p>
                                <span className="text-gray-300">|</span>
                                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                  <span className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {request.preferredDate
                                      ? new Date(
                                        request.preferredDate,
                                      ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                  {request.preferredTime && (
                                    <span className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      {request.preferredTime}
                                    </span>
                                  )}
                                  {request.status?.toUpperCase() === "CONFIRMED" && request.payableAmount != null && (
                                    <>
                                      <span className="text-gray-300">|</span>
                                      <span className="font-semibold text-green-700">
                                        ₹{Number(request.payableAmount).toLocaleString()} payable
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 items-center">
                            {(request.status?.toUpperCase() === "CONFIRMED" &&
                              (request.paymentStatus || "PENDING")?.toUpperCase() !== "PAID") && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white shrink-0 font-semibold"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setIsPaymentOpen(true);
                                    setPaymentAmount(request.payableAmount != null ? String(request.payableAmount) : "");
                                  }}
                                  title="Pay for this confirmed lead"
                                >
                                  <CreditCard className="h-4 w-4 mr-1.5" />
                                  Pay / Make Payment
                                </Button>
                              )}
                            {(request.status?.toUpperCase() === "CONFIRMED" &&
                              (request.paymentStatus || "PENDING")?.toUpperCase() === "PAID") && (
                                <Badge className="bg-green-100 text-green-700 border-green-200 shrink-0">
                                  Payment Completed
                                </Badge>
                              )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="shrink-0"
                              onClick={() => setSelectedRequest(request)}
                            >
                              View Details
                            </Button>
                            <ArrowRight className="h-5 w-5 text-gray-300 shrink-0" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

        </Tabs>

        {/* Booking Dialog */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="p-8 bg-indigo-600 text-white">
              <DialogTitle className="text-2xl font-bold">
                Book {selectedCategory?.name}
              </DialogTitle>
              <DialogDescription className="text-indigo-100">
                Schedule a professional service for your home. Payment is required to confirm booking.
              </DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6 bg-white max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-bold">
                    Preferred Date *
                  </Label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-bold">
                    Preferred Time *
                  </Label>
                  <Select
                    value={preferredTime}
                    onValueChange={setPreferredTime}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-gray-200">
                      <SelectValue placeholder="Select Slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { value: "9am", label: "9:00 AM - 12:00 PM", endHour: 12 },
                        { value: "12pm", label: "12:00 PM - 3:00 PM", endHour: 15 },
                        { value: "3pm", label: "3:00 PM - 6:00 PM", endHour: 18 },
                        { value: "6pm", label: "6:00 PM - 9:00 PM", endHour: 21 },
                      ].map((slot) => {
                        let isDisabled = false;
                        if (preferredDate) {
                          const selected = new Date(preferredDate);
                          const today = new Date();
                          // Reset time parts for accurate date comparison
                          selected.setHours(0, 0, 0, 0);
                          const current = new Date();
                          current.setHours(0, 0, 0, 0);

                          if (selected.getTime() === current.getTime()) {
                            // If today, check hour
                            const nowHour = new Date().getHours();
                            if (nowHour >= slot.endHour) {
                              isDisabled = true;
                            }
                          }
                        }
                        return (
                          <SelectItem key={slot.value} value={slot.value} disabled={isDisabled}>
                            {slot.label} {isDisabled && "(Passed)"}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {matchingVendor && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs space-y-1">
                  <p className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                    Assigned Service Provider / Vendor
                  </p>
                  <p className="text-indigo-800">
                    Vendor: <strong>{matchingVendor.name}</strong> {matchingVendor.company ? `(${matchingVendor.company})` : ''}
                  </p>
                  <p className="text-indigo-700">
                    Vendor Direct Phone: <a href={`tel:${matchingVendor.contact || matchingVendor.phone}`} className="font-bold text-indigo-900 underline">{matchingVendor.contact || matchingVendor.phone}</a>
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-700 font-bold">
                  Your Contact Phone Number (For Vendor Callback) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500">Enter your phone number so the assigned vendor can call you back.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-bold">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  placeholder="Tell us more about your requirement..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-xl border-gray-200 focus:ring-indigo-500"
                />
              </div>

              {isIndividual && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-bold">
                    PIN Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder={`${PIN_LEN}-digit PIN (required for vendor assignment)`}
                    maxLength={10}
                    inputMode="numeric"
                    className={!pincodeValid && pincode.trim() ? "border-red-500" : ""}
                  />
                  {!pincodeValid && pincode.trim() && (
                    <p className="text-xs text-red-500">PIN Code must be 5–10 digits.</p>
                  )}
                </div>
              )}

              {/* Variants Selection */}
              {selectedCategory?.variants?.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-gray-700 font-bold">Select Variants</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedCategory.variants.map((variant: any) => {
                      const isSelected = selectedVariants.some((v: any) => v.id === variant.id);
                      return (
                        <div
                          key={variant.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${isSelected
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-gray-100 hover:border-indigo-100"
                            }`}
                          onClick={() => {
                            setSelectedVariants((prev: any[]) =>
                              prev.some((v) => v.id === variant.id)
                                ? prev.filter((v) => v.id !== variant.id)
                                : [...prev, variant]
                            );
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-300 bg-white"}`}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`font-medium ${isSelected ? "text-indigo-900" : "text-gray-700"}`}>{variant.name}</span>
                          </div>
                          <span className="font-bold text-indigo-600">₹{variant.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="p-4 bg-indigo-50 rounded-xl flex flex-col gap-4 mt-4 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-900 font-bold">Total to Pay</span>
                  <span className="text-indigo-700 font-black text-xl">
                    ₹{selectedVariants.reduce((sum: number, v: any) => sum + (v.price || 0), 0)}
                  </span>
                </div>

                {/* Payment Method Selection */}
                <div className="pt-4 border-t border-indigo-200">
                  <Label className="text-indigo-900 font-bold mb-2 block">Select Payment Method</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Online', 'Cash'].map((method) => (
                      <div
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`
                                    cursor-pointer p-3 rounded-xl border-2 flex items-center justify-center font-bold transition-all
                                    ${paymentMethod === method
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50'}
                                `}
                      >
                        {method === 'Online' ? <CreditCard className="w-4 h-4 mr-2" /> : <Banknote className="w-4 h-4 mr-2" />}
                        {method}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 pt-0 bg-white">
              <Button
                variant="ghost"
                className="rounded-xl h-12 px-8"
                onClick={() => setIsBookingOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg h-12 px-10 rounded-xl font-bold"
                onClick={handleBookService}
                disabled={createInquiryMutation.isPending || initiatePaymentMutation.isPending || (isIndividual && !pincodeValid) || selectedVariants.length === 0 || !paymentMethod}
              >
                {createInquiryMutation.isPending || initiatePaymentMutation.isPending
                  ? "Processing Payment..."
                  : "Pay & Book"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        >
          <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="p-8 bg-indigo-600 text-white">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                {selectedRequest?.type === "BOOKING" ? (
                  <Calendar className="h-6 w-6" />
                ) : (
                  <Phone className="h-6 w-6" />
                )}
                {selectedRequest?.serviceName}
              </DialogTitle>
              <DialogDescription className="text-indigo-100">
                Request ID: #{selectedRequest?.id}
              </DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6 bg-white max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-500 font-medium">Status</span>
                <Badge
                  className={`${statusColors[selectedRequest?.status?.toLowerCase()] || "bg-gray-100"} px-3 py-1`}
                >
                  {selectedRequest?.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">
                      Vendor
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedRequest?.vendorName || "Pending Assignment"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">
                      Preferred Date
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedRequest?.preferredDate
                        ? new Date(
                          selectedRequest.preferredDate,
                        ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">
                      Preferred Time
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedRequest?.preferredTime || "N/A"}
                    </p>
                  </div>
                </div>

                {selectedRequest?.notes && (
                  <div className="flex items-start gap-4">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-bold uppercase">
                        Notes
                      </p>
                      <p className="text-gray-600 italic">
                        "{selectedRequest.notes}"
                      </p>
                    </div>
                  </div>
                )}

                {selectedRequest?.status?.toUpperCase() === "CONFIRMED" && (
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100 space-y-3">
                    <p className="text-sm font-bold text-green-800 uppercase tracking-wide">Payment</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status</span>
                      <Badge className={((selectedRequest as any).paymentStatus?.toUpperCase() === "PAID" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700") + " px-2 py-0.5"}>
                        {(selectedRequest as any).paymentStatus || "PENDING"}
                      </Badge>
                    </div>
                    {(selectedRequest as any).payableAmount != null && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Payable amount</span>
                        <span className="font-bold text-gray-900">₹{Number((selectedRequest as any).payableAmount).toLocaleString()}</span>
                      </div>
                    )}
                    {(selectedRequest as any).transactionId && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Transaction ID</span>
                        <span className="font-mono text-gray-700">{(selectedRequest as any).transactionId}</span>
                      </div>
                    )}
                    {(selectedRequest as any).paymentStatus?.toUpperCase() !== "PAID" && (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11 rounded-xl mt-2"
                        onClick={() => {
                          setIsPaymentOpen(true);
                          setPaymentAmount((selectedRequest as any).payableAmount != null ? String((selectedRequest as any).payableAmount) : "");
                        }}
                        title="Pay for this confirmed lead"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay / Make Payment
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="p-8 pt-0 bg-white">
              <Button
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold h-12 rounded-xl"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog – only for CONFIRMED leads; guard so non-confirmed never see payment UI */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="p-8 bg-green-600 text-white">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <CreditCard className="h-6 w-6" />
                Make Payment
              </DialogTitle>
              <DialogDescription className="text-green-100">
                {selectedRequest?.serviceName} – Lead #{selectedRequest?.id}
              </DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6 bg-white">
              {selectedRequest?.status?.toUpperCase() !== "CONFIRMED" ? (
                <p className="text-sm text-amber-700 bg-amber-50 p-4 rounded-xl">
                  Payment is only available after your lead is confirmed. Current status: {selectedRequest?.status || "—"}.
                </p>
              ) : (selectedRequest?.paymentStatus || "PENDING")?.toUpperCase() === "PAID" ? (
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">Payment Completed</p>
                  <p className="text-sm text-green-700 mt-1">This lead has already been paid.</p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 font-bold uppercase">Payable amount (₹)</p>
                    <Input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="mt-2 h-12 rounded-xl text-lg font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-bold">Select payment option</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="h-12 rounded-xl border-gray-200">
                        <SelectValue placeholder="Choose a payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPI">Online – UPI</SelectItem>
                        <SelectItem value="CARD">Online – Card</SelectItem>
                        <SelectItem value="NET_BANKING">Online – Net Banking</SelectItem>
                        <SelectItem value="WALLET">Wallet</SelectItem>
                        <SelectItem value="CASH">Cash / Pay Later (admin will confirm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-gray-500">
                    For Cash / Pay Later, admin will mark as paid after receipt.
                  </p>
                </>
              )}
            </div>
            <DialogFooter className="p-8 pt-0 bg-white">
              <Button variant="ghost" className="rounded-xl h-12 px-8" onClick={() => setIsPaymentOpen(false)}>
                Cancel
              </Button>
              {selectedRequest?.status?.toUpperCase() === "CONFIRMED" &&
                (selectedRequest?.paymentStatus || "PENDING")?.toUpperCase() !== "PAID" && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg h-12 px-10 rounded-xl font-bold"
                    disabled={!paymentMethod || !paymentAmount || parseFloat(paymentAmount) <= 0 || initiatePaymentMutation.isPending}
                    onClick={() => {
                      if (!selectedRequest?.id || !paymentMethod) return;
                      initiatePaymentMutation.mutate({
                        id: selectedRequest.id,
                        data: { paymentMethod, amount: parseFloat(paymentAmount) || undefined },
                      });
                    }}
                  >
                    {initiatePaymentMutation.isPending ? "Processing..." : "Confirm Payment"}
                  </Button>
                )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Callback Request Dialog */}
        <Dialog open={isCallbackOpen} onOpenChange={setIsCallbackOpen}>
          <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="p-8 bg-teal-600 text-white">
              <DialogTitle className="text-2xl font-bold">
                Request Callback
              </DialogTitle>
              <DialogDescription className="text-teal-100">
                A professional will call you shortly regarding{" "}
                {selectedCategory?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6 bg-white">
              {matchingVendor && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-1">
                  <p className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    Assigned Service Provider / Vendor
                  </p>
                  <p className="text-emerald-800">
                    Vendor: <strong>{matchingVendor.name}</strong> {matchingVendor.company ? `(${matchingVendor.company})` : ''}
                  </p>
                  <p className="text-emerald-700">
                    Vendor Direct Number: <a href={`tel:${matchingVendor.contact || matchingVendor.phone}`} className="font-bold text-emerald-900 underline">{matchingVendor.contact || matchingVendor.phone}</a>
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-700 font-bold">
                  Your Phone Number (For Vendor Callback) *
                </Label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number for callback"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 rounded-xl border-gray-200"
                />
                <p className="text-xs text-gray-500">The assigned vendor will call you back on this phone number.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-bold">
                  Preferred Slot
                </Label>
                <Select value={preferredTime} onValueChange={setPreferredTime}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anytime">Any time</SelectItem>
                    <SelectItem value="morning">
                      Morning (9 AM - 12 PM)
                    </SelectItem>
                    <SelectItem value="afternoon">
                      Afternoon (12 PM - 5 PM)
                    </SelectItem>
                    <SelectItem value="evening">
                      Evening (5 PM - 8 PM)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-bold">
                  Requirement Details
                </Label>
                <Textarea
                  placeholder="Describe your requirement briefly..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-xl border-gray-200"
                />
              </div>

              {isIndividual && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-bold">
                    PIN Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder={`${PIN_LEN}-digit PIN (required for vendor assignment)`}
                    maxLength={10}
                    inputMode="numeric"
                    className={!pincodeValid && pincode.trim() ? "border-red-500" : ""}
                  />
                  {!pincodeValid && pincode.trim() && (
                    <p className="text-xs text-red-500">PIN Code must be 5–10 digits.</p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className="p-8 pt-0 bg-white">
              <Button
                variant="ghost"
                className="rounded-xl h-12 px-8"
                onClick={() => setIsCallbackOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg h-12 px-10 rounded-xl font-bold"
                onClick={handleRequestCallback}
                disabled={createInquiryMutation.isPending || (isIndividual && !pincodeValid)}
              >
                {createInquiryMutation.isPending
                  ? "Requesting..."
                  : "Submit Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
