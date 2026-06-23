import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2, LogOut, CalendarClock, CheckCircle2, Clock3, Phone, Mail,
  StickyNote, ArrowLeft, LayoutGrid,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { IMAGES } from "@/data/content";

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];
const STATUS_STYLES = {
  pending: "bg-[#D4AF37]/15 text-[#9a7d12] border-[#D4AF37]/30",
  confirmed: "bg-[#1C3F35]/10 text-[#1C3F35] border-[#1C3F35]/20",
  completed: "bg-[#8EAC9A]/20 text-[#3a5c4a] border-[#8EAC9A]/40",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

function emptyStateLabel(filter) {
  return filter !== "all" ? `with status "${filter}"` : "yet";
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) setError(res.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1C3F35] px-6">
      <div className="w-full max-w-md bg-[#FAF7F2] rounded-3xl shadow-2xl p-9">
        <button
          onClick={() => navigate("/")}
          data-testid="admin-back-home"
          className="inline-flex items-center gap-1.5 text-sm text-[#4A554D] hover:text-[#1C3F35] mb-6"
        >
          <ArrowLeft size={16} /> Back to site
        </button>
        <div className="flex items-center gap-3 mb-7">
          <img src={IMAGES.logo} alt="Green Tara Wellness" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="font-serif-display text-2xl text-[#1C3F35] leading-none">Admin Login</h1>
            <p className="text-xs tracking-[0.2em] uppercase text-[#D4AF37]">Green Tara Wellness</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wide text-[#4A554D] mb-2">Email</label>
            <input
              data-testid="admin-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b border-[#1C3F35]/20 bg-transparent py-2.5 text-[#1C3F35] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-[#4A554D] mb-2">Password</label>
            <input
              data-testid="admin-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b border-[#1C3F35]/20 bg-transparent py-2.5 text-[#1C3F35] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          {error && <p data-testid="admin-login-error" className="text-sm text-red-600">{error}</p>}
          <button
            data-testid="admin-login-btn"
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#1C3F35] text-[#FAF7F2] py-3.5 rounded-full font-medium hover:bg-[#D4AF37] hover:text-[#1C3F35] transition-all disabled:opacity-60"
          >
            {loading ? <><Loader2 size={17} className="animate-spin" /> Signing in...</> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard pieces
// ---------------------------------------------------------------------------
const StatCard = ({ icon: Icon, label, value, testid }) => (
  <div data-testid={testid} className="bg-white rounded-2xl border border-[#1C3F35]/8 shadow-sm p-5 flex items-center gap-4">
    <span className="w-12 h-12 rounded-full bg-[#1C3F35]/5 flex items-center justify-center flex-shrink-0">
      <Icon size={22} className="text-[#1C3F35]" />
    </span>
    <div>
      <p className="font-serif-display text-3xl text-[#1C3F35] leading-none">{value}</p>
      <p className="text-xs text-[#4A554D] mt-1">{label}</p>
    </div>
  </div>
);

const ContactLinks = ({ b }) => (
  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-[#4A554D]">
    <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1.5 hover:text-[#1C3F35]">
      <Phone size={14} /> {b.phone}
    </a>
    {b.email && (
      <a href={`mailto:${b.email}`} className="inline-flex items-center gap-1.5 hover:text-[#1C3F35]">
        <Mail size={14} /> {b.email}
      </a>
    )}
    {b.notes && (
      <span className="inline-flex items-center gap-1.5">
        <StickyNote size={14} /> {b.notes}
      </span>
    )}
  </div>
);

const StatusActions = ({ b, onChange }) => (
  <div className="flex flex-wrap gap-2 md:justify-end">
    {STATUS_OPTIONS.map((s) => (
      <button
        key={s}
        data-testid={`set-status-${s}-${b.reference}`}
        onClick={() => onChange(b.id, s)}
        disabled={b.status === s}
        className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-all ${
          b.status === s
            ? "opacity-40 cursor-default border-[#1C3F35]/10"
            : "border-[#1C3F35]/20 text-[#1C3F35] hover:bg-[#1C3F35] hover:text-[#FAF7F2]"
        }`}
      >
        {s}
      </button>
    ))}
  </div>
);

const BookingRow = ({ b, onChange }) => (
  <div
    data-testid={`booking-row-${b.reference}`}
    className="bg-white rounded-2xl border border-[#1C3F35]/8 shadow-sm p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between"
  >
    <div className="flex-1">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-serif-display text-xl text-[#1C3F35]">{b.name}</span>
        <span className={`text-[11px] px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[b.status]}`}>
          {b.status}
        </span>
        <span className="text-xs text-[#4A554D] font-mono">{b.reference}</span>
      </div>
      <p className="text-sm text-[#1C3F35] mt-1.5 font-medium">{b.service} · {b.duration} min</p>
      <p className="text-sm text-[#4A554D]">{b.date} at {b.time}</p>
      <ContactLinks b={b} />
    </div>
    <StatusActions b={b} onChange={onChange} />
  </div>
);

const BookingsList = ({ loading, bookings, filter, onChange }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-[#1C3F35]" />
      </div>
    );
  }
  if (bookings.length === 0) {
    return (
      <div data-testid="admin-empty" className="text-center py-20 text-[#4A554D]">
        No bookings {emptyStateLabel(filter)}.
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {bookings.map((b) => (
        <BookingRow key={b.id} b={b} onChange={onChange} />
      ))}
    </div>
  );
};

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    try {
      const [b, s] = await Promise.all([api.get("/bookings"), api.get("/bookings/stats")]);
      setBookings(b.data);
      setStats(s.data);
    } catch {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      toast.success(`Marked as ${status}`);
      load();
    } catch {
      toast.error("Could not update status.");
    }
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const doLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-[#1C3F35] text-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={IMAGES.logo} alt="logo" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="font-serif-display text-xl leading-none">Bookings Dashboard</h1>
              <p className="text-xs text-[#FAF7F2]/60">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" data-testid="admin-view-site" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#FAF7F2]/80 hover:text-[#D4AF37]">
              <LayoutGrid size={16} /> View Site
            </a>
            <button
              data-testid="admin-logout-btn"
              onClick={doLogout}
              className="inline-flex items-center gap-1.5 border border-[#FAF7F2]/25 px-4 py-2 rounded-full text-sm hover:bg-[#FAF7F2] hover:text-[#1C3F35] transition-all"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-9">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={CalendarClock} label="Total" value={stats.total} testid="stat-total" />
          <StatCard icon={Clock3} label="Pending" value={stats.pending} testid="stat-pending" />
          <StatCard icon={CheckCircle2} label="Confirmed" value={stats.confirmed} testid="stat-confirmed" />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["all", ...STATUS_OPTIONS].map((f) => (
            <button
              key={f}
              data-testid={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm capitalize transition-all border ${
                filter === f
                  ? "bg-[#1C3F35] text-[#FAF7F2] border-[#1C3F35]"
                  : "bg-white text-[#4A554D] border-[#1C3F35]/10 hover:border-[#1C3F35]/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <BookingsList loading={loading} bookings={filtered} filter={filter} onChange={changeStatus} />
      </div>
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();

  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <Loader2 size={32} className="animate-spin text-[#1C3F35]" />
      </div>
    );
  }
  return user ? <Dashboard /> : <LoginForm />;
}
