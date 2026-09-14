from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=120)
    department: str = Field(default="Marketing", max_length=80)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserPublic(BaseModel):
    id: str
    email: str
    name: str
    role: str
    department: str
    avatar: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class TextGenerateRequest(BaseModel):
    type: str = Field(..., description="Type de contenu marketing")
    product: str = Field(..., min_length=1, max_length=200)
    audience: str = Field(..., min_length=1, max_length=200)
    tone: str = Field(..., min_length=1, max_length=80)
    language: str = Field(default="Français", max_length=40)
    additional_context: str = Field(default="", max_length=4000)


class TextGenerateResponse(BaseModel):
    id: str
    content: str
    compliance_flags: list[str] = Field(default_factory=list)
    provider: str
    created_at: str


class HistoryItem(BaseModel):
    id: str
    type: str
    title: str
    content: str | None = None
    image_urls: list[str] = Field(default_factory=list)
    prompt: str | None = None
    params: dict = Field(default_factory=dict)
    created_at: str
    status: str = "completed"
