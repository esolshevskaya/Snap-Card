import React, { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { addProduct } from "../store/productsSlice";
import { useNavigate } from "react-router-dom";
import "../assets/styles/CreateProductPage.css";

const CreateProductPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        author: ""
    });
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        image: ""
    });

    const validateForm = () => {
        const newErrors = {
            title: "",
            description: "",
            image: ""
        };

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        } else if (formData.title.trim().length < 2) {
            newErrors.title = "Title must be at least 2 characters long";
        } else if (formData.title.trim().length > 100) {
            newErrors.title = "Title must be less than 100 characters";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters long";
        } else if (formData.description.trim().length > 500) {
            newErrors.description = "Description must be less than 500 characters";
        }

        if (!formData.image.trim()) {
            newErrors.image = "Image URL is required";
        } else {
            try {
                new URL(formData.image);
                if (!formData.image.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                    newErrors.image = "Image URL must be a valid image file (jpg, png, gif, webp)";
                }
            } catch {
                newErrors.image = "Please enter a valid URL";
            }
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== "");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        dispatch(addProduct({
            id: Date.now().toString(),
            title: formData.title.trim(),
            description: formData.description.trim(),
            image: formData.image.trim(),
            liked: false,
            isCustom: true,
            isFromApi: false,
            category: "custom",
            author: formData.author.trim() || "User",
        }));

        alert("Card created successfully!");
        navigate("/products");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name } = e.target;
        if (formData[name as keyof typeof formData].trim()) {
            validateField(name as keyof typeof formData);
        }
    };

    const validateField = (fieldName: keyof typeof formData) => {
        const newErrors = { ...errors };

        switch (fieldName) {
            case "title":
                if (!formData.title.trim()) {
                    newErrors.title = "Title is required";
                } else if (formData.title.trim().length < 2) {
                    newErrors.title = "Title must be at least 2 characters long";
                } else if (formData.title.trim().length > 100) {
                    newErrors.title = "Title must be less than 100 characters";
                } else {
                    newErrors.title = "";
                }
                break;

            case "description":
                if (!formData.description.trim()) {
                    newErrors.description = "Description is required";
                } else if (formData.description.trim().length < 10) {
                    newErrors.description = "Description must be at least 10 characters long";
                } else if (formData.description.trim().length > 500) {
                    newErrors.description = "Description must be less than 500 characters";
                } else {
                    newErrors.description = "";
                }
                break;

            case "image":
                if (!formData.image.trim()) {
                    newErrors.image = "Image URL is required";
                } else {
                    try {
                        new URL(formData.image);
                        if (!formData.image.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                            newErrors.image = "Image URL must be a valid image file (jpg, png, gif, webp)";
                        } else {
                            newErrors.image = "";
                        }
                    } catch {
                        newErrors.image = "Please enter a valid URL";
                    }
                }
                break;
        }

        setErrors(newErrors);
    };

    const isFormValid = formData.title.trim() &&
        formData.description.trim() &&
        formData.image.trim() &&
        !errors.title &&
        !errors.description &&
        !errors.image;

    return (
        <div className="create-product-container">
            <div className="create-product-header">
                <button className="back-button" onClick={() => navigate("/products")}>
                    ← Back
                </button>
                <h1>Create New Card</h1>
            </div>

            <form onSubmit={handleSubmit} className="create-product-form">
                <div className="form-group">
                    <label htmlFor="title">Card Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder="Enter card title"
                        className={errors.title ? "error" : ""}
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        rows={4}
                        placeholder="Enter card description"
                        className={errors.description ? "error" : ""}
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Your name (optional)"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image URL *</label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder="https://example.com/image.jpg"
                        className={errors.image ? "error" : ""}
                    />
                    {errors.image && <span className="error-message">{errors.image}</span>}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={!isFormValid}
                >
                    Create Card
                </button>
            </form>
        </div>
    );
};

export default CreateProductPage;