// Profitability analysis controller - simplified calculations

exports.profitability = async (req, res, next) => {
  try {
    const { user_crop, land_size, investment } = req.body;
    const land = Number(land_size) || 0;
    const invest = Number(investment) || 0;

    // Fake recommended crop selection
    const recommended_crop = "Maize";

    // Mock parameters (per acre yields and price)
    const metrics = {
      [user_crop]: {
        yield_per_acre: 20,
        price_per_unit: 2000,
        cost_per_acre: 15000,
      },
      [recommended_crop]: {
        yield_per_acre: 25,
        price_per_unit: 1800,
        cost_per_acre: 12000,
      },
    };

    const user_metric = metrics[user_crop] || {
      yield_per_acre: 18,
      price_per_unit: 1500,
      cost_per_acre: 10000,
    };
    const rec_metric = metrics[recommended_crop];

    const user_revenue = Math.round(
      user_metric.yield_per_acre * land * user_metric.price_per_unit
    );
    const rec_revenue = Math.round(
      rec_metric.yield_per_acre * land * rec_metric.price_per_unit
    );

    const user_cost = Math.round(user_metric.cost_per_acre * land + invest);
    const rec_cost = Math.round(rec_metric.cost_per_acre * land + invest);

    const user_profit = user_revenue - user_cost;
    const rec_profit = rec_revenue - rec_cost;

    const revenue_diff = rec_revenue - user_revenue;
    const cost_diff = rec_cost - user_cost;
    const profit_diff = rec_profit - user_profit;

    const user_roi = user_cost > 0 ? (user_profit / user_cost) * 100 : 0;
    const rec_roi = rec_cost > 0 ? (rec_profit / rec_cost) * 100 : 0;

    const roi_diff = rec_roi - user_roi;

    res.json({
      user_crop,
      recommended_crop,
      user_revenue,
      recommended_revenue: rec_revenue,
      user_cost,
      recommended_cost: rec_cost,
      user_profit,
      recommended_profit: rec_profit,
      revenue_diff,
      cost_diff,
      profit_diff,
      user_roi,
      recommended_roi: rec_roi,
      roi_diff,
      recommendation:
        profit_diff > 0
          ? `Switching to ${recommended_crop} may improve profit by ₹${profit_diff}`
          : `Sticking with ${user_crop} appears comparable.`,
    });
  } catch (err) {
    next(err);
  }
};
