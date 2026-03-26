"""
SMS Alert Service — Twilio Integration for Sentinel AI.
Sends real SMS notifications for fraud alerts.
"""
import os
import logging

logger = logging.getLogger(__name__)


def _get_twilio_client():
    """Lazily create and return a Twilio client, or None if not configured."""
    sid = os.getenv("TWILIO_ACCOUNT_SID", "")
    token = os.getenv("TWILIO_AUTH_TOKEN", "")

    if not sid or not token or sid.startswith("your_"):
        logger.warning("Twilio credentials not configured. SMS will not be sent.")
        return None

    try:
        from twilio.rest import Client
        return Client(sid, token)
    except ImportError:
        logger.error("twilio package not installed. Run: pip install twilio")
        return None
    except Exception as e:
        logger.error(f"Failed to create Twilio client: {e}")
        return None


def format_alert_message(alert_data: dict) -> str:
    """Format an alert dict into a short SMS (under 100 chars for Twilio trial)."""
    severity = alert_data.get("severity", "HIGH")
    amount = alert_data.get("amount", "N/A")
    risk_score = alert_data.get("risk_score", "?")

    message = f"Alert:{severity} {amount}"
    return message[:30]


def send_sms_alert(alert_data: dict) -> dict:
    """
    Send an SMS alert via Twilio.

    Returns:
        dict with 'success' (bool), and either 'message_sid' or 'error'.
    """
    from_number = os.getenv("TWILIO_PHONE_NUMBER", "")
    to_number = os.getenv("ALERT_PHONE_NUMBER", "")

    if not from_number or not to_number:
        return {
            "success": False,
            "error": "TWILIO_PHONE_NUMBER or ALERT_PHONE_NUMBER not configured in .env",
        }

    client = _get_twilio_client()
    if client is None:
        return {
            "success": False,
            "error": "Twilio client not available. Check credentials in .env",
        }

    body = format_alert_message(alert_data)

    try:
        message = client.messages.create(
            body=body,
            from_=from_number,
            to=to_number,
        )
        logger.info(f"SMS sent successfully. SID: {message.sid}")
        return {
            "success": True,
            "message_sid": message.sid,
        }
    except Exception as e:
        logger.error(f"Failed to send SMS: {e}")
        return {
            "success": False,
            "error": str(e),
        }
