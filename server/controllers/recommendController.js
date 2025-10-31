// Simple placeholder logic for crop recommendation.
// In production this should call ML model or proper algorithm.

exports.cropSuitability = async (req, res, next) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

    // Basic input parse
    const inputs = {
      N: +N,
      P: +P,
      K: +K,
      temperature: +temperature,
      humidity: +humidity,
      ph: +ph,
      rainfall: +rainfall,
    };

    // Fake scoring: generate a few candidate crops and compute heuristic scores
    const candidates = [
      "Rice",
      "Wheat",
      "Maize",
      "Cotton",
      "Sugarcane",
      "Potato",
      "Tomato",
    ];

    const crops = candidates
      .map((name, idx) => {
        // deterministic pseudo score based on inputs and index
        const base = (inputs.N + inputs.P + inputs.K) / 3 || 0;
        const climate =
          (inputs.temperature || 25) * 0.3 +
          (inputs.humidity || 50) * 0.2 +
          (inputs.rainfall || 100) * 0.1;
        const phFactor = 7 - Math.abs((inputs.ph || 7) - 7);
        let score = Math.max(
          0,
          Math.min(
            100,
            Math.round(
              (base * 0.4 + climate * 0.4 + phFactor * 2 + (10 - idx)) % 100
            )
          )
        );
        return { name, score };
      })
      .sort((a, b) => b.score - a.score);

    const recommended = crops[0];

    res.json({
      recommended_crop: recommended.name,
      description: `${recommended.name} is recommended based on your soil and climate parameters.`,
      crops,
    });
  } catch (err) {
    next(err);
  }
};
