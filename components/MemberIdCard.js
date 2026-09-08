"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Dumbbell,
  IdCard,
  MessageCircle,
  Phone,
  Printer,
  Calendar,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getInitials, formatISODateTimeLabel } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/receipt";
import { brand, location } from "@/data/site-data";

/**
 * Formats a date for the ID card display.
 */
function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Builds a WhatsApp-friendly text version of the ID card.
 */
function buildIdCardText(member) {
  const divider = "━━━━━━━━━━━━━━━━━━━━━━━━";
  return [
    divider,
    `🏋️ *${brand.name.toUpperCase()}*`,
    `📍 _${location.city}_`,
    divider,
    "",
    "🪪 *MEMBER ID CARD*",
    "",
    `👤 *Name:* ${member.name}`,
    `🆔 *Member ID:* #${member.memberId}`,
    `📱 *Mobile:* ${member.mobile}`,
    member.email ? `📧 *Email:* ${member.email}` : null,
    member.age ? `🎂 *Age:* ${member.age}` : null,
    member.gender ? `⚧ *Gender:* ${member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}` : null,
    "",
    `💳 *Plan:* ${member.planName}`,
    `📅 *Member Since:* ${fmtDate(member.memberAdded)}`,
    `✅ *Valid Until:* ${fmtDate(member.expiryDate)}`,
    "",
    "────────────────────────",
    "Present this card at the gym entrance.",
    `📞 Contact: ${brand.phone}`,
    divider,
  ].filter(Boolean).join("\n");
}

/**
 * Member ID Card component with view, print, and WhatsApp share.
 * @param {{ member: import("@/lib/firebase/members").Member }} props
 */
export function MemberIdCard({ member }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const idCardText = buildIdCardText(member);
  const whatsappUrl = buildWhatsAppUrl(member.mobile, idCardText);

  function handleWhatsApp() {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(idCardText);
      setCopied(true);
      toast.success("ID card text copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy.");
    }
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const initials = getInitials(member.name || "?");
    const gender = member.gender
      ? member.gender.charAt(0).toUpperCase() + member.gender.slice(1)
      : "—";

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>ID Card - ${member.name}</title>
  <style>
    @page { size: 86mm 54mm; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f1f5f9;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .card {
      width: 400px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      position: relative;
    }
    .card-top {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      padding: 24px 28px 20px;
      position: relative;
      overflow: hidden;
    }
    .card-top::before {
      content: "";
      position: absolute;
      top: -30px;
      right: -30px;
      width: 120px;
      height: 120px;
      background: rgba(225, 29, 72, 0.15);
      border-radius: 50%;
    }
    .card-top::after {
      content: "";
      position: absolute;
      bottom: -20px;
      left: -20px;
      width: 80px;
      height: 80px;
      background: rgba(225, 29, 72, 0.1);
      border-radius: 50%;
    }
    .brand-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      position: relative;
      z-index: 1;
    }
    .brand-name {
      font-size: 15px;
      font-weight: 800;
      color: #e11d48;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .badge {
      background: rgba(225, 29, 72, 0.2);
      color: #fb7185;
      font-size: 9px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .member-section {
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
      z-index: 1;
    }
    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, #e11d48, #be123c);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 800;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(225,29,72,0.4);
    }
    .member-info h2 {
      font-size: 18px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.3px;
    }
    .member-id {
      font-size: 13px;
      color: #94a3b8;
      font-weight: 600;
      margin-top: 2px;
    }
    .card-bottom {
      background: #ffffff;
      padding: 20px 28px 24px;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 20px;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    .detail-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #94a3b8;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .detail-value {
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
    }
    .divider {
      height: 1px;
      background: #f1f5f9;
      margin: 14px 0;
    }
    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .gym-contact {
      font-size: 10px;
      color: #94a3b8;
    }
    .active-badge {
      background: #ecfdf5;
      color: #059669;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
    @media print {
      body { background: white; min-height: auto; }
      .card { box-shadow: none; width: 100%; max-width: 400px; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-top">
      <div class="brand-row">
        <div class="brand-name">🏋️ ${brand.name}</div>
        <span class="badge">Member Card</span>
      </div>
      <div class="member-section">
        <div class="avatar">${initials}</div>
        <div class="member-info">
          <h2>${member.name}</h2>
          <div class="member-id">ID: #${member.memberId}</div>
        </div>
      </div>
    </div>
    <div class="card-bottom">
      <div class="details-grid">
        <div class="detail-item">
          <span class="detail-label">📱 Mobile</span>
          <span class="detail-value">${member.mobile}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">💳 Plan</span>
          <span class="detail-value">${member.planName}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">📅 Member Since</span>
          <span class="detail-value">${fmtDate(member.memberAdded)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">✅ Valid Until</span>
          <span class="detail-value">${fmtDate(member.expiryDate)}</span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="footer-row">
        <span class="gym-contact">📍 ${location.city} · ${brand.phone}</span>
        <span class="active-badge">● ACTIVE</span>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      window.print();
      window.onafterprint = function() { window.close(); };
    };
  <\/script>
</body>
</html>`);
    printWindow.document.close();
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <IdCard className="h-4 w-4" aria-hidden="true" />
        ID Card
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md overflow-hidden p-0">
          {/* ID Card Visual Preview */}
          <div className="relative overflow-hidden">
            {/* Card Top — Dark gradient header */}
            <div className="relative bg-gradient-to-br from-[hsl(240,30%,12%)] via-[hsl(222,47%,11%)] to-[hsl(210,50%,20%)] p-6 pb-5">
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary/10" />
              <div className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-primary/[0.07]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-primary" />
                    <span className="text-sm font-extrabold uppercase tracking-wider text-primary">
                      {brand.name}
                    </span>
                  </div>
                  <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary/80">
                    Member Card
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-lg font-extrabold text-white shadow-lg shadow-primary/40">
                    {getInitials(member.name || "?")}
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight text-white">
                      {member.name}
                    </h2>
                    <p className="text-sm font-semibold text-slate-400">
                      ID: #{member.memberId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Bottom — Details grid */}
            <div className="bg-card p-6 pt-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Phone className="h-3 w-3 text-primary" /> Mobile
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">
                    {member.mobile}
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <ShieldCheck className="h-3 w-3 text-primary" /> Plan
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">
                    {member.planName}
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <User className="h-3 w-3 text-primary" /> Member Since
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">
                    {formatISODateTimeLabel(member.memberAdded)}
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Calendar className="h-3 w-3 text-primary" /> Valid Until
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">
                    {formatISODateTimeLabel(member.expiryDate)}
                  </p>
                </div>
              </div>

              <div className="my-4 border-t border-border" />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  📍 {location.city} · {brand.phone}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                  ● ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <DialogFooter className="flex flex-col gap-2 border-t border-border bg-secondary/20 p-4 sm:flex-col">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a] font-semibold shadow-sm"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 font-semibold"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Print Card
              </Button>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full gap-1.5 text-xs"
              onClick={handleCopy}
            >
              {copied ? (
                <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</>
              ) : (
                <><Copy className="h-3.5 w-3.5" /> Copy as Text</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
