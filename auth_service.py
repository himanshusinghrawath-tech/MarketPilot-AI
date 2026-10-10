import os
import json
import time
import secrets
from pathlib import Path
from typing import Optional, Dict, Any, List
import bcrypt
import jwt

# Secret key for JWT signing (persisted in .env or fallback generated)
JWT_SECRET = os.getenv("JWT_SECRET", "marketpilot-secret-jwt-key-2026-hackathon-india")
JWT_ALGORITHM = "HS256"
SESSION_EXPIRY_SECONDS = 7 * 24 * 3600  # 7 days
RESET_TOKEN_EXPIRY_SECONDS = 3600       # 1 hour

USERS_DB_FILE = Path(__file__).resolve().parent.parent / "data" / "users.json"
RESET_TOKENS_FILE = Path(__file__).resolve().parent.parent / "data" / "password_resets.json"

def _hash_password(password: str) -> str:
    """Hash password using industry-standard bcrypt with salt rounds."""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def _verify_password(password: str, hashed_str: str) -> bool:
    """Verify password against bcrypt hash."""
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed_str.encode("utf-8"))
    except Exception:
        return False

def _load_users() -> Dict[str, Dict[str, Any]]:
    USERS_DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not USERS_DB_FILE.exists():
        # Seed initial demo executive account
        hashed = _hash_password("MarketPilot2026!")
        default_users = {
            "arjun@marketpilot.ai": {
                "id": "usr_arjun_01",
                "name": "Arjun Mehta",
                "email": "arjun@marketpilot.ai",
                "company": "Mehta Ventures",
                "role": "Founding Partner",
                "tier": "PRO TIER",
                "password_hash": hashed,
                "created_at": "2026-01-15T10:00:00Z"
            }
        }
        with open(USERS_DB_FILE, "w", encoding="utf-8") as f:
            json.dump(default_users, f, indent=2)
        return default_users

    try:
        with open(USERS_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def _save_users(users: Dict[str, Dict[str, Any]]) -> None:
    USERS_DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(USERS_DB_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)

def _load_reset_tokens() -> Dict[str, Dict[str, Any]]:
    RESET_TOKENS_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not RESET_TOKENS_FILE.exists():
        return {}
    try:
        with open(RESET_TOKENS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def _save_reset_tokens(tokens: Dict[str, Dict[str, Any]]) -> None:
    RESET_TOKENS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(RESET_TOKENS_FILE, "w", encoding="utf-8") as f:
        json.dump(tokens, f, indent=2)

class AuthService:
    def __init__(self):
        _load_users()

    def register_user(self, name: str, email: str, password: str, company: str = "", role: str = "Market Strategist") -> Dict[str, Any]:
        email_clean = email.strip().lower()
        if not email_clean or "@" not in email_clean:
            raise ValueError("A valid email address is required")
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not name or len(name.strip()) < 2:
            raise ValueError("Full name must be at least 2 characters")

        users = _load_users()
        if email_clean in users:
            raise ValueError("An account with this email address already exists")

        user_id = f"usr_{secrets.token_hex(6)}"
        hashed = _hash_password(password)

        new_user = {
            "id": user_id,
            "name": name.strip(),
            "email": email_clean,
            "company": company.strip() or "Market Intelligence",
            "role": role.strip() or "Market Strategist",
            "tier": "PRO TIER",
            "password_hash": hashed,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

        users[email_clean] = new_user
        _save_users(users)

        token = self.create_token(new_user)
        user_safe = {k: v for k, v in new_user.items() if k != "password_hash"}
        return {"user": user_safe, "token": token}

    def authenticate_user(self, email: str, password: str) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        users = _load_users()

        user = users.get(email_clean)
        # Convenient demo alias
        if not user and email_clean == "demo@marketpilot.ai":
            user = users.get("arjun@marketpilot.ai")

        if not user or not _verify_password(password, user["password_hash"]):
            raise ValueError("Invalid email address or password")

        token = self.create_token(user)
        user_safe = {k: v for k, v in user.items() if k != "password_hash"}
        return {"user": user_safe, "token": token}

    def request_password_reset(self, email: str) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        users = _load_users()

        if email_clean not in users and email_clean != "demo@marketpilot.ai":
            raise ValueError("No account found with this email address")

        target_email = "arjun@marketpilot.ai" if email_clean == "demo@marketpilot.ai" else email_clean
        user = users[target_email]

        # Generate cryptographic unguessable reset token
        reset_token = secrets.token_urlsafe(32)
        tokens = _load_reset_tokens()

        # Clean expired tokens
        now = int(time.time())
        tokens = {t: data for t, data in tokens.items() if data.get("expires_at", 0) > now}

        tokens[reset_token] = {
            "email": target_email,
            "user_id": user["id"],
            "created_at": now,
            "expires_at": now + RESET_TOKEN_EXPIRY_SECONDS
        }
        _save_reset_tokens(tokens)

        # In production this sends an email. In our system, return reset_token so the UI can preview/use it.
        return {
            "success": True,
            "message": f"Password reset instructions generated for {target_email}",
            "reset_token": reset_token,
            "expires_in_minutes": 60,
            "reset_link": f"/reset-password?token={reset_token}"
        }

    def reset_password(self, token: str, new_password: str) -> Dict[str, Any]:
        if len(new_password) < 8:
            raise ValueError("New password must be at least 8 characters long")

        tokens = _load_reset_tokens()
        token_data = tokens.get(token)

        now = int(time.time())
        if not token_data or token_data.get("expires_at", 0) < now:
            raise ValueError("Reset token is invalid or has expired. Please request a new one.")

        email = token_data["email"]
        users = _load_users()
        if email not in users:
            raise ValueError("User account associated with this token was not found")

        # Update password hash
        users[email]["password_hash"] = _hash_password(new_password)
        users[email]["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        _save_users(users)

        # Invalidate used token
        tokens.pop(token, None)
        _save_reset_tokens(tokens)

        # Auto-login: issue fresh JWT token
        fresh_token = self.create_token(users[email])
        user_safe = {k: v for k, v in users[email].items() if k != "password_hash"}

        return {
            "success": True,
            "message": "Password has been successfully updated",
            "user": user_safe,
            "token": fresh_token
        }

    def create_token(self, user: Dict[str, Any]) -> str:
        payload = {
            "sub": user["id"],
            "email": user["email"],
            "name": user["name"],
            "exp": int(time.time()) + SESSION_EXPIRY_SECONDS,
            "iat": int(time.time())
        }
        return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            users = _load_users()
            for user in users.values():
                if user["id"] == payload.get("sub"):
                    return {k: v for k, v in user.items() if k != "password_hash"}
            return None
        except Exception:
            return None
