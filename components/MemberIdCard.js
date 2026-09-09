"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, IdCard, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { getInitials } from "@/lib/format";
import { brand, location } from "@/data/site-data";

/* ─── Constants ──────────────────────────────────────────────────────────── */
const CW = 720; // canvas width  (high-res for sharp download)
const CH = 420; // canvas height
const PRIMARY = "#e11d48";
const DARK1 = "#0f172a";
const DARK2 = "#1e1b4b";
const DARK3 = "#0c1a35";
const TOP_H = 240;

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function fmtDate(v) {
  if (!v) return "N/A";
  const d = new Date(v);
  return isNaN(d)
    ? "N/A"
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ─── Draw ───────────────────────────────────────────────────────────────── */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function drawCard(canvas, member) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = CW;
  canvas.height = CH;

  /* outer rounded clip */
  rr(ctx, 0, 0, CW, CH, 20);
  ctx.clip();

  /* ── TOP gradient background ── */
  const grad = ctx.createLinearGradient(0, 0, CW, TOP_H);
  grad.addColorStop(0, DARK1);
  grad.addColorStop(0.5, DARK2);
  grad.addColorStop(1, DARK3);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CW, TOP_H);

  /* decorative glow blobs */
  const blob = (x, y, r, alpha) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = PRIMARY;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  blob(CW - 40, -30, 120, 0.1);
  blob(50, TOP_H + 10, 80, 0.07);
  blob(CW / 2, TOP_H / 2, 180, 0.04);

  /* gym logo + name */
  const LOGO_H = 38;
  let logoX = 26;
  try {
    const logo = await loadImage("/logo.png");
    // Keep aspect ratio: logo is 509×476 ≈ square
    const logoW = Math.round(LOGO_H * (logo.naturalWidth / logo.naturalHeight));
    ctx.drawImage(logo, logoX, 14, logoW, LOGO_H);
    logoX += logoW + 10;
  } catch {
    /* logo failed — skip, just show text */
  }
  ctx.fillStyle = PRIMARY;
  ctx.font = "bold 17px system-ui, -apple-system, sans-serif";
  ctx.fillText(brand.name.toUpperCase(), logoX, 42);

  /* "MEMBER CARD" pill top-right */
  const pill = "MEMBER CARD";
  ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
  const pillW = ctx.measureText(pill).width + 22;
  ctx.fillStyle = "rgba(225,29,72,0.20)";
  rr(ctx, CW - pillW - 20, 24, pillW, 22, 11);
  ctx.fill();
  ctx.fillStyle = "#fb7185";
  ctx.fillText(pill, CW - pillW - 9, 39);

  /* thin separator */
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 58);
  ctx.lineTo(CW - 30, 58);
  ctx.stroke();

  /* ── Avatar circle ── */
  const AX = 76,
    AY = 136,
    AR = 48;
  const ag = ctx.createRadialGradient(AX - 10, AY - 10, 0, AX, AY, AR);
  ag.addColorStop(0, "#f43f5e");
  ag.addColorStop(1, "#9f1239");
  ctx.fillStyle = ag;

  /* shadow */
  ctx.save();
  ctx.shadowColor = "rgba(225,29,72,0.55)";
  ctx.shadowBlur = 22;
  ctx.beginPath();
  ctx.arc(AX, AY, AR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  /* initials */
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 27px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(getInitials(member.name || "?"), AX, AY + 10);
  ctx.textAlign = "left";

  /* member name */
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 30px system-ui, -apple-system, sans-serif";
  ctx.fillText(member.name, 146, 114);

  /* member ID */
  ctx.fillStyle = "#94a3b8";
  ctx.font = "500 15px system-ui, -apple-system, sans-serif";
  ctx.fillText("Member ID: #" + member.memberId, 146, 140);

  /* mobile */
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "15px system-ui, -apple-system, sans-serif";
  ctx.fillText("Mobile: " + (member.mobile || "—"), 146, 165);

  /* plan pill */
  const plan = member.planName || "—";
  ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
  const planW = ctx.measureText(plan).width + 24;
  ctx.fillStyle = "rgba(225,29,72,0.22)";
  rr(ctx, 146, 178, planW, 22, 11);
  ctx.fill();
  ctx.fillStyle = "#fb7185";
  ctx.fillText(plan, 158, 193);

  /* ── BOTTOM white section ── */
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, TOP_H, CW, CH - TOP_H);

  /* 4-cell detail grid */
  const C1 = 36,
    C2 = CW / 2 + 10,
    R1 = TOP_H + 32,
    R2 = TOP_H + 88;

  const cell = (label, value, x, y) => {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 10px system-ui, -apple-system, sans-serif";
    ctx.fillText(label, x, y);
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
    ctx.fillText(value || "—", x, y + 20);
  };

  cell("MEMBER SINCE", fmtDate(member.memberAdded), C1, R1);
  cell("VALID UNTIL", fmtDate(member.expiryDate), C2, R1);
  cell(
    "PLAN AMOUNT",
    member.planAmount
      ? "Rs. " + Number(member.planAmount).toLocaleString("en-IN")
      : "—",
    C1,
    R2,
  );
  cell("LOCATION", location.city || "—", C2, R2);

  /* divider before footer */
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, CH - 50);
  ctx.lineTo(CW - 36, CH - 50);
  ctx.stroke();

  /* footer: address */
  ctx.fillStyle = "#64748b";
  ctx.font = "12px system-ui, -apple-system, sans-serif";
  ctx.fillText(location.descriptionLabel || location.city || "", 36, CH - 28);

  /* ACTIVE badge */
  const aLabel = "ACTIVE";
  ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
  const aW = ctx.measureText(aLabel).width + 28;
  ctx.fillStyle = "rgba(16,185,129,0.15)";
  rr(ctx, CW - aW - 24, CH - 46, aW, 24, 12);
  ctx.fill();

  /* green dot */
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(CW - aW - 14, CH - 34, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#10b981";
  ctx.fillText(aLabel, CW - aW - 6, CH - 28);
}

/* ─── Inner canvas component (mounts fresh on each open) ─────────────────── */
function CardCanvas({ member, onCanvas }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    // drawCard is async (loads logo image before drawing)
    drawCard(ref.current, member).then(() => {
      onCanvas(ref.current);
    });
  }, [member, onCanvas]);

  return (
    <canvas
      ref={ref}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        borderRadius: "12px",
      }}
      aria-label={"ID card for " + member.name}
    />
  );
}

/* ─── Public component ───────────────────────────────────────────────────── */
export function MemberIdCard({ member }) {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef(null);

  const handleCanvas = (c) => {
    canvasRef.current = c;
  };

  function getDataUrl() {
    return canvasRef.current ? canvasRef.current.toDataURL("image/png") : null;
  }

  function handleDownload() {
    const url = getDataUrl();
    if (!url) return;
    const a = document.createElement("a");
    a.download =
      (member.name.replace(/\s+/g, "_") || "member") + "_ID_Card.png";
    a.href = url;
    a.click();
  }

  async function handleShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (typeof navigator.canShare === "function") {
      try {
        const blob = await new Promise((res) =>
          canvas.toBlob(res, "image/png"),
        );
        const file = new File([blob], member.name + "_ID_Card.png", {
          type: "image/png",
        });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: member.name + " — " + brand.name,
            files: [file],
          });
          return;
        }
      } catch {
        /* cancelled or unsupported */
      }
    }

    handleDownload();
    toast.info("Image downloaded — open WhatsApp and attach it to send.", {
      duration: 5000,
    });
  }

  function handlePrint() {
    const url = getDataUrl();
    if (!url) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>ID Card</title>
<style>@page{size:auto;margin:8mm}body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh}img{max-width:100%;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,.15)}</style></head>
<body><img src="${url}"/><script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}<\/script></body></html>`);
    win.document.close();
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <IdCard className="h-4 w-4" />
        ID Card
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <div className="bg-slate-200 dark:bg-slate-800 p-5">
            {/* Only mount the canvas when the dialog is open so useLayoutEffect
                fires after the canvas element is actually in the DOM. */}
            {open && <CardCanvas member={member} onCanvas={handleCanvas} />}
          </div>

          <DialogFooter className="flex-col gap-2 border-t border-border bg-secondary/20 p-4 sm:flex-col">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                className="w-full gap-2 font-semibold"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download PNG
              </Button>
              <Button
                className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a] font-semibold"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={handlePrint}
            >
              Print Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
