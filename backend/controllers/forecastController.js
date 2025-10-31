// Simple forecast controller that returns mock monthly price distribution

exports.priceDistribution = async (req, res, next) => {
  try {
    const crop = req.query.crop || "Unknown";

    // Generate simple mock monthly series
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const base = 1000 + crop.length * 10;

    const min_prices = months.map((m, i) =>
      Math.round(base + Math.sin(i / 2) * 50 - 20)
    );
    const modal_prices = months.map((m, i) =>
      Math.round(base + Math.sin(i / 2) * 60)
    );
    const max_prices = months.map((m, i) =>
      Math.round(base + Math.sin(i / 2) * 80 + 20)
    );

    const current_avg = modal_prices[new Date().getMonth()];
    const predicted_avg = Math.round(
      current_avg * (1 + (Math.random() - 0.45) * 0.08)
    );
    const trend =
      predicted_avg > current_avg
        ? "up"
        : predicted_avg < current_avg
        ? "down"
        : "stable";

    res.json({
      crop,
      months,
      min_prices,
      modal_prices,
      max_prices,
      current_avg,
      predicted_avg,
      trend,
      insights: `The forecast for ${crop} indicates a ${trend} trend based on historical seasonality.`,
    });
  } catch (err) {
    next(err);
  }
};
