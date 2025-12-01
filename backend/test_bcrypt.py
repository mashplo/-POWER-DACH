from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

test_password = "password123"
print(f"Testing password: '{test_password}'")
print(f"Password length in bytes: {len(test_password.encode('utf-8'))}")

try:
    hashed = pwd_context.hash(test_password)
    print(f"Successfully hashed: {hashed[:50]}...")
except Exception as e:
    print(f"Error hashing: {type(e).__name__}: {e}")
