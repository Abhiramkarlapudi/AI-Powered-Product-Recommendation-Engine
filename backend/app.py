from flask import Flask, jsonify, request
from flask_cors import CORS
import services.product_service
import services.llm_service
import config

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": "https://ai-product-recommender.netlify.app"
    }
})


@app.route('/api/products', methods=['GET'])
def get_all_products():
    """
    This endpoint serves the product list.
    """
    products = services.product_service.get_products()
    return jsonify(products)


@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """
    This endpoint will give AI recommendations.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    preferences = data.get('preferences', {})
    browsing_history = data.get('browsing_history', [])
    all_products = services.product_service.get_products()

    recommendations_data = services.llm_service.get_llm_recommendations(
        preferences,
        browsing_history,
        all_products
    )

    return jsonify(recommendations_data)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
