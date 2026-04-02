"use client";

import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import salesHistory from "@/data/sales-history.json";
import ReportsStatsCards from "@/components/reports/StatsCards";
import ReportsPreview from "@/components/reports/ReportPreview";
import { redirect } from "next/navigation";

// Date Formatter
const formatDisplayDate = (date) =>
  new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

// Money Formatter
const formatMoney = (value) =>
  new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

// Count Formatter
const formatCount = (value) => new Intl.NumberFormat("tr-TR").format(value);

// Payment Label
const getPaymentLabel = (payment) => {
  if (payment === "cash") return "Nakit";
  if (payment === "credit_card") return "Kredi Kartı";
  if (payment === "qr") return "QR";
  return "Tümü";
};

export default function ReportsPage() {
  // Filter State
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return salesHistory.filter((order) => {
      return paymentFilter === "all" ? true : order.paymentMethod === paymentFilter;
    });
  }, [paymentFilter]);

  // Report Data
  const reportData = useMemo(() => {
    const paidOrders = filteredOrders.filter((order) => order.isPaid);
    const unpaidOrders = filteredOrders.filter((order) => !order.isPaid);

    const netAmount = paidOrders.reduce(
      (total, order) => total + (order.totalAmount || 0),
      0
    );

    const totalOrders = paidOrders.length;

    const totalProducts = paidOrders.reduce((total, order) => {
      return (
        total +
        (order.items || []).reduce(
          (itemTotal, item) => itemTotal + (item.qt || 0),
          0
        )
      );
    }, 0);

    const averageCheck = totalOrders > 0 ? netAmount / totalOrders : 0;
    const averageProductPrice = totalProducts > 0 ? netAmount / totalProducts : 0;
    const perCheckProductCount =
      totalOrders > 0 ? totalProducts / totalOrders : 0;

    const cashTotal = paidOrders
      .filter((order) => order.paymentMethod === "cash")
      .reduce((total, order) => total + (order.totalAmount || 0), 0);

    const creditCardTotal = paidOrders
      .filter((order) => order.paymentMethod === "credit_card")
      .reduce((total, order) => total + (order.totalAmount || 0), 0);

    const qrTotal = paidOrders
      .filter((order) => order.paymentMethod === "qr")
      .reduce((total, order) => total + (order.totalAmount || 0), 0);

    const paymentTotal = cashTotal + creditCardTotal + qrTotal;

    const cashPercent =
      paymentTotal > 0 ? Math.round((cashTotal / paymentTotal) * 100) : 0;
    const creditPercent =
      paymentTotal > 0 ? Math.round((creditCardTotal / paymentTotal) * 100) : 0;
    const qrPercent =
      paymentTotal > 0 ? Math.round((qrTotal / paymentTotal) * 100) : 0;

    const allDates = filteredOrders
      .map((order) => new Date(order.createdAt))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a - b);

    const firstDate = allDates[0];
    const lastDate = allDates[allDates.length - 1];

    return {
      netAmount,
      totalOrders,
      totalProducts,
      averageCheck,
      averageProductPrice,
      perCheckProductCount,
      cashTotal,
      creditCardTotal,
      qrTotal,
      cashPercent,
      creditPercent,
      qrPercent,
      openCheckCount: unpaidOrders.length,
      openCheckAmount: unpaidOrders.reduce(
        (total, order) => total + (order.totalAmount || 0),
        0
      ),
      firstDate,
      lastDate,
    };
  }, [filteredOrders]);

  const dateRangeLabel =
    reportData.firstDate && reportData.lastDate
      ? `${formatDisplayDate(reportData.firstDate)} - ${formatDisplayDate(reportData.lastDate)}`
      : "Kayıt bulunamadı";

  const summaryRows = [
    { label: "Net Tutar", value: formatMoney(reportData.netAmount) },
    { label: "Toplam Vergi", value: formatMoney(0), muted: true },
    { label: "İndirim Tutarı", value: formatMoney(0), muted: true },
    { label: "Kampanya Tutarı", value: formatMoney(0), muted: true },
    { label: "Servis Ücreti Tutarı", value: formatMoney(0), muted: true },
    { label: "İptal Tutarı", value: formatMoney(0), muted: true },
    { label: "İade Tutarı", value: formatMoney(0), muted: true },
    { label: "İkram Tutarı", value: formatMoney(0), muted: true },
    { label: "Adisyon Sayısı", value: formatCount(reportData.totalOrders) },
    { label: "Misafir Sayısı", value: formatCount(0), muted: true },
    {
      label: "Hesap Başı Ürün Sayısı",
      value: formatMoney(reportData.perCheckProductCount),
    },
    {
      label: "Ortalama Ürün Fiyatı",
      value: formatMoney(reportData.averageProductPrice),
    },
    {
      label: "Ortalama Hesap Tutarı",
      value: formatMoney(reportData.averageCheck),
    },
    {
      label: "Açık Çek Sayısı",
      value: formatCount(reportData.openCheckCount),
    },
    {
      label: "Açık Çek Tutarı",
      value: formatMoney(reportData.openCheckAmount),
    },
  ];

  return (
    <div className="mt-26 flex select-none flex-col gap-8 overflow-y-auto px-8 py-6 md:mt-0 md:ml-70 md:py-8 lg:py-10">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 md-gap-6 lg:gap-8">
        {/* Back Button */}
        <div className="flex-1">
          <button
            onClick={() => redirect("/restaurant-management")}
            className="flex h-14.5 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#121212] text-white hover:opacity-90 active:scale-95 dark:bg-white dark:text-black"
          >
            <Icons.ArrowLeft size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Payment Filter */}
        <div className="flex h-14.5 flex-1 overflow-hidden rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d]">
          {[
            { key: "all", label: "Tümü" },
            { key: "cash", label: "Nakit" },
            { key: "credit_card", label: "Kredi Kartı" },
            { key: "qr", label: "QR" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setPaymentFilter(item.key)}
              className={`flex flex-1 items-center justify-center text-[13px] font-bold transition-all ${
                paymentFilter === item.key
                  ? "bg-[#a5b4fc] text-white"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Stats Cards */}
      <ReportsStatsCards
        reportData={reportData}
        formatMoney={formatMoney}
        formatCount={formatCount}
      />

      {/* Report Preview */}
      <ReportsPreview
        reportData={reportData}
        dateRangeLabel={dateRangeLabel}
        paymentFilter={paymentFilter}
        getPaymentLabel={getPaymentLabel}
        summaryRows={summaryRows}
        formatMoney={formatMoney}
      />
    </div>
  );
}