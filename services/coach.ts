import type { AIAnalysis } from '../types';

/**
 * Generates a deterministic, template-based coaching suggestion from an AI analysis.
 * This is a mock service and does not call an external LLM.
 *
 * @param userPrompt The user's question (currently unused, for future extension).
 * @param analysis The AIAnalysis object to draw from.
 * @returns A string containing a concise coaching tip.
 */
export const getCoachSuggestion = (userPrompt: string, analysis: AIAnalysis | null): string => {
  if (!analysis) {
    return "I need an analysis to provide coaching. Please run an analysis on a session first.";
  }

  const { triggers, recommendations, suggestedGoal } = analysis;

  // Find the most confident trigger
  const mainTrigger = [...triggers].sort((a, b) => b.confidence - a.confidence)[0];
  
  // Pick one recommendation from each category
  const proactiveRec = recommendations.proactive[0] || "review proactive strategies";
  const environmentalRec = recommendations.environmental[0] || "consider environmental adjustments";
  const reactiveRec = recommendations.reactive[0] || "plan reactive responses";

  // Build the response string
  let response = `Based on the analysis, let's focus on the primary trigger: **${mainTrigger.label}** (with ${Math.round(mainTrigger.confidence * 100)}% confidence).\n\n`;
  
  response += `Here's a plan to support the student:\n\n`;
  response += `**1. Proactive:** Before the situation occurs, try to *${proactiveRec.toLowerCase()}*.\n`;
  response += `**2. Environmental:** To make the space more supportive, consider how you can *${environmentalRec.toLowerCase()}*.\n`;
  response += `**3. Reactive:** If the behavior happens, your planned response could be to *${reactiveRec.toLowerCase()}*.\n\n`;
  
  response += `This approach aligns with the suggested goal: "${suggestedGoal.statement}". Keep observing and logging to track progress!`;

  return response;
};
