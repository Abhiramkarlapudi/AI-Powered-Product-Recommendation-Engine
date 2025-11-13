import React from 'react';

function Recommendations({ recommendations, isLoading, onClearRecommendations }) {

    const renderContent = () => {
        if (isLoading) {
            return <div className="loading-spinner">Loading recommendations...</div>;
        }

        if (recommendations.length === 0) {
            return <p>No recommendations yet. Click "Get Recommendations"!</p>;
        }

        return (
            <div className="recommendation-list">
                {recommendations.map((rec) => (
                    <div key={rec.product.id} className="recommendation-card">
                        <h4 className="product-name">{rec.product.name}</h4>
                        <p className="product-price">${rec.product.price}</p>
                        <p className="recommendation-explanation">
                            <strong>Why:</strong> {rec.explanation}
                        </p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="recommendations">
            <div className="recommendations-header">
                <h2>AI Recommendations</h2>
                {!isLoading && recommendations.length > 0 && (
                    <button onClick={onClearRecommendations} className="clear-recs-btn">
                        &times;
                    </button>
                )}
            </div>
            {renderContent()}
        </div>
    );
}

export default Recommendations;