import React, { useState, useEffect } from 'react';
import './styles/App.css';
import { getProducts, getRecommendations } from './services/api';

import Catalog from './components/Catalog';
import UserPreferences from './components/UserPreferences';
import Recommendations from './components/Recommendations';
import BrowsingHistory from './components/BrowsingHistory';

function App() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [preferences, setPreferences] = useState({
        priceRange: 'all',
        categories: [],
        brands: [],
    });
    const [browsingHistory, setBrowsingHistory] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            const productsData = await getProducts();
            setProducts(productsData);
            setFilteredProducts(productsData);
        };

        loadProducts();
    }, []);


    const handleProductClick = (product) => {
        if (!browsingHistory.includes(product.id)) {
            setBrowsingHistory(prevHistory => [...prevHistory, product.id]);
        }
    };

    const handleClearHistory = () => {
        setBrowsingHistory([]);
    };

    const handlePreferencesChange = (newPreferences) => {
        setPreferences(newPreferences);
    };

    const handleApplyFilter = () => {
        let tempProducts = [...products];

        const { priceRange } = preferences;
        if (priceRange !== 'all') {
            tempProducts = tempProducts.filter(product => {
                if (priceRange === '0-50') return product.price <= 50;
                if (priceRange === '50-100') return product.price > 50 && product.price <= 100;
                if (priceRange === '100+') return product.price > 100;
                return true;
            });
        }

        const { categories } = preferences;
        if (categories.length > 0) {
            tempProducts = tempProducts.filter(product =>
                categories.includes(product.category)
            );
        }

        setFilteredProducts(tempProducts);
    };

    const handleClearPreferences = () => {
        setPreferences({
            priceRange: 'all',
            categories: [],
            brands: [],
        });
        setFilteredProducts(products);
    };

    const handleClearRecommendations = () => {
        setRecommendations([]);
    };

    const handleGetRecommendations = async () => {
        setIsLoading(true);
        setRecommendations([]);

        const data = await getRecommendations(preferences, browsingHistory);

        setRecommendations(data.recommendations || []);
        setIsLoading(false);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>AI Product Recommender</h1>
            </header>

            <main className="App-main">
                <div className="left-panel">
                    <UserPreferences
                        products={products}
                        preferences={preferences}
                        onPreferencesChange={handlePreferencesChange}
                        onApplyFilter={handleApplyFilter}
                        onClearPreferences={handleClearPreferences}
                    />

                    <BrowsingHistory
                        products={products}
                        browsingHistory={browsingHistory}
                        onClearHistory={handleClearHistory}
                    />
                </div>

                <div className="center-panel">
                    <Catalog
                        filteredProducts={filteredProducts}
                        onProductClick={handleProductClick}
                    />
                </div>

                <div className="right-panel">
                    <button
                        onClick={handleGetRecommendations}
                        className="recommend-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Thinking...' : 'Get AI Recommendations'}
                    </button>

                    <Recommendations
                        recommendations={recommendations}
                        isLoading={isLoading}
                        onClearRecommendations={handleClearRecommendations}
                    />
                </div>
            </main>

        </div>
    );
}

export default App;