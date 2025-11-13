import React from 'react';

function BrowsingHistory({ browsingHistory, products, onClearHistory }) {

    const historyProducts = browsingHistory.map(id => {
        return products.find(product => product.id === id);
    }).filter(Boolean);

    return (
        <div className="browsing-history">
            <h2>History</h2>

            {historyProducts.length > 0 ? (
                <>
                    <button onClick={onClearHistory} className="clear-btn">
                        Clear History
                    </button>
                    <ul className="history-list">
                        {historyProducts.map((product) => (
                            <li key={product.id} className="history-item">
                                {product.name}
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>Click on products to see them here.</p>
            )}
        </div>
    );
}

export default BrowsingHistory;