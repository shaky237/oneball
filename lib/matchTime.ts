const WAT_TIMEZONE = "Africa/Lagos";

export function formatMatchDate(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: WAT_TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatMatchTime(dateString: string) {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: WAT_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateString));

  return `${time} WAT`;
}
