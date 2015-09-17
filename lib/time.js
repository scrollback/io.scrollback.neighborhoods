const msPerSec = 1000,
      msPerMin = msPerSec * 60,
      msPerHour = msPerMin * 60,
      msPerDay = msPerHour * 24,
      msPerWeek = msPerDay * 7,
      msPerMonth = msPerWeek * 30,
      msPerYear = msPerMonth * 365;

export default function(time, now = Date.now()) {
    const diff = now - time;

    if (diff < 0) {
        return "future";
    } else if (diff < msPerMin) {
        return Math.round(diff / msPerSec) + "s";
    } else if (diff < msPerHour) {
        return Math.round(diff / msPerMin) + "m";
    } else if (diff < msPerDay) {
        return Math.round(diff / msPerHour) + "h";
    } else if (diff < msPerYear) {
        return Math.round(diff / msPerDay) + "d";
    } else {
        return Math.round(diff / msPerYear) + "y";
    }
}
