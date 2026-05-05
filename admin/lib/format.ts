export function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

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

export function formatOrderTime(date: string | Date) {
  const d = new Date(date);

  const datePart = d.toLocaleDateString("vi-VN");
  const timePart = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart} - ${timePart}`;
}

export function formatShortPrice(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}tr`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}k`;
  }

  return value.toString();
}
