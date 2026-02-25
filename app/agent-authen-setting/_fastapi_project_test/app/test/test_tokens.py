from jose import jwt
from datetime import datetime, timedelta, timezone


def create_azure_ad_token(groups: list[str]) -> str:
    payload = {
        "iss": "https://sts.windows.net/test-tenant-id/",
        "sub": "test-user-id",
        "aud": "test-audience",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        "iat": datetime.now(timezone.utc),
        "groups": groups,
        "name": "Test User",
        "email": "testuser@example.com"
    }
    
    token = jwt.encode(payload, "secret", algorithm="HS256")
    return token


def create_forgerock_token(client_id: str) -> str:
    payload = {
        "iss": "https://forgerock.example.com",
        "sub": "test-user-id",
        "aud": "test-audience",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        "iat": datetime.now(timezone.utc),
        "client_id": client_id,
        "azp": client_id,
        "scope": "openid profile email",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    
    token = jwt.encode(payload, "secret", algorithm="HS256")
    return token


if __name__ == "__main__":
    print("=== Azure AD Token Examples ===\n")
    
    azure_token_valid = create_azure_ad_token(["Engineering-Team", "Admin-Group"])
    print("Valid Azure AD Token (with allowed groups):")
    print(f"Bearer {azure_token_valid}\n")
    
    azure_token_invalid = create_azure_ad_token(["Other-Team"])
    print("Invalid Azure AD Token (without allowed groups):")
    print(f"Bearer {azure_token_invalid}\n")
    
    print("\n=== ForgeRock Token Examples ===\n")
    
    forgerock_token_valid = create_forgerock_token("sample-client-id-12345")
    print("Valid ForgeRock Token (with correct client_id):")
    print(f"Bearer {forgerock_token_valid}\n")
    
    forgerock_token_invalid = create_forgerock_token("wrong-client-id")
    print("Invalid ForgeRock Token (with wrong client_id):")
    print(f"Bearer {forgerock_token_invalid}\n")
    
    print("\n=== Test Instructions ===")
    print("1. Start the server: uvicorn app.main.main:app --reload")
    print("2. Visit http://localhost:8000/docs for Swagger UI")
    print("3. Use the tokens above to test protected endpoints")
    print("4. Click 'Authorize' button and paste token (including 'Bearer ' prefix)")
