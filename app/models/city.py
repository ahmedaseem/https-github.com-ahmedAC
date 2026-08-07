"""
ASEM Global Platform
City Model
"""

from app.extensions import db


class City(db.Model):

    __tablename__ = "cities"


    id = db.Column(
        db.Integer,
        primary_key=True
    )


    country_id = db.Column(
        db.Integer,
        db.ForeignKey("countries.id"),
        nullable=False,
        index=True
    )


    name = db.Column(
        db.String(100),
        nullable=False
    )


    code = db.Column(
        db.String(20)
    )


    description = db.Column(
        db.Text
    )


    image = db.Column(
        db.String(255)
    )


    latitude = db.Column(
        db.Float
    )


    longitude = db.Column(
        db.Float
    )


    population = db.Column(
        db.Integer
    )


    is_active = db.Column(
        db.Boolean,
        default=True
    )


    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )


    country = db.relationship(
        "Country",
        back_populates="cities"
    )


    businesses = db.relationship(
        "Business",
        back_populates="city",
        cascade="all, delete-orphan"
    )


    tourism_places = db.relationship(
        "Tourism",
        back_populates="city",
        cascade="all, delete-orphan"
    )


    def to_dict(self):

        return {
            "id": self.id,
            "country_id": self.country_id,
            "name": self.name,
            "code": self.code,
            "description": self.description,
            "image": self.image,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "population": self.population,
            "is_active": self.is_active
        }
