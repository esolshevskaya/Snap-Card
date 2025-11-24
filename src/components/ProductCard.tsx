import React, { useState } from "react";
import { Product } from "../types/Product";
import { useAppDispatch } from "../store/hooks";
import { toggleLike, removeProduct, updateProduct } from "../store/productsSlice";
import { useNavigate } from "react-router-dom";
import HeartIcon from "../assets/icons/HeartIcon";
import TrashIcon from "../assets/icons/TrashIcon";
import EditIcon from "../assets/icons/EditIcon";
import CheckIcon from "../assets/icons/CheckIcon";
import CloseIcon from "../assets/icons/CloseIcon";
import "../assets/styles/ProductCard.css";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: product.title,
        description: product.description,
        image: product.image
    });

    const handleCardClick = () => {
        if (!isEditing) {
            navigate(`/products/${product.id}`);
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "/placeholder-image.svg";
        e.currentTarget.alt = "Image is not found";
        e.currentTarget.className = "product-image placeholder";
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

    if (isEditing) {
        return (
            <div className="product-card editing">
                <div className="product-image-container">
                    <img
                        src={editData.image}
                        alt={editData.title}
                        className="product-image"
                        onError={handleImageError}
                    />
                </div>

                <div className="product-info">
                    <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                        className="edit-input"
                        placeholder="name"
                    />
                    <textarea
                        value={editData.description}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        className="edit-textarea"
                        placeholder="Description"
                        rows={3}
                    />
                    <input
                        type="text"
                        value={editData.image}
                        onChange={(e) => setEditData(prev => ({ ...prev, image: e.target.value }))}
                        className="edit-input"
                        placeholder="Link"
                    />
                </div>

                <div className="product-footer">
                    <div className="edit-actions">
                        <CloseIcon
                            className="icon close-icon"
                            onClick={handleCancel}
                        />
                        <CheckIcon
                            className="icon check-icon"
                            onClick={handleSave}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`product-card ${product.liked ? "liked" : ""}`}>
            <div className="product-image-container" onClick={handleCardClick}>
                <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                    onError={handleImageError}
                />
            </div>

            <div className="product-info" onClick={handleCardClick}>
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
            </div>

            <div className="product-footer">
                <div className="product-actions">
                    <HeartIcon
                        filled={product.liked}
                        className="icon heart-icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(toggleLike(product.id));
                        }}
                    />
                    <EditIcon
                        className="icon edit-icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
                    />
                    <TrashIcon
                        className="icon trash-icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeProduct(product.id));
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;