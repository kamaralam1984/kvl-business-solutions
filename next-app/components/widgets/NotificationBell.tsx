'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Trash2, Package, Ticket, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

type Notification = {
  _id: string;
  type: string;
  title: string;
  message?: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

const typeIcons: Record<string, any> = {
  order: Package,
  ticket: Ticket,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const typeColor: Record<string, string> = {
  order: 'text-blue-500 bg-blue-500/10',
  ticket: 'text-orange-500 bg-orange-500/10',
  success: 'text-green-500 bg-green-500/10',
  warning: 'text-yellow-500 bg-yellow-500/10',
  error: 'text-red-500 bg-red-500/10',
  info: 'text-primary bg-primary/10',
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const r = await fetch('/api/notifications');
      const d = await r.json();
      if (d.ok) { setNotifs(d.notifications); setUnread(d.unreadCount); }
    } catch {}
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000); // poll every minute
    return () => clearInterval(t);
  }, []);

  const markAllRead = async () => {
    setLoading(true);
    await fetch('/api/notifications', { method: 'POST' });
    await load();
    setLoading(false);
  };

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    setNotifs(notifs.map(n => n._id === id ? { ...n, read: true } : n));
    setUnread(Math.max(0, unread - 1));
  };

  const remove = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    setNotifs(notifs.filter(n => n._id !== id));
  };

  const timeAgo = (date: string) => {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 text-text2 hover:text-text transition-colors" aria-label="Notifications">
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full grid place-items-center">{unread > 99 ? '99+' : unread}</span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] card-base shadow-card-hover z-50 max-h-[70vh] flex flex-col">
            <div className="p-3 border-b border-tint flex justify-between items-center">
              <div className="font-bold text-sm">Notifications {unread > 0 && <span className="text-xs text-text2 font-normal">({unread} unread)</span>}</div>
              {unread > 0 && (
                <button onClick={markAllRead} disabled={loading} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>
            <div className="overflow-y-auto flex-1">
              {notifs.length === 0 ? (
                <div className="p-8 text-center text-text2 text-sm">
                  <Bell className="w-10 h-10 mx-auto opacity-30 mb-2" />
                  No notifications yet
                </div>
              ) : notifs.map(n => {
                const Icon = typeIcons[n.type] || Info;
                const inner = (
                  <div className="flex gap-3 p-3 border-b border-tint last:border-b-0 hover:bg-primary/5 group">
                    <div className={`w-8 h-8 rounded-full grid place-items-center shrink-0 ${typeColor[n.type] || typeColor.info}`}><Icon className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold flex items-center gap-2">
                        {n.title}
                        {!n.read && <span className="w-1.5 h-1.5 bg-primary rounded-full" />}
                      </div>
                      {n.message && <div className="text-xs text-text2 mt-0.5 line-clamp-2">{n.message}</div>}
                      <div className="text-[10px] text-text2 mt-1">{timeAgo(n.createdAt)}</div>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(n._id); }} aria-label="Remove notification" className="opacity-0 group-hover:opacity-100 text-text2 hover:text-red-500 transition-opacity shrink-0 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
                return n.link ? (
                  <Link key={n._id} href={n.link} onClick={() => { markRead(n._id); setOpen(false); }}>{inner}</Link>
                ) : (
                  <div
                    key={n._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => markRead(n._id)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); markRead(n._id); } }}
                    className="cursor-pointer"
                  >{inner}</div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
