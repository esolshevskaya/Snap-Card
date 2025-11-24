import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchProducts, setFilter } from "../store/productsSlice";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import "../assets/styles/products.css";

const ProductsPage: React.FC = () => {
    const { items, loading, filter } = useAppSelector(state => state.products);
    const dispatch = useAppDispatch();
    const [sortOrder, setSortOrder] = useState<"az" | "za" | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 12;

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    let filteredItems = filter === "all" ? items : items.filter(i => i.liked);

    if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (sortOrder === "az") {
        filteredItems = [...filteredItems].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "za") {
        filteredItems = [...filteredItems].sort((a, b) => b.title.localeCompare(a.title));
    }

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="products-container">
            <Header />

            <div className="products-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="search-input"
                    />
                </div>

                <div className="products-filters">
                    <button
                        className={`filter-btn ${filter === "all" ? "active" : ""}`}
                        onClick={() => {
                            dispatch(setFilter("all"));
                            setCurrentPage(1);
                        }}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${filter === "favorites" ? "active" : ""}`}
                        onClick={() => {
                            dispatch(setFilter("favorites"));
                            setCurrentPage(1);
                        }}
                    >
                        Favorites
                    </button>
                    <button
                        className={`filter-btn ${sortOrder === "az" ? "active" : ""}`}
                        onClick={() => {
                            setSortOrder(sortOrder === "az" ? null : "az");
                            setCurrentPage(1);
                        }}
                    >
                        A-Z
                    </button>
                    <button
                        className={`filter-btn ${sortOrder === "za" ? "active" : ""}`}
                        onClick={() => {
                            setSortOrder(sortOrder === "za" ? null : "za");
                            setCurrentPage(1);
                        }}
                    >
                        Z-A
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <div className="products-grid">
                        {currentItems.map(item => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="pagination-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductsPage;