"""
Email Alert Service — SMTP Integration for Sentinel AI.
Sends real email notifications for fraud alerts via Gmail SMTP.
"""
import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)


def format_alert_email(alert_data: dict) -> tuple[str, str]:
    """Format an alert dict into email subject and HTML body."""
    severity = alert_data.get("severity", "HIGH")
    amount = alert_data.get("amount", "N/A")
    risk_score = alert_data.get("risk_score", "?")
    sender = alert_data.get("sender", "Unknown")
    receiver = alert_data.get("receiver", "Unknown")
    alert_id = alert_data.get("id", "N/A")
    status = alert_data.get("status", "Flagged")

    triggers = alert_data.get("ai_triggers", [])
    trigger_html = ""
    for t in triggers[:4]:
        factor = t.get("factor", "")
        detail = t.get("detail", "")
        sev = t.get("severity", "medium")
        color = "#ef4444" if sev == "critical" else "#f59e0b" if sev == "high" else "#38bdf8"
        trigger_html += (
            f'<tr><td style="padding:6px 12px;color:{color};font-weight:600">{factor}</td>'
            f'<td style="padding:6px 12px;color:#94a3b8;font-size:13px">{detail}</td></tr>'
        )

    subject = f"🚨 Sentinel AI — {severity} Alert | {amount} | Risk {risk_score}"

    body = f"""
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#0f172a;border-radius:12px;overflow:hidden;border:1px solid #1e293b">
      <div style="background:linear-gradient(135deg,#1e293b,#0f172a);padding:24px 28px;border-bottom:1px solid #1e293b">
        <h1 style="margin:0;font-size:18px;color:#f1f5f9">🚨 Sentinel AI Alert</h1>
        <p style="margin:6px 0 0;font-size:12px;color:#64748b">Automated Fraud Detection Alert</p>
      </div>
      <div style="padding:24px 28px">
        <div style="display:flex;gap:12px;margin-bottom:20px">
          <span style="background:{'#7f1d1d' if severity=='CRITICAL' else '#78350f'};color:{'#fca5a5' if severity=='CRITICAL' else '#fcd34d'};padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700">{severity}</span>
          <span style="color:#94a3b8;font-size:13px">Alert ID: {alert_id}</span>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Amount</td><td style="padding:8px 0;color:#f1f5f9;font-weight:600;text-align:right">{amount}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Risk Score</td><td style="padding:8px 0;color:{'#ef4444' if isinstance(risk_score,int) and risk_score>=80 else '#f59e0b'};font-weight:700;text-align:right">{risk_score}/100</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Sender</td><td style="padding:8px 0;color:#f1f5f9;font-family:monospace;text-align:right;font-size:12px">{sender}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Receiver</td><td style="padding:8px 0;color:#f1f5f9;font-family:monospace;text-align:right;font-size:12px">{receiver}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Status</td><td style="padding:8px 0;color:#f1f5f9;text-align:right">{status}</td></tr>
        </table>
        {"<h3 style='color:#f1f5f9;font-size:13px;margin:16px 0 8px;text-transform:uppercase;letter-spacing:1px'>AI Triggers</h3><table style=\"width:100%;border-collapse:collapse\">" + trigger_html + "</table>" if trigger_html else ""}
      </div>
      <div style="padding:16px 28px;background:#1e293b;text-align:center">
        <p style="margin:0;font-size:11px;color:#64748b">Sentinel AI — Multi-Layer Fraud Intelligence Platform</p>
      </div>
    </div>
    """

    return subject, body


def send_email_alert(alert_data: dict) -> dict:
    """
    Send an email alert via Gmail SMTP.

    Returns:
        dict with 'success' (bool), and either 'message' or 'error'.
    """
    smtp_user = os.getenv("SMTP_EMAIL", "")
    smtp_pass = os.getenv("SMTP_APP_PASSWORD", "")
    to_email = os.getenv("ALERT_EMAIL", "")

    if not smtp_user or not smtp_pass:
        return {
            "success": False,
            "error": "SMTP_EMAIL or SMTP_APP_PASSWORD not configured in .env",
        }
    if not to_email:
        return {
            "success": False,
            "error": "ALERT_EMAIL not configured in .env",
        }

    subject, html_body = format_alert_email(alert_data)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = smtp_user
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, to_email, msg.as_string())

        logger.info(f"Email sent successfully to {to_email}")
        return {
            "success": True,
            "message": f"Email sent to {to_email}",
        }
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return {
            "success": False,
            "error": str(e),
        }
