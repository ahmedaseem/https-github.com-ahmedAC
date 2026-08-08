"""
ASEM Global Platform
Global Products Seeder
"""

import json
import os

from app.extensions import db
from app.models import Business, Product


BASE_DIR = os.path.dirname(__file__)
DATA_FILE = os.path.join(BASE_DIR, "data", "products.json")


BUSINESS_CODE_MAP = {
    "ASEM-PAR-001": "Paris Digital Studio",
    "ASEM-LON-001": "London Technology Hub",
    "ASEM-DXB-001": "Dubai Business Solutions",
    "ASEM-TYO-001": "Tokyo Innovation Center",
}


def seed_products():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    records = data.get("products", [])

    created = 0
    skipped = 0

    for item in records:
        business_code = item.get("business_code")

        business_name = BUSINESS_CODE_MAP.get(business_code)

        if not business_name:
            print(
                f"Product skipped - unknown business code: "
                f"{business_code}"
            )
            skipped += 1
            continue

        business = Business.query.filter_by(
            name=business_name
        ).first()

        if not business:
            print(
                f"Product skipped - business not found: "
                f"{business_name}"
            )
            skipped += 1
            continue

        sku = item.get("sku")

        exists = None

        if sku:
            exists = Product.query.filter_by(
                sku=sku
            ).first()

        if not exists:
            exists = Product.query.filter_by(
                business_id=business.id,
                name=item["name"]
            ).first()

        if exists:
            skipped += 1
            continue

        product = Product(
            business_id=business.id,
            name=item["name"],
            category=item["category"],
            description=item.get("description"),
            price=item.get("price"),
            currency=item.get("currency", "USD"),
            image=item.get("image"),
            gallery=item.get("gallery", []),
            stock=item.get("stock", 0),
            sku=sku,
            rating=item.get("rating", 0),
            is_available=item.get("is_available", True),
            is_active=item.get("is_active", True),
        )

        db.session.add(product)
        created += 1

    db.session.commit()

    print("Products imported:", created)
    print("Products skipped:", skipped)
