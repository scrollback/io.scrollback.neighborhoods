type Location = { latitude: number; longitude: number };

const EARTH_RADIUS = 6371000; // In meters

function toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

function calculateDistance(from: Location, to: Location): number {
    let dLat = toRadians(from.latitude - to.latitude),
        dLong = toRadians(from.longitude - to.longitude);

    let a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
            (Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(dLong / 2) * Math.sin(dLong / 2));

    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * EARTH_RADIUS;
}

function compareAreas(o: Location, a1: Location, a2: Location): number {
    let dist1 = calculateDistance(o, a1),
        dist2 = calculateDistance(o, a2);

    if (dist1 > dist2) {
        return 1;
    }

    if (dist1 < dist2) {
        return -1;
    }

    return 0;
}

function getFormattedDistance(from: Location, to: Location): string {
    let dist = Math.round(calculateDistance(from, to));

    return (dist < 1000) ? (dist + " m") : (Math.round(dist / 100) / 10 + " km");
}

export default {
    calculateDistance,
    compareAreas,
    getFormattedDistance
};
