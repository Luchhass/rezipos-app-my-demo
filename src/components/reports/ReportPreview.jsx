"use client";

import * as Icons from "lucide-react";

// Metric Tile
function MetricTile({ label, value, icon: Icon, tone }) {
  const toneMap = {
    purple: "bg-[#a5b4fc] text-white",
    green: "bg-[#bbf7d0] text-[#121212]",
    yellow: "bg-[#fde68a] text-[#121212]",
  };

  return (
    <div className={`rounded-2xl p-4 md:p-5 ${toneMap[tone]}`}>
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-black/10 dark:bg-white/10">
        <Icon size={20} />
      </div>

      <p className="text-[10px] font-black uppercase tracking-wider opacity-55">
        {label}
      </p>
      <p className="mt-2 text-[22px] font-bold tracking-tight md:text-[24px]">
        {value}
      </p>
    </div>
  );
}

// Detail Row
function DetailRow({ label, value, muted = false }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-black/6 py-3.5 last:border-b-0 dark:border-white/10">
      <p
        className={`text-sm ${
          muted
            ? "text-[#121212]/45 dark:text-white/45"
            : "text-[#121212] dark:text-white"
        }`}
      >
        {label}
      </p>

      <p className="text-sm font-bold tabular-nums text-[#121212]/70 dark:text-white/70">
        {value}
      </p>
    </div>
  );
}

// Payment Row
function PaymentRow({ label, value, percent, tone }) {
  const toneMap = {
    purple: "bg-[#a5b4fc]",
    green: "bg-[#bbf7d0]",
    yellow: "bg-[#fde68a]",
  };

  return (
    <div className="rounded-2xl bg-black/6 p-4 dark:bg-white/6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-[#121212]/45 dark:text-white/45">
            Ödeme
          </p>
          <p className="mt-1 text-sm font-bold text-[#121212] dark:text-white">
            {label}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold tabular-nums text-[#121212] dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-[11px] font-bold text-[#121212]/45 dark:text-white/45">
            %{percent}
          </p>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-black/8 dark:bg-white/8">
        <div
          className={`h-full rounded-full ${toneMap[tone]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function ReportsPreview({
  reportData,
  dateRangeLabel,
  paymentFilter,
  getPaymentLabel,
  summaryRows,
  formatMoney,
}) {
  return (
    <section className="overflow-hidden rounded-2xl bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-white">
      {/* Header */}
      <div className="border-b border-black/6 px-4 py-5 dark:border-white/10 md:px-5 md:py-6 lg:px-6 lg:py-7">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-[26px] leading-none tracking-tighter md:text-[29px] lg:text-[34px]">
              Rapor Önizlemesi
            </h1>
            <p className="text-sm font-medium text-[#121212]/50 dark:text-white/50">
              {dateRangeLabel}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            <MetricTile
              label="Gelir Merkezi"
              value="Tümü"
              icon={Icons.Building2}
              tone="purple"
            />
            <MetricTile
              label="Hesaplar"
              value={reportData.openCheckCount > 0 ? "Karışık" : "Kapalı"}
              icon={Icons.ReceiptText}
              tone="green"
            />
            <MetricTile
              label="Ödeme Filtresi"
              value={getPaymentLabel(paymentFilter)}
              icon={Icons.WalletCards}
              tone="yellow"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 px-4 py-5 md:px-5 md:py-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-8 lg:px-6 lg:py-7">
        {/* Left */}
        <div className="overflow-hidden rounded-2xl bg-black/6 dark:bg-white/6">
          <div className="border-b border-black/6 px-5 py-4 dark:border-white/10">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#121212]/45 dark:text-white/45">
              Rapor Detayı
            </p>
          </div>

          <div className="px-5 py-2">
            {summaryRows.map((row) => (
              <DetailRow
                key={row.label}
                label={row.label}
                value={row.value}
                muted={row.muted}
              />
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="overflow-hidden rounded-2xl bg-black/6 dark:bg-white/6">
            <div className="border-b border-black/6 px-5 py-4 dark:border-white/10">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#121212]/45 dark:text-white/45">
                Ödeme Dağılımı
              </p>
            </div>

            <div className="flex flex-col gap-3 p-4 md:p-5">
              <PaymentRow
                label="Nakit"
                value={formatMoney(reportData.cashTotal)}
                percent={reportData.cashPercent}
                tone="green"
              />
              <PaymentRow
                label="Kredi Kartı"
                value={formatMoney(reportData.creditCardTotal)}
                percent={reportData.creditPercent}
                tone="purple"
              />
              <PaymentRow
                label="QR"
                value={formatMoney(reportData.qrTotal)}
                percent={reportData.qrPercent}
                tone="yellow"
              />
            </div>
          </div>

          <button className="flex h-15 items-center justify-center gap-2 rounded-2xl bg-[#a5b4fc] px-5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]">
            <Icons.Download size={18} />
            Rapor Al
          </button>
        </div>
      </div>
    </section>
  );
}