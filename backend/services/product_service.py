import json
import os
import config

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', config.DATA_PATH)


def get_products():
    """
    Loads and returns the list of products from the JSON file.
    """
    try:
        with open(DATA_FILE, 'r') as f:
            products = json.load(f)
        return products
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []
