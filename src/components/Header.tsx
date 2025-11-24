import React from "react";
import { Link } from "react-router-dom";
import PlusIcon from "../assets/icons/PlusIcon";

const Header: React.FC = () => (
    <div className="header-container">
        <h1 className="header-title">SnapCard</h1>
        <div className="header-actions">
            <Link to="/create-product" className="create-button">
                <PlusIcon />
                New Card
            </Link>
        </div>
    </div>
);

export default Header;