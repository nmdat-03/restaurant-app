import { GroupBy } from "./reports/types";

/*------------------------------*/
/*        FORMAT PRICE          */
/*------------------------------*/
export function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
  // Result: 50000 => 50.000đ
}

/*------------------------------*/
/*        FORMAT DATE           */
/*------------------------------*/
export function formatDate(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

/*------------------------------*/
/*       FORMAT ORDER TIME      */
/*------------------------------*/
export function formatOrderTime(date: string | Date) {
  const d = new Date(date);

  const datePart = d.toLocaleDateString("vi-VN");
  const timePart = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart} - ${timePart}`;
  // Result: 1/1/2026 - 15:30
}

/*------------------------------*/
/*       FORMAT SHORT PRICE     */
/*------------------------------*/
export function formatShortPrice(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}tr`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}k`;
  }

  return value.toString();
  // Result:
  // + 50000 => 50k
  // + 1000000 => 1tr
}

/*------------------------------*/
/*        FORMAT DATE KEY       */
/*------------------------------*/
export function formatDateKey(date: Date) {
  return date.toLocaleDateString("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

/*------------------------------*/
/*      FORMAT DATE DISPLAY     */
/*------------------------------*/
export function formatDateDisplay(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");

  return date.toLocaleDateString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/*------------------------------*/
/*      FORMAT CHART LABEL      */
/*------------------------------*/
export function formatChartLabel(value: string, groupBy: GroupBy) {
  // ===== Year =====
  if (groupBy === "year") {
    return value;
  }

  // ===== Month =====
  if (groupBy === "month") {
    const [, month] = value.split("-");

    return new Date(2000, Number(month) - 1).toLocaleDateString("en-US", {
      month: "short",
    });
  }

  // ===== Day =====
  const d = new Date(value + "T00:00:00");

  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}
