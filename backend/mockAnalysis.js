export const mockAnalysis = {
    argument_summary:
      "The argument claims that because taxes and unemployment both increased, taxes caused unemployment.",
    premises: [
      "Taxes increased last year.",
      "Unemployment increased last year."
    ],
    conclusion:
      "Higher taxes caused unemployment.",
    hidden_assumptions: [
      "No other economic factors caused unemployment.",
      "The timing of two events proves causation."
    ],
    possible_fallacies: [
      {
        name: "Correlation vs Causation",
        explanation:
          "The argument assumes that because two things happened together, one caused the other.",
        severity: "high"
      }
    ],
    reasoning_issues: [
      "The argument does not consider alternative explanations.",
      "It needs more evidence to prove causation."
    ],
    strongest_counterargument:
      "Unemployment may have increased because of other factors such as inflation, industry changes, interest rates, or global economic conditions.",
    steelman_version:
      "If evidence showed that tax increases directly reduced hiring or investment, then the argument would be stronger.",
    logic_score: {
      score: 35,
      explanation:
        "The argument has a possible causal claim, but the premises do not prove the conclusion."
    }
  };