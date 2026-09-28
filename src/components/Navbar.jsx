import { Link, NavLink } from "react-router-dom";
import {
    Menu,
    X,
    ArrowLeft
} from "lucide-react";
import { useEffect, useState } from "react";

import siteConfig from "../config/site";

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {

        function handleScroll() {

            setScrolled(window.scrollY > 30);

        }

        window.addEventListener(
            "scroll",
            handleScroll
        );

        handleScroll();

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };

    }, []);

    return (
        <header
            className={`navbar ${
                scrolled ? "navbar-scrolled" : ""
            }`}
        >

            <div className="container navbar-container">

                {/* Logo */}

                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={() => setMenuOpen(false)}
                >

                    <span className="logo-mark">
                        N
                    </span>

                    <span className="navbar-brand">

                        <strong>
                            {siteConfig.name}
                        </strong>

                        <small>
                            {siteConfig.tagline}
                        </small>

                    </span>

                </Link>


                {/* Desktop Navigation */}

                <nav className="navbar-links">

                    {siteConfig.navigation.map(
                        (item) => (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `navbar-link ${
                                        isActive
                                            ? "active"
                                            : ""
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>

                        )
                    )}

                </nav>


                {/* CTA */}

                <Link
                    to="/contact"
                    className="btn btn-primary navbar-cta"
                >

                    ابدأ مشروعك

                    <ArrowLeft size={17} />

                </Link>


                {/* Mobile Button */}

                <button
                    className="navbar-menu-btn"
                    onClick={() =>
                        setMenuOpen(!menuOpen)
                    }
                    aria-label="فتح القائمة"
                    aria-expanded={menuOpen}
                >

                    {menuOpen ? (
                        <X size={25} />
                    ) : (
                        <Menu size={25} />
                    )}

                </button>

            </div>


            {/* Mobile Menu */}

            <div
                className={`mobile-menu ${
                    menuOpen
                        ? "mobile-menu-open"
                        : ""
                }`}
            >

                {siteConfig.navigation.map(
                    (item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >
                            {item.label}
                        </NavLink>

                    )
                )}


                <Link
                    to="/contact"
                    className="btn btn-primary mobile-menu-cta"
                    onClick={() =>
                        setMenuOpen(false)
                    }
                >

                    ابدأ مشروعك

                    <ArrowLeft size={17} />

                </Link>

            </div>

        </header>
    );
}

export default Navbar;