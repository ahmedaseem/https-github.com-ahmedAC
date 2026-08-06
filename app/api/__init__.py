from flask import Blueprint


api = Blueprint(
    "api",
    __name__
)


from . import country_routes
from . import city_routes
from . import business_routes
from . import tourism_routes
from . import product_routes
