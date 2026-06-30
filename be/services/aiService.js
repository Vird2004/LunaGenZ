function buildPrompt(userInfo, retrievedData) {
  return `Act as a Gen-Z advisor.
Here is the user's information:
${JSON.stringify(userInfo, null, 2)}

Here is the retrieved context data:
${JSON.stringify(retrievedData, null, 2)}

Based on this information, provide advice.
You MUST return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "vibe": "a short gen-z slang description of the vibe",
  "summary": "a brief summary of the reading",
  "advice": "actionable advice in a gen-z tone"
}`;
}

module.exports = {
  buildPrompt
};
