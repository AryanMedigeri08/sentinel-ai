"""
Layer 4 — Device & Geo Intelligence
Geo-velocity anomaly + device fingerprint mismatch detection.
"""
import numpy as np


def compute_geo_velocity(lat1, lon1, lat2, lon2, time_diff_hours):
    """Check for impossible travel — returns speed in km/h."""
    R = 6371
    dlat = np.radians(lat2 - lat1)
    dlon = np.radians(lon2 - lon1)
    a = np.sin(dlat / 2) ** 2 + np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon / 2) ** 2
    distance_km = R * 2 * np.arcsin(np.sqrt(a))

    if time_diff_hours <= 0:
        time_diff_hours = 0.01  # avoid division by zero

    speed = distance_km / time_diff_hours
    return {
        "distance_km": round(float(distance_km), 2),
        "time_diff_hours": round(float(time_diff_hours), 2),
        "speed_kmh": round(float(speed), 2),
        "is_impossible_travel": speed > 800,  # faster than commercial flight
        "risk_factor": "CRITICAL" if speed > 800 else "HIGH" if speed > 200 else "LOW",
    }


def analyze_device_geo(txn: dict, user_profile: dict = None) -> dict:
    """Analyze device and geo intelligence for a transaction."""
    risks = []
    risk_score = 0

    # Device change detection
    if txn.get("device_changed"):
        risks.append({
            "type": "device_change",
            "severity": "HIGH",
            "detail": f"Device changed to {txn.get('device', 'unknown')}",
        })
        risk_score += 0.25

    # Geo distance check
    geo_dist = float(txn.get("geo_distance_km", 0))
    if geo_dist > 500:
        risks.append({
            "type": "impossible_travel",
            "severity": "CRITICAL",
            "detail": f"Transaction location {geo_dist:.0f}km from home city",
        })
        risk_score += 0.4
    elif geo_dist > 100:
        risks.append({
            "type": "geo_anomaly",
            "severity": "HIGH",
            "detail": f"Transaction {geo_dist:.0f}km from usual location",
        })
        risk_score += 0.2

    # Night + device change combo
    hour = int(txn.get("hour", 12))
    if hour <= 5 and txn.get("device_changed"):
        risks.append({
            "type": "night_device_combo",
            "severity": "CRITICAL",
            "detail": f"New device used at {hour}:00 AM",
        })
        risk_score += 0.3

    if not risks:
        risks.append({
            "type": "normal",
            "severity": "LOW",
            "detail": "No device or geo anomalies detected",
        })

    return {
        "device_geo_risk": round(min(risk_score, 1.0), 2),
        "risks": risks,
    }
