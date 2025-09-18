import Image from "next/image";
import { MenuItem } from "./Menu";

interface MenuCardProps {
    item: MenuItem;
    widthClass?: "sm" | "md" | "lg" | "xl";
    containerStyle?: React.CSSProperties;
    overlayStyle?: React.CSSProperties;
    priceTagStyle?: React.CSSProperties;
    nameStyle?: React.CSSProperties;
}

const MenuCard: React.FC<MenuCardProps> = ({
    item,
    widthClass = "sm",
    containerStyle = {},
    overlayStyle = {},
    priceTagStyle = {},
    nameStyle = {},
}) => {
    // Dynamically adjust sizing based on widthClass
    const aspectRatio = widthClass === "sm" ? "3/4" : "4/5";
    const priceFontSize =
        widthClass === "sm" ? "14px" : widthClass === "md" ? "16px" : "18px";
    const nameFontSize =
        widthClass === "sm" ? "1rem" : widthClass === "md" ? "1.125rem" : "1.5rem";

    const defaultContainerStyle: React.CSSProperties = {
        position: "relative",
        width: "100%",
        aspectRatio,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.3s",
        ...containerStyle,
    };

    const defaultOverlayStyle: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        background:
            "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2), transparent)",
        ...overlayStyle,
    };

    const defaultPriceTagStyle: React.CSSProperties = {
        display: "inline-block",
        padding: "3px 25px",
        fontSize: priceFontSize,
        borderRadius: "9999px",
        backgroundColor: "#AE9060",
        fontFamily: "var(--font-playfair)",
        margin: 0,
        ...priceTagStyle,
    };

    const defaultNameStyle: React.CSSProperties = {
        fontWeight: 600,
        fontSize: nameFontSize,
        marginTop: "8px",
        fontFamily: "var(--font-playfair)",
        ...nameStyle,
    };

    return (
        <div
            style={defaultContainerStyle}
            onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)")
            }
        >
            <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover" }} />
            <div style={defaultOverlayStyle} />
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    padding: "16px",
                    color: "white",
                }}
            >
                <p style={defaultPriceTagStyle}>${item.price.toFixed(2)}</p>
                <h3 style={defaultNameStyle}>{item.name}</h3>
            </div>
        </div>
    );
};

export { MenuCard };
