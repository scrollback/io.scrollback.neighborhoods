const msPerSec = 1000;
const msPerMin = msPerSec * 60;
const msPerHour = msPerMin * 60;
const msPerDay = msPerHour * 24;
const msPerWeek = msPerDay * 7;
const msPerMonth = msPerWeek * 30;
const msPerYear = msPerMonth * 365;

const weekDays = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

function short(time, now = Date.now()) {
	const diff = now - time;

	if (diff < 0) {
		if (diff > msPerMin) {
			return "future";
		} else {
			return "now";
		}
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

function long(time, now = Date.now()) {
	const diff = now - time;

	if (diff < 0) {
		if (diff > msPerMin) {
			return "Future";
		} else {
			return "Just now";
		}
	} else if (diff < msPerMin) {
		return "Just now";
	} else if (diff < msPerHour) {
		return Math.round(diff / msPerMin) + " minutes ago";
	} else if (diff < msPerDay) {
		return Math.round(diff / msPerHour) + " hours ago";
	} else {
		const date = new Date(time);
		const currentDate = new Date(now);

		let timeStr;

		if (diff < msPerWeek) {
			if (Math.round(diff / msPerDay) <= 1 && date.getDay() !== currentDate.getDay()) {
				timeStr = "Yesterday";
			} else {
				timeStr = weekDays[date.getDay];
			}
		} else {
			timeStr = (date.getFullYear() !== currentDate.getFullYear() ? date.getFullYear() + " " : "") + months[date.getMonth()] + " " + date.getDate();
		}

		return (timeStr ? (timeStr + " at ") : "") + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
	}
}

export default { short, long };
