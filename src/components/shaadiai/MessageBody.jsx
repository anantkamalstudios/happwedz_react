import React from "react";
import { FaMagic, FaMapMarkerAlt, FaTags, FaWallet } from "react-icons/fa";
import styles from "../pages/ShaadiAI.module.css";
import {
    PersonalityQuizInline,
    CultureBlenderInline,
    ConflictResolverInline,
    TimelineGeneratorInline,
    PersonalityQuizResult,
    CultureBlenderResult,
    ConflictResolverResult,
    TimelineGeneratorResult
} from "../pages/ChatFeatures";

const formatBudget = (amount) => {
    if (!amount) return "₹0";
    return `₹${Number(amount).toLocaleString('en-IN')}`;
};

const INLINE_FEATURES = {
    "personality-quiz": PersonalityQuizInline,
    "culture-blender": CultureBlenderInline,
    "conflict-resolver": ConflictResolverInline,
    "timeline-generator": TimelineGeneratorInline
};

const RESULT_FEATURES = {
    "personality-quiz": PersonalityQuizResult,
    "culture-blender": CultureBlenderResult,
    "conflict-resolver": ConflictResolverResult,
    "timeline-generator": TimelineGeneratorResult
};

// Everything an assistant reply can carry, drawn the same way wherever it
// appears: the summary text, then whichever of the structured payloads the
// backend attached to it.
//
// `compact` is for the 440px corner widget — the card grids collapse to one
// column and the comparison table stacks. The chrome around this (avatar,
// bubble, block layout) belongs to the surface, not here, because the page and
// the widget deliberately differ there.
const MessageBody = ({ msg, compact = false, onFeatureComplete }) => {
    const InlineFeature = msg.featureType && !msg.featureResult
        ? INLINE_FEATURES[msg.featureType]
        : null;
    const ResultFeature = msg.featureResult && msg.featureType
        ? RESULT_FEATURES[msg.featureType]
        : null;

    return (
        <div className={compact ? styles.compactBody : undefined}>
            <div className={styles.aiText}>
                {msg.content?.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                ))}
            </div>

            {InlineFeature && (
                <InlineFeature onComplete={(result) => onFeatureComplete(msg.featureType, result)} />
            )}

            {ResultFeature && <ResultFeature result={msg.featureResult} />}

            {msg.budget_breakdown && Object.keys(msg.budget_breakdown).length > 0 && (
                <div className={styles.budgetBreakdown}>
                    <div className={styles.budgetTitle}>
                        <FaWallet /> Budget Breakdown
                    </div>
                    <div className={styles.budgetGrid}>
                        {Object.entries(msg.budget_breakdown).map(([cat, amt]) => (
                            <div key={cat} className={styles.budgetItem}>
                                <span className={styles.budgetCategory}>{cat}</span>
                                <span className={styles.budgetAmount}>{formatBudget(amt)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {msg.vendors && msg.vendors.length > 0 && (
                <div className={styles.vendorsContainer}>
                    {msg.vendors.map((vendor, i) => (
                        <div
                            key={i}
                            className={styles.vendorCard}
                            onClick={() => {
                                if (vendor.vendor_id) {
                                    window.location.href = `/details/info/${vendor.vendor_id}`;
                                }
                            }}
                            style={{ cursor: vendor.vendor_id ? 'pointer' : 'default' }}
                        >
                            <div className={styles.vendorHeader}>
                                <h4>{vendor.name}</h4>
                                <span className={styles.vendorCategory}>{vendor.category}</span>
                            </div>
                            <div className={styles.vendorDetails}>
                                <p><FaMapMarkerAlt /> {vendor.location}</p>
                                <p className={styles.price}>{vendor.price_range}</p>
                            </div>
                            <div className={styles.vendorWhy}>
                                <FaTags /> <span>{vendor.why_recommended?.join(" • ")}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* The user's own orders, when they asked about them.
                Only the orders the answer is about appear here —
                showing all of them under a reply about one would
                contradict the text above. */}
            {msg.orders && msg.orders.length > 0 && (
                <div className={styles.ordersContainer}>
                    {msg.orders.map((order) => (
                        <div className={styles.orderCard} key={order.id}>
                            <div className={styles.orderTop}>
                                <span className={styles.orderInvoice}>
                                    Invoice #{order.invoice}
                                </span>
                                <span
                                    className={`${styles.orderStatus} ${
                                        styles["orderStatus" + String(order.status).replace(/\s/g, "")] || ""
                                    }`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <ul className={styles.orderItems}>
                                {order.items.map((item, k) => (
                                    <li key={item.id || k}>
                                        {item.image && (
                                            <img src={item.image} alt="" loading="lazy" />
                                        )}
                                        <span className={styles.orderItemTitle}>
                                            {item.title}
                                        </span>
                                        <span className={styles.orderItemQty}>
                                            ×{item.quantity}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.orderFoot}>
                                <span>{order.itemCount} item{order.itemCount === 1 ? "" : "s"}</span>
                                <strong>₹{Number(order.total).toLocaleString("en-IN")}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Store products. Unlike vendor cards these leave the
                site — the store is a separate app on its own domain,
                so each card is an <a target="_blank"> rather than a
                click handler that pushes a route. */}
            {msg.products && msg.products.length > 0 && (
                <div className={styles.productsContainer}>
                    {msg.products.map((product, i) => (
                        <a
                            key={product.id || i}
                            className={styles.productCard}
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className={styles.productThumb}>
                                {product.image
                                    ? <img src={product.image} alt={product.title} loading="lazy" />
                                    : <FaTags />}
                                {!product.inStock && (
                                    <span className={styles.productSoldOut}>Sold out</span>
                                )}
                            </div>
                            <div className={styles.productBody}>
                                <span className={styles.productCategory}>{product.category}</span>
                                <h4 className={styles.productTitle}>{product.title}</h4>
                                <div className={styles.productPrice}>
                                    <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
                                    {product.originalPrice > product.price && (
                                        <s>₹{Number(product.originalPrice).toLocaleString("en-IN")}</s>
                                    )}
                                </div>
                                {/* Why this was picked, when it was picked for a reason
                                    specific to this shopper. Only the first — the card is
                                    small, and the strongest reason is listed first. */}
                                {product.reasons?.length > 0 && (
                                    <span className={styles.productReason}>
                                        {product.reasons[0]}
                                    </span>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            )}

            {msg.comparisons && msg.comparisons.length > 0 && (
                <div className={styles.comparisonsContainer}>
                    <div className={styles.budgetTitle}>
                        <FaMagic /> Auto-Comparison
                    </div>
                    {msg.comparisons.map((comp, i) => (
                        <div key={i} className={styles.comparisonCard}>
                            <div className={styles.comparisonGrid}>
                                <div className={styles.compCol}>
                                    <h4>{comp.vendor_1.name}</h4>
                                    <p><strong>Price:</strong> {comp.vendor_1.price}</p>
                                    <p><strong>Capacity:</strong> {comp.vendor_1.capacity}</p>
                                    <p><strong>Setup:</strong> {comp.vendor_1.indoor_outdoor}</p>
                                </div>
                                <div className={styles.compVs}>VS</div>
                                <div className={styles.compCol}>
                                    <h4>{comp.vendor_2.name}</h4>
                                    <p><strong>Price:</strong> {comp.vendor_2.price}</p>
                                    <p><strong>Capacity:</strong> {comp.vendor_2.capacity}</p>
                                    <p><strong>Setup:</strong> {comp.vendor_2.indoor_outdoor}</p>
                                </div>
                            </div>
                            <div className={styles.compRecommendation}>
                                💡 {comp.recommendation}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {msg.suggestions && msg.suggestions.length > 0 && (
                <div className={styles.suggestionsContainer}>
                    {msg.suggestions.map((sug, i) => (
                        <div key={i} className={styles.suggestionAlert}>
                            ✨ {sug}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageBody;
