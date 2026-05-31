import React, { useState } from "react";
import FALLACY_DEFINITIONS from "../fallacyDefinitions";

function FallacyTimeline({ analysis }) {
  const fallacies = analysis?.possible_fallacies || [];
  const [openMap, setOpenMap] = useState({});

  const toggle = (idx) => {
    setOpenMap((m) => ({ ...m, [idx]: !m[idx] }));
  };

  if (fallacies.length === 0) {
    return (
      <section className="card">
        <h3>Timeline</h3>
        <p>No fallacies detected</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h3>Timeline</h3>

      <div className="timeline-list">
        {fallacies.map((item, index) => {
          const severity =
            item.severity?.charAt(0).toUpperCase() +
              item.severity?.slice(1).toLowerCase() || "Low";

          const title = item.type || item.name || "Unknown fallacy";

          // Use canonical definition when available
          const canonical = FALLACY_DEFINITIONS[title] || null;

          const definition = canonical || item.explanation || "No definition provided.";

          // Sanitize timestamp display (handle 'null' string)
          const displayTimestamp = item.timestamp && item.timestamp !== "null" ? item.timestamp : null;

          // Paraphrased, non-quoted 'what happened' and concise 'why it's wrong'
          const lc = title.toLowerCase();
          const templates = {
            "ad hominem": {
              what: "The speaker attacks the person or character of their opponent instead of addressing the argument.",
              why: "Personal attacks do not engage with the argument's merits; they distract from evidence and reasoning."
            },
            "straw man": {
              what: "The speaker misrepresents the opponent's position, then argues against that weaker version.",
              why: "Refuting a distorted version of an argument does not address the original claim."
            },
            "slippery slope": {
              what: "The speaker claims that a small step will inevitably lead to extreme consequences without supporting evidence.",
              why: "Such causal chains require evidence; asserting inevitability is speculative and unsupported."
            },
            "false cause": {
              what: "The speaker treats a correlation or coincident event as if it proves causation.",
              why: "Correlation alone doesn't establish that one event caused the other; other explanations may exist."
            },
            "bandwagon": {
              what: "The speaker appeals to popularity or the number of supporters as proof the claim is true.",
              why: "Popularity is not evidence of truth; claims require independent reasons or data."
            },
            "appeal to authority": {
              what: "The speaker leans on a famous or powerful person's endorsement as proof outside their expertise.",
              why: "Authority is helpful only when the person is an expert in the relevant domain and evidence supports the claim."
            },
            "false dilemma": {
              what: "The speaker presents only two options, ignoring other viable possibilities.",
              why: "Framing the choice as binary can hide alternatives and oversimplify complex issues."
            },
            "circular reasoning": {
              what: "The speaker uses the conclusion as part of the premise, effectively assuming what they're trying to prove.",
              why: "This provides no independent support for the claim; it assumes its own truth."
            },
            "hasty generalization": {
              what: "The speaker draws a broad conclusion from a small or unrepresentative sample.",
              why: "Insufficient evidence can lead to unreliable generalizations that don't hold in the wider case."
            },
            "red herring": {
              what: "The speaker diverts the discussion to a different issue, avoiding the original point.",
              why: "Changing the subject prevents engagement with the argument at hand and obscures the real issue."
            },
            "appeal to emotion": {
              what: "The speaker appeals to feelings (fear, pity, anger) rather than providing evidence.",
              why: "Emotional appeals can persuade but do not substitute for logical reasons or supporting facts."
            },
            "tu quoque": {
              what: "The speaker deflects criticism by accusing the critic of similar faults instead of answering the critique.",
              why: "Pointing out hypocrisy doesn't address whether the original argument is valid."
            }
          };

          let whatHappened = "";
          let whyItsWrong = "";

          // Prefer developer-provided short context description
          if (item.contextDescription) {
            whatHappened = item.contextDescription;
          } else if (item.quote) {
            // Heuristic paraphrase from quote: avoid verbatim quoting, infer intent
            const q = String(item.quote).replace(/[“”"'…]+/g, "").trim().toLowerCase();
            if (/study|research|survey|data|found/.test(q)) {
              whatHappened = "The speaker appealed to a study or data, treating it as direct proof of a causal claim.";
            } else if (/should\b|must\b|we should|we must/.test(q)) {
              whatHappened = "The speaker urged a policy or action, presenting it as the only reasonable choice without adequate support.";
            } else if (/because\b|therefore\b|so (it|they)/.test(q)) {
              whatHappened = "The speaker presented a causal or consequential claim without offering sufficient evidence.";
            } else {
              whatHappened = templates[lc] ? templates[lc].what : (displayTimestamp ? `Around ${displayTimestamp}, the speaker made a move that fits this fallacy.` : `This segment contains behavior that fits the ${title} fallacy.`);
            }
          } else if (templates[lc]) {
            whatHappened = templates[lc].what;
            whyItsWrong = templates[lc].why;
          } else {
            whatHappened = displayTimestamp ? `Around ${displayTimestamp}, the speaker made a move that fits this fallacy.` : `This segment contains behavior that fits the ${title} fallacy.`;
          }

          if (!whyItsWrong) {
            if (item.explanation && item.explanation !== canonical) whyItsWrong = item.explanation;
            else whyItsWrong = `This is a logical error: ${canonical || "It is logically flawed."}`;
          }

          const isOpen = !!openMap[index];

          return (
            <div
              key={index}
              style={{
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              <div
                className="timeline-row"
                style={{ cursor: "default" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <strong style={{ fontSize: 14 }}>
                      {title}
                    </strong>

                    <span
                      style={{
                        fontSize: 12,
                        color: "#666",
                      }}
                    >
                      {displayTimestamp ? `• ${displayTimestamp}` : ""}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    className={`pill ${severity.toLowerCase()}`}
                  >
                    {severity}
                  </span>

                  <button
                    aria-expanded={isOpen}
                    onClick={() => toggle(index)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                    title={isOpen ? "Collapse" : "Expand"}
                  >
                    {isOpen ? "▾" : "▸"}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div
                  style={{
                    padding: 12,
                    background: "rgba(255,255,255,0.9)",
                    border:
                      "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <strong
                      style={{
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Definition of {title}
                    </strong>

                    <div
                      style={{
                        fontSize: 13,
                        color: "#222",
                      }}
                    >
                      {definition}
                    </div>
                  </div>

                  <div>
                    <strong
                      style={{
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      What happened
                    </strong>

                    <div
                      style={{
                        fontSize: 13,
                        color: "#333",
                        marginBottom: 8,
                      }}
                    >
                      {whatHappened}
                    </div>

                    <strong
                      style={{
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Why it's wrong
                    </strong>

                    <div
                      style={{
                        fontSize: 13,
                        color: "#333",
                      }}
                    >
                      {whyItsWrong}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FallacyTimeline;