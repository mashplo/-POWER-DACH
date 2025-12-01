from passlib.context import CryptContext
import bcrypt

print(f"Bcrypt version: {bcrypt.__version__}")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

password = "Test123"
print(f"Hashing password: '{password}' (len: {len(password)})")

try:
    hashed = pwd_context.hash(password)
    print(f"Success! Hash: {hashed}")
except Exception as e:
    print(f"Error: {e}")

# Try direct bcrypt
print("\nDirect bcrypt test:")
try:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    print(f"Success! Hash: {hashed}")
except Exception as e:
    print(f"Error: {e}")
