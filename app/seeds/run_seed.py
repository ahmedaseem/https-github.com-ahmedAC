"""
ASEM Global Platform
Global Database Seed Runner
"""

from app import create_app

from app.seeds.countries import seed_countries


def run():
    """
    Execute all database seed operations
    in the correct dependency order.
    """

    app = create_app()

    with app.app_context():

        print("=" * 60)
        print("ASEM Global Platform")
        print("Global Database Seed")
        print("=" * 60)

        print("\n[1/1] Countries")

        seed_countries()

        print("\n" + "=" * 60)
        print("Seed process completed successfully.")
        print("=" * 60)


if __name__ == "__main__":
    run()
