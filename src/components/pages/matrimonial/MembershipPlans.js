// src/components/MembershipPlans.js
import React from "react";

const MembershipPlans = () => {
  const plans = [
    {
      id: 1,
      name: "Gold",
      price: "₹ 5,999",
      duration: "3 Months",
      features: [
        "Unlimited profile views",
        "Priority customer support",
        "Express Interest to 50 profiles/month",
        "View contact details directly",
        "Featured in search results",
      ],
    },
    {
      id: 2,
      name: "Platinum",
      price: "₹ 9,999",
      duration: "6 Months",
      features: [
        "All Gold features",
        "Express Interest to 100 profiles/month",
        "Profile highlighted in search",
        "Dedicated relationship manager",
        "Verified profile badge",
      ],
      popular: true,
    },
    {
      id: 3,
      name: "Diamond",
      price: "₹ 15,999",
      duration: "12 Months",
      features: [
        "All Platinum features",
        "Unlimited Express Interests",
        "Top placement in search results",
        "Personalized matchmaking service",
        "Profile boost every month",
      ],
    },
  ];

  return (
    <section className="membership-plans">
      <div className="container">
        <div className="section-header">
          <h2>Premium Membership Plans</h2>
          <p>Upgrade to connect with your matches faster</p>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              className={`plan-card ${plan.popular ? "popular" : ""}`}
              key={plan.id}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">{plan.price}</div>
              <div className="plan-duration">{plan.duration}</div>

              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              <button className="btn btn-select">Select Plan</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipPlans;
