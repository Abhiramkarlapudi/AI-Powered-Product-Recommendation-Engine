import os
import json
import random
from openai import OpenAI

try:
    api_key = os.environ["OPENROUTER_API_KEY"]
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key
    )
    MODEL_TO_USE = "kwaipilot/kat-coder-pro:free"
except Exception as e:
    client = None


def get_llm_recommendations(preferences, browsing_history, products):
    """
    This function builds a prompt, calls the OpenRouter LLM,
    and parses the response.
    If the 'client' is None, it will fall back to a mock response.
    """
    if not client:
        return _get_mock_recommendations(browsing_history, products)

    try:
        filtered_products = filter_products_for_prompt(products, preferences)
        products_json_string = json.dumps(filtered_products, indent=2)

        prompt = _create_recommendation_prompt(
            preferences, browsing_history, products_json_string)

        response = client.chat.completions.create(
            model=MODEL_TO_USE,
            messages=[
                {"role": "system", "content": "You are a helpful product recommendation assistant. You MUST respond in valid JSON."},
                {"role": "user", "content": prompt}
            ],
            extra_headers={
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "AI Recommender Project"
            }
        )

        raw_response_content = response.choices[0].message.content
        parsed_data = _parse_recommendation_response(raw_response_content)

        recommendations_with_details = []
        for rec in parsed_data.get("recommendations", []):
            product_id = rec.get("product_id")
            full_product = find_product_by_id(product_id, products)

            if full_product:
                recommendations_with_details.append({
                    "product": full_product,
                    "explanation": rec.get("explanation", "No explanation provided."),
                    "confidence_score": rec.get("confidence_score", 0)
                })

        return {
            "recommendations": recommendations_with_details,
            "count": len(recommendations_with_details)
        }

    except Exception as e:
        return _get_mock_recommendations(browsing_history, products)


def _create_recommendation_prompt(preferences, browsing_history, products_json_string):
    """
    Builds the text prompt to send to the LLM.
    """
    pref_str = (
        f"- Price Range: {preferences.get('priceRange', 'all')}\n"
        f"- Categories: {', '.join(preferences.get('categories', ['any']))}\n"
        f"- Brands: {', '.join(preferences.get('brands', ['any']))}\n"
    )
    hist_str = ", ".join(browsing_history) or "None"

    prompt = f"""
    You are an expert eCommerce recommendation engine.
    A user has provided their preferences, browsing history, and a product catalog.
    Your task is to recommend up to 3 products.

    **User Preferences:**
    {pref_str}

    **User Browsing History (by product_id):**
    {hist_str}

    **Available Product Catalog (JSON format):**
    {products_json_string}

    **Instructions:**
    1.  Analyze the user's preferences AND their browsing history.
    2.  Recommend 3 products from the catalog that best match the user's combined interests.
    3.  **Crucially, DO NOT recommend any product that is already in the browsing history.**
    4.  For each recommendation, provide a brief (1-sentence) explanation for *why* you chose it.
    5.  Provide a confidence_score (1-10) for how good you think the match is.

    **Required Output Format (JSON ONLY):**
    Return *only* a valid JSON object in this exact format:
    {{
      "recommendations": [
        {{
          "product_id": "prod_id_here",
          "explanation": "Your 1-sentence explanation here.",
          "confidence_score": 8
        }},
        ...
      ]
    }}
    """
    return prompt


def _parse_recommendation_response(raw_response_content):
    """
    Safely parses the JSON string from the LLM.
    """
    try:
        if raw_response_content.startswith("```json"):
            raw_response_content = raw_response_content[7:-3].strip()
        elif raw_response_content.startswith("```"):
            raw_response_content = raw_response_content[3:-3].strip()

        return json.loads(raw_response_content)
    except json.JSONDecodeError:
        return {"recommendations": []}

# --- Helper & Fallback Functions ---


def filter_products_for_prompt(products, preferences):
    categories = preferences.get('categories')
    if not categories:
        return products[:20]
    filtered = [p for p in products if p.get('category') in categories]
    return filtered[:20]


def find_product_by_id(product_id, products):
    for product in products:
        if product.get('id') == product_id:
            return product
    return None


def _get_mock_recommendations(browsing_history, products):
    history_ids = set(browsing_history)
    available_products = [
        p for p in products if p.get('id') not in history_ids]
    if not available_products:
        available_products = products
    num_to_recommend = min(len(available_products), 3)
    recommended_products = random.sample(available_products, num_to_recommend)
    recommendations_with_details = []
    for product in recommended_products:
        recommendations_with_details.append({
            "product": product,
            "explanation": f"This MOCK recommendation is a great fit!",
            "confidence_score": 8
        })
    return {
        "recommendations": recommendations_with_details,
        "count": len(recommendations_with_details)
    }
