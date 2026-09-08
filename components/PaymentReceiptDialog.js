"use client";

import { useState } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Dumbbell,
  MessageCircle,
  Phone,
  Printer,
  ShieldCheck,
  User,
  X,
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
import { formatINR, getInitials } from "@/lib/format";
import { buildReceiptText, buildWhatsAppUrl } from "@/lib/receipt";
import { brand, location } from "@/data/site-data";

/**
 * @typedef {{
 *   memberName: string,
 *   memberId: string,
 *   mobile: string,
 *   planName: string,
 *   amountPaid: number,
 *   method: string,
 *   paidAt: string,
 *   validUntil?: string,
 *   pendingAmount: number,
 * }} ReceiptData
 */

/**
 * Formats date to display format e.g. "08 Sep 2026".
 * @param {string|null|undefined} value
 */
function formatDate(value) {
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
 * Formats time e.g. "10:45 AM".
 * @param {string|null|undefined} value
 */
function formatTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Shows a polished digital receipt with WhatsApp sharing and professional printing.
 * @param {{ receipt: ReceiptData | null, onClose: () => void }} props
 */
export function PaymentReceiptDialog({ receipt, onClose }) {
  const [copied, setCopied] = useState(false);
  const [showRawText, setShowRawText] = useState(false);

  if (!receipt) return null;

  const receiptText = buildReceiptText(receipt);
  const whatsappUrl = buildWhatsAppUrl(receipt.mobile, receiptText);
  const receiptNo = `MF-${receipt.memberId}-${new Date(receipt.paidAt).getTime().toString().slice(-4)}`;

  function handleWhatsApp() {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(receiptText);
      setCopied(true);
      toast.success("Receipt text copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy receipt text.");
    }
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const formattedDate = formatDate(receipt.paidAt);
    const formattedTime = formatTime(receipt.paidAt);
    const formattedValidUntil = receipt.validUntil ? formatDate(receipt.validUntil) : "—";
    const methodUpper = (receipt.method || "Cash").toUpperCase();

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Receipt - ${receipt.memberName} (#${receipt.memberId})</title>
  <style>
    @page {
      size: auto;
      margin: 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      display: flex;
      justify-content: center;
      padding: 20px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .invoice-card {
      width: 100%;
      max-width: 520px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      padding: 32px;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #e11d48;
      text-transform: uppercase;
    }
    .brand-subtitle {
      font-size: 11px;
      color: #64748b;
      margin-top: 4px;
      max-width: 260px;
      line-height: 1.4;
    }
    .receipt-badge {
      text-align: right;
    }
    .badge-pill {
      display: inline-block;
      background: #fecdd3;
      color: #9f1239;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 9999px;
      letter-spacing: 0.5px;
    }
    .receipt-no {
      font-size: 11px;
      font-weight: 600;
      color: #334155;
      margin-top: 6px;
    }
    .date-label {
      font-size: 10px;
      color: #64748b;
    }
    .member-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }
    .member-col h4 {
      font-size: 10px;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .member-col p {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }
    .member-col p.sub {
      font-size: 12px;
      font-weight: 500;
      color: #475569;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .table th {
      background: #f1f5f9;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #475569;
      padding: 10px 12px;
      font-weight: 700;
    }
    .table td {
      padding: 12px;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
    }
    .table td.text-right, .table th.text-right {
      text-align: right;
    }
    .totals {
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      margin-bottom: 24px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      padding: 4px 0;
      color: #475569;
    }
    .totals-row.grand {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      border-top: 2px solid #0f172a;
      padding-top: 8px;
      margin-top: 6px;
    }
    .totals-row.grand .amount {
      color: #059669;
    }
    .stamp-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px dashed #cbd5e1;
    }
    .paid-stamp {
      display: inline-flex;
      align-items: center;
      border: 2px solid #059669;
      color: #059669;
      font-weight: 900;
      font-size: 13px;
      text-transform: uppercase;
      padding: 4px 14px;
      border-radius: 6px;
      letter-spacing: 1.5px;
      transform: rotate(-3deg);
    }
    .signature-area {
      text-align: right;
      font-size: 11px;
      color: #64748b;
    }
    .signature-line {
      width: 130px;
      border-bottom: 1px solid #94a3b8;
      margin-bottom: 4px;
      display: inline-block;
    }
    .footer-terms {
      margin-top: 20px;
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      line-height: 1.5;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .invoice-card {
        box-shadow: none;
        border: none;
        max-width: 100%;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand-title">${brand.name}</div>
        <div class="brand-subtitle">${location.descriptionLabel}<br/>Ph: ${brand.phone}</div>
      </div>
      <div class="receipt-badge">
        <span class="badge-pill">Official Receipt</span>
        <div class="receipt-no">#${receiptNo}</div>
        <div class="date-label">${formattedDate} ${formattedTime}</div>
      </div>
    </div>

    <div class="member-box">
      <div class="member-col">
        <h4>Member Details</h4>
        <p>${receipt.memberName}</p>
        <p class="sub">ID: #${receipt.memberId}</p>
      </div>
      <div class="member-col" style="text-align: right;">
        <h4>Contact & Plan</h4>
        <p>${receipt.mobile}</p>
        <p class="sub">${receipt.planName} Plan</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Validity</th>
          <th>Method</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Gym Membership</strong>
            <div style="font-size: 11px; color: #64748b;">${receipt.planName} Subscription</div>
          </td>
          <td>${formattedValidUntil}</td>
          <td><span style="display:inline-block; background:#e2e8f0; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:600;">${methodUpper}</span></td>
          <td class="text-right"><strong>₹${receipt.amountPaid.toLocaleString("en-IN")}</strong></td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Payment Mode</span>
        <span>${methodUpper}</span>
      </div>
      ${receipt.pendingAmount > 0 ? `
      <div class="totals-row" style="color: #e11d48;">
        <span>Pending Balance Remaining</span>
        <span>₹${receipt.pendingAmount.toLocaleString("en-IN")}</span>
      </div>` : `
      <div class="totals-row" style="color: #059669;">
        <span>Outstanding Balance</span>
        <span>₹0 (Cleared)</span>
      </div>`}
      <div class="totals-row grand">
        <span>Total Paid Now</span>
        <span class="amount">₹${receipt.amountPaid.toLocaleString("en-IN")}</span>
      </div>
    </div>

    <div class="stamp-container">
      <div class="paid-stamp">✓ PAID</div>
      <div class="signature-area">
        <div class="signature-line"></div>
        <div>Authorized Signatory</div>
      </div>
    </div>

    <div class="footer-terms">
      Thank you for training with <strong>${brand.name}</strong>!<br/>
      Membership fee is non-refundable & non-transferable. Carry your Member ID for gym access.<br/>
      Generated automatically by Maxx Fitness System.
    </div>
  </div>
  <script>
    window.onload = function() {
      window.print();
      window.onafterprint = function() { window.close(); };
    };
  </script>
</body>
</html>`);
    printWindow.document.close();
  }

  return (
    <Dialog open={!!receipt} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md overflow-hidden p-0 sm:max-w-lg">
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-br from-primary/20 via-card to-card p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-foreground">
                  {brand.name}
                </h3>
                <p className="text-xs text-muted-foreground">{location.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-500">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Payment Done</span>
            </div>
          </div>

          {/* Large Highlighted Amount Card */}
          <div className="mt-5 flex items-center justify-between rounded-xl border border-border/80 bg-background/60 p-4 backdrop-blur-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Amount Paid
              </p>
              <p className="font-display text-3xl font-black text-emerald-500">
                {formatINR(receipt.amountPaid)}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold uppercase text-foreground">
                {receipt.method}
              </span>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {formatDate(receipt.paidAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Receipt Body Details */}
        <div className="space-y-4 p-6 pt-4">
          {/* Member info banner */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-card/60 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                {getInitials(receipt.memberName)}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {receipt.memberName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Member #{receipt.memberId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>{receipt.mobile}</span>
            </div>
          </div>

          {/* Membership Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-border bg-card/40 p-3">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-primary" /> Plan
              </span>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {receipt.planName}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card/40 p-3">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Valid Until
              </span>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {receipt.validUntil ? formatDate(receipt.validUntil) : "—"}
              </p>
            </div>
          </div>

          {/* Balance Status */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-3.5 py-2.5 text-xs">
            <span className="text-muted-foreground">Outstanding Balance</span>
            {receipt.pendingAmount > 0 ? (
              <span className="font-bold text-rose-500">
                {formatINR(receipt.pendingAmount)} Due
              </span>
            ) : (
              <span className="font-semibold text-emerald-500 flex items-center gap-1">
                <Check className="h-3 w-3" /> Fully Cleared
              </span>
            )}
          </div>

          {/* WhatsApp Text Preview Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowRawText(!showRawText)}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors underline"
            >
              {showRawText ? "Hide WhatsApp message preview" : "View WhatsApp message text"}
            </button>

            {showRawText ? (
              <div className="mt-2 max-h-36 overflow-y-auto rounded-lg border border-border bg-muted/40 p-3">
                <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-foreground">
                  {receiptText}
                </pre>
              </div>
            ) : null}
          </div>
        </div>

        {/* Actions Footer */}
        <DialogFooter className="flex flex-col gap-2 border-t border-border bg-secondary/20 p-4 sm:flex-col">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a] font-semibold shadow-sm"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2 font-semibold"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print / PDF
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 gap-1.5 text-xs"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Text
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
