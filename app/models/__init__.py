"""Database models registry."""

__all__ = [
    "Country",
    "City",
    "Business",
    "Tourism",
    "Product",
    "Project",
    "User",
    "UserRole",
    "UserStatus",
    "Role",
]


def __getattr__(name):
    if name == "Country":
        from .country import Country
        return Country
    if name == "City":
        from .city import City
        return City
    if name == "Business":
        from .business import Business
        return Business
    if name == "Tourism":
        from .tourism import Tourism
        return Tourism
    if name == "Product":
        from .product import Product
        return Product
    if name == "Project":
        from .project import Project
        return Project
    if name in {"User", "UserRole", "UserStatus"}:
        from .user import User, UserRole, UserStatus
        return {"User": User, "UserRole": UserRole, "UserStatus": UserStatus}[name]
    if name == "Role":
        from .role import Role
        return Role
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
