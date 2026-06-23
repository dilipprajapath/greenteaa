import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, CalendarDays, Clock, Loader2, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { api, formatApiErrorDetail } from "@/lib/api";
import { SERVICES, DURATIONS, TIME_SLOTS } from "@/data/content";

const STEPS = ["Service", "Duration", "Date & Time", "Details"];

const fmtDate = (d) =>
  d ? d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";

function stepCircleClass(index, step) {
  if (index < step) return "bg-[#1C3F35] text-[#FAF7F2]";
  if (index === step) return "bg-[#D4AF37] text-[#1C3F35]";
  return "bg-[#1C3F35]/8 text-[#1C3F35]/40";
}

const selectableClass = (selected) =>
  selected
    ? "border-[#D4AF37] bg-[#D4AF37]/10 ring-1 ring-[#D4AF37]"
    : "border-[#1C3F35]/10 hover:border-[#1C3F35]/30";

// ---------------------------------------------------------------------------
// Step panels
// ---------------------------------------------------------------------------
const ServiceStep = ({ value, onSelect }) => (
  <div className="grid sm:grid-cols-2 gap-3">
    {SERVICES.map((s) => (
      <button
        key={s.id}
        data-testid={`booking-service-${s.id}`}
        onClick={() => onSelect(s.name)}
        className={`flex items-center gap-3 text-left p-4 rounded-xl border transition-all ${selectableClass(
          value === s.name
        )}`}
      >
        <img src={s.image} alt={s.name} className="w-12 h-12 rounded-lg object-cover" />
        <span className="text-sm font-medium text-[#1C3F35]">{s.name}</span>
      </button>
    ))}
  </div>
);

const DurationStep = ({ value, onSelect }) => (
  <div>
    <p className="text-[#4A554D] mb-5">Choose your preferred session length:</p>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {DURATIONS.map((d) => (
        <button
          key={d}
          data-testid={`booking-duration-${d}`}
          onClick={() => onSelect(d)}
          className={`py-6 rounded-2xl border text-center transition-all ${selectableClass(value === d)}`}
        >
          <span className="block font-serif-display text-3xl text-[#1C3F35]">{d}</span>
          <span className="text-xs text-[#4A554D]">minutes</span>
        </button>
      ))}
    </div>
  </div>
);

const DateTimeStep = ({ date, time, onDate, onTime }) => (
  <div className="grid md:grid-cols-2 gap-7">
    <div>
      <p className="flex items-center gap-2 text-sm font-medium text-[#1C3F35] mb-3">
        <CalendarDays size={16} /> Select a date
      </p>
      <div className="rounded-2xl border border-[#1C3F35]/10 p-2 flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDate}
          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
          data-testid="booking-calendar"
        />
      </div>
    </div>
    <div>
      <p className="flex items-center gap-2 text-sm font-medium text-[#1C3F35] mb-3">
        <Clock size={16} /> Select a time
      </p>
      <div className="grid grid-cols-2 gap-2.5 max-h-[330px] overflow-y-auto pr-1">
        {TIME_SLOTS.map((t) => (
          <button
            key={t}
            data-testid={`booking-time-${t.replace(/[^0-9A-Za-z]+/g, "-")}`}
            onClick={() => onTime(t)}
            className={`py-3 rounded-xl border text-sm transition-all ${
              time === t
                ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#1C3F35] ring-1 ring-[#D4AF37]"
                : "border-[#1C3F35]/10 text-[#4A554D] hover:border-[#1C3F35]/30"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const DetailsStep = ({ form, set }) => (
  <div className="space-y-5">
    <div className="bg-[#FAF7F2] rounded-2xl p-5 text-sm text-[#4A554D] space-y-1 border border-[#1C3F35]/5">
      <p>
        <span className="text-[#1C3F35] font-medium">{form.service}</span> · {form.duration} min
      </p>
      <p>
        {fmtDate(form.date)} at {form.time}
      </p>
    </div>
    <Field label="Full Name *" testid="booking-name" value={form.name} onChange={(v) => set({ name: v })} placeholder="Your name" />
    <Field label="Phone Number *" testid="booking-phone" type="tel" value={form.phone} onChange={(v) => set({ phone: v })} placeholder="+91 ..." />
    <Field label="Email (optional)" testid="booking-email" type="email" value={form.email} onChange={(v) => set({ email: v })} placeholder="you@email.com" />
    <div>
      <label className="block text-xs uppercase tracking-wide text-[#4A554D] mb-2">Notes (optional)</label>
      <textarea
        data-testid="booking-notes"
        value={form.notes}
        onChange={(e) => set({ notes: e.target.value })}
        rows={2}
        placeholder="Any preferences or requests..."
        className="w-full border border-[#1C3F35]/15 rounded-xl bg-transparent p-3 text-[#1C3F35] placeholder:text-[#1C3F35]/35 focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
      />
    </div>
  </div>
);

const Confirmation = ({ data, onReset }) => (
  <div data-testid="booking-confirmation" className="p-9 md:p-12 text-center">
    <div className="w-20 h-20 mx-auto rounded-full bg-[#1C3F35] flex items-center justify-center">
      <PartyPopper size={34} className="text-[#D4AF37]" />
    </div>
    <h3 className="font-serif-display text-3xl text-[#1C3F35] mt-6">Thank you, {data.name.split(" ")[0]}!</h3>
    <p className="text-[#4A554D] mt-3 max-w-md mx-auto">
      Your appointment request has been received. Our team will reach out shortly via call or WhatsApp to confirm the details.
    </p>
    <div className="mt-7 bg-[#FAF7F2] rounded-2xl p-6 text-left max-w-md mx-auto space-y-2 border border-[#1C3F35]/5">
      <Row label="Reference" value={data.reference} testid="confirm-reference" highlight />
      <Row label="Service" value={data.service} />
      <Row label="Duration" value={`${data.duration} minutes`} />
      <Row label="Date" value={data.date} />
      <Row label="Time" value={data.time} />
    </div>
    <button
      data-testid="booking-new-btn"
      onClick={onReset}
      className="mt-8 inline-flex items-center justify-center border border-[#1C3F35]/30 text-[#1C3F35] px-8 py-3 rounded-full hover:bg-[#1C3F35] hover:text-[#FAF7F2] transition-all duration-300"
    >
      Book Another Appointment
    </button>
  </div>
);

const StepIndicator = ({ step }) => (
  <div className="flex items-center justify-between px-6 md:px-9 pt-7">
    {STEPS.map((s, i) => (
      <div key={s} className="flex items-center flex-1 last:flex-none">
        <div className="flex flex-col items-center">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${stepCircleClass(i, step)}`}>
            {i < step ? <Check size={16} /> : i + 1}
          </div>
          <span className="hidden sm:block text-[11px] mt-2 text-[#4A554D]">{s}</span>
        </div>
        {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-[#1C3F35]" : "bg-[#1C3F35]/10"}`} />}
      </div>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const EMPTY_FORM = {
  service: "", duration: 60, date: undefined, time: "",
  name: "", phone: "", email: "", notes: "",
};

export const Booking = () => {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const canNext = () => {
    if (step === 0) return !!form.service;
    if (step === 1) return !!form.duration;
    if (step === 2) return !!form.date && !!form.time;
    return true;
  };

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    setSubmitting(true);
    try {
      const isoDate = form.date.toISOString().slice(0, 10);
      const { data } = await api.post("/bookings", {
        service: form.service,
        duration: form.duration,
        date: isoDate,
        time: form.time,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        notes: form.notes.trim(),
      });
      setConfirmation(data);
      toast.success("Appointment request received!");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setConfirmation(null);
    setStep(0);
    setForm(EMPTY_FORM);
  };

  return (
    <section id="booking" className="py-20 md:py-32 bg-[#8EAC9A]/10">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[#D4AF37] text-xs md:text-sm tracking-[0.25em] uppercase font-semibold mb-4">
            Reserve Your Escape
          </p>
          <h2 className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-light text-[#1C3F35] leading-tight">
            Book Your Appointment
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-[#1C3F35]/5 overflow-hidden">
          {confirmation ? (
            <Confirmation data={confirmation} onReset={reset} />
          ) : (
            <>
              <StepIndicator step={step} />

              <div className="px-6 md:px-9 py-8 min-h-[340px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step === 0 && <ServiceStep value={form.service} onSelect={(v) => set({ service: v })} />}
                    {step === 1 && <DurationStep value={form.duration} onSelect={(v) => set({ duration: v })} />}
                    {step === 2 && (
                      <DateTimeStep
                        date={form.date}
                        time={form.time}
                        onDate={(d) => set({ date: d })}
                        onTime={(t) => set({ time: t })}
                      />
                    )}
                    {step === 3 && <DetailsStep form={form} set={set} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between px-6 md:px-9 py-5 border-t border-[#1C3F35]/8">
                <button
                  data-testid="booking-back-btn"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 text-[#4A554D] disabled:opacity-30 hover:text-[#1C3F35] transition-colors"
                >
                  <ChevronLeft size={18} /> Back
                </button>

                {step < STEPS.length - 1 ? (
                  <button
                    data-testid="booking-next-btn"
                    onClick={() => canNext() && setStep((s) => s + 1)}
                    disabled={!canNext()}
                    className="inline-flex items-center gap-1.5 bg-[#1C3F35] text-[#FAF7F2] px-7 py-3 rounded-full font-medium disabled:opacity-40 hover:bg-[#D4AF37] hover:text-[#1C3F35] transition-all duration-300"
                  >
                    Continue <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    data-testid="booking-submit-btn"
                    onClick={submit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#1C3F35] px-8 py-3 rounded-full font-semibold disabled:opacity-60 hover:bg-[#1C3F35] hover:text-[#FAF7F2] transition-all duration-300"
                  >
                    {submitting ? <><Loader2 size={17} className="animate-spin" /> Submitting...</> : "Confirm Booking"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, value, onChange, placeholder, type = "text", testid }) => (
  <div>
    <label className="block text-xs uppercase tracking-wide text-[#4A554D] mb-2">{label}</label>
    <input
      data-testid={testid}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border-b border-[#1C3F35]/20 bg-transparent py-2.5 text-[#1C3F35] placeholder:text-[#1C3F35]/35 focus:border-[#D4AF37] focus:outline-none transition-colors"
    />
  </div>
);

const Row = ({ label, value, highlight, testid }) => (
  <div className="flex justify-between gap-4">
    <span className="text-sm text-[#4A554D]">{label}</span>
    <span
      data-testid={testid}
      className={`text-sm text-right ${highlight ? "font-semibold text-[#1C3F35] tracking-wide" : "text-[#1C3F35]"}`}
    >
      {value}
    </span>
  </div>
);
