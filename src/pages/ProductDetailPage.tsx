import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { toggleLike, removeProduct, updateProduct } from "../store/productsSlice";
import HeartIcon from "../assets/icons/HeartIcon";
import EditIcon from "../assets/icons/EditIcon";
import TrashIcon from "../assets/icons/TrashIcon";
import CheckIcon from "../assets/icons/CheckIcon";
import CloseIcon from "../assets/icons/CloseIcon";
import "../assets/styles/ProductDetailPage.css";

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const product = useAppSelector(state => state.products.items.find(p => p.id === id));
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: product?.title || "",
        description: product?.description || "",
        image: product?.image || ""
    });

    if (!product) return <div className="product-not-found">Card not found</div>;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "/placeholder-image.svg";
        e.currentTarget.alt = "Image not available";
        e.currentTarget.className = "product-detail-image placeholder";
    };

    const handleSave = () => {
        dispatch(updateProduct({
            id: product.id,
            title: editData.title,
            description: editData.description,
            image: editData.image
        }));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({
            title: product.title,
            description: product.description,
            image: product.image
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        dispatch(removeProduct(product.id));
        navigate("/products");
    };

    return (
        <div className="product-detail-container">
            <button className="back-button" onClick={() => navigate("/products")}>
                ← Back to list
            </button>

            <div className="product-detail">
                <div className="product-detail-image-container">
                    <img
                        src={isEditing ? editData.image : product.image}
                        alt={isEditing ? editData.title : product.title}
                        className="product-detail-image"
                        onError={handleImageError}
                    />
                </div>

                <div className="product-detail-info">
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                                className="detail-edit-input title-input"
                                placeholder="Title"
                            />
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                                className="detail-edit-textarea"
                                placeholder="Description"
                                rows={6}
                            />
                            <div className="product-detail-meta">
                                <div className="product-meta-item">
                                    <strong>Image URL:</strong>
                                    <input
                                        type="text"
                                        value={editData.image}
                                        onChange={(e) => setEditData(prev => ({ ...prev, image: e.target.value }))}
                                        className="detail-edit-input image-input"
                                        placeholder="Image URL"
                                    />
                                </div>
                            </div>

                            <div className="product-detail-actions">
                                <button className="action-button cancel-button" onClick={handleCancel}>
                                    <CloseIcon className="action-icon" />
                                    Cancel
                                </button>
                                <button className="action-button save-button" onClick={handleSave}>
                                    <CheckIcon className="action-icon" />
                                    Save
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="product-detail-title">{product.title}</h1>
                            <p className="product-detail-description">{product.description}</p>

                            <div className="product-detail-icons">
                                <button
                                    className={`icon-button ${product.liked ? 'liked' : ''}`}
                                    onClick={() => dispatch(toggleLike(product.id))}
                                >
                                    <HeartIcon filled={product.liked} className="icon" />
                                </button>

                                <button
                                    className="icon-button"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <EditIcon className="icon" />
                                </button>

                                <button
                                    className="icon-button delete-button"
                                    onClick={handleDelete}
                                >
                                    <TrashIcon className="icon" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;