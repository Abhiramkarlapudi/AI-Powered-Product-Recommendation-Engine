import React, { useMemo } from 'react';

function UserPreferences({
    products,
    preferences,
    onPreferencesChange,
    onApplyFilter,
    onClearPreferences
}) {

    const { categories } = useMemo(() => {
        const allCategories = new Set();
        products.forEach((product) => {
            allCategories.add(product.category)
        });
        return {
            categories: [...allCategories]
        };
    }, [products]);

    const handlePriceChange = (e) => {
        onPreferencesChange({
            ...preferences,
            priceRange: e.target.value,
        });
    };

    const handleCategoryChange = (e) => {
        const category = e.target.name;
        const isChecked = e.target.checked;
        const currentCategories = preferences.categories || [];
        let newCategories;
        if (isChecked) {
            newCategories = [...currentCategories, category];
        } else {
            newCategories = currentCategories.filter((c) => c !== category);
        }
        onPreferencesChange({
            ...preferences,
            categories: newCategories,
        });
    };

    return (
        <div className="user-preferences">
            <h2>Preferences</h2>

            <div className="form-group">
                <label>Price Range</label>
                <select value={preferences.priceRange} onChange={handlePriceChange}>
                    <option value="all">All</option>
                    <option value="0-50">$0 - $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100+">$100+</option>
                </select>
            </div>

            <div className="form-group">
                <label>Categories</label>
                <div className="checkbox-group">
                    {categories.map((category) => (
                        <label key={category}>
                            <input
                                type="checkbox"
                                name={category}
                                checked={preferences.categories.includes(category)}
                                onChange={handleCategoryChange}
                            />
                            {category}
                        </label>
                    ))}
                </div>
            </div>

            <div className="preference-buttons">
                <button onClick={onApplyFilter} className="apply-btn">
                    Apply
                </button>
                <button onClick={onClearPreferences} className="clear-prefs-btn">
                    Clear
                </button>
            </div>

        </div>
    );
}

export default UserPreferences;