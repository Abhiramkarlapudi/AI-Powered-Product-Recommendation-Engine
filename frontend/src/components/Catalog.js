import React from 'react';

function Catalog({ filteredProducts, onProductClick }) {

    if (!filteredProducts) {
        return <div>Loading...</div>;
    }

    if (filteredProducts.length === 0) {
        return <div>No products match your filter.</div>;
    }

    return (
        <div className="catalog-container">
            <h2>Product Catalog</h2>
            <div className="product-grid">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="product-card"
                        onClick={() => onProductClick(product)}
                    >
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-price">${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Catalog;