import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";

// Mock response for testing when API credits run out
const getMockDoctors = (symptom: string) => {
  const symptomLower = symptom.toLowerCase();

  // Map symptoms to relevant doctors
  if (symptomLower.includes("head") || symptomLower.includes("migraine")) {
    return [AIDoctorAgents[0]]; // General Physician
  }
  if (
    symptomLower.includes("skin") ||
    symptomLower.includes("rash") ||
    symptomLower.includes("acne")
  ) {
    return [AIDoctorAgents[2]]; // Dermatologist
  }
  if (symptomLower.includes("child") || symptomLower.includes("baby")) {
    return [AIDoctorAgents[1]]; // Pediatrician
  }
  if (
    symptomLower.includes("heart") ||
    symptomLower.includes("blood") ||
    symptomLower.includes("pressure")
  ) {
    return [AIDoctorAgents[5]]; // Cardiologist
  }
  if (
    symptomLower.includes("mental") ||
    symptomLower.includes("anxiety") ||
    symptomLower.includes("depression")
  ) {
    return [AIDoctorAgents[3]]; // Psychologist
  }
  if (
    symptomLower.includes("tooth") ||
    symptomLower.includes("dental") ||
    symptomLower.includes("gum")
  ) {
    return [AIDoctorAgents[9]]; // Dentist
  }
  if (
    symptomLower.includes("bone") ||
    symptomLower.includes("joint") ||
    symptomLower.includes("pain")
  ) {
    return [AIDoctorAgents[7]]; // Orthopedic
  }
  // Default: return first 2 doctors
  return [AIDoctorAgents[0], AIDoctorAgents[1]];
};

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();

    if (!notes || notes.trim().length === 0) {
      return NextResponse.json(
        { error: "Notes are required" },
        { status: 400 },
      );
    }

    const systemContent = `You are a medical advisor AI. Based on user symptoms, recommend the most suitable doctors from the provided list. Return ONLY a JSON array of doctor objects (no markdown, no extra text).

Available doctors:
${JSON.stringify(AIDoctorAgents, null, 2)}`;

    console.log("Calling OpenRouter API with notes:", notes);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemContent,
          },
          {
            role: "user",
            content: `User's symptoms/concerns: "${notes}"

Based on these symptoms, select the 1-3 most relevant doctors from the list above and return them as a JSON array. Return ONLY the JSON array, nothing else.`,
          },
        ],
        temperature: 0.5,
      });

      const rawResp = completion.choices[0].message;

      if (!rawResp || !rawResp.content) {
        console.error("Empty response from OpenRouter API");
        return NextResponse.json(
          { error: "No response from AI model" },
          { status: 500 },
        );
      }

      console.log("Raw response from API:", rawResp.content);

      // Clean up the response - remove markdown code blocks
      let jsonStr = rawResp.content
        .trim()
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .replace(/`/g, "")
        .trim();

      // Try to extract JSON array if it's wrapped in text
      if (!jsonStr.startsWith("[")) {
        const match = jsonStr.match(/\[[\s\S]*\]/);
        if (match) {
          jsonStr = match[0];
        } else {
          console.error("Could not extract JSON array from:", rawResp.content);
          return NextResponse.json(
            { error: "Invalid response format from AI model" },
            { status: 500 },
          );
        }
      }

      console.log("Cleaned JSON string:", jsonStr);

      let JSONResp;
      try {
        JSONResp = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Failed to parse:", jsonStr);
        return NextResponse.json(
          { error: "Failed to parse AI response as JSON" },
          { status: 500 },
        );
      }

      // Ensure response is an array
      if (!Array.isArray(JSONResp)) {
        console.error("Response is not an array:", JSONResp);
        // If it's a single object, wrap it in an array
        if (typeof JSONResp === "object" && JSONResp !== null) {
          JSONResp = [JSONResp];
        } else {
          return NextResponse.json(
            { error: "Response must be an array of doctors" },
            { status: 500 },
          );
        }
      }

      if (JSONResp.length === 0) {
        return NextResponse.json(
          { error: "No suitable doctors found for the given symptoms" },
          { status: 400 },
        );
      }

      console.log("Successfully returning doctors:", JSONResp.length);
      return NextResponse.json(JSONResp);
    } catch (apiError) {
      // If API fails due to credits or other issues, return mock data
      console.warn(
        "AI API failed, using mock data instead:",
        apiError instanceof Error ? apiError.message : String(apiError),
      );

      const mockDoctors = getMockDoctors(notes);
      console.log("Returning mock doctors:", mockDoctors.length);
      return NextResponse.json(mockDoctors);
    }
  } catch (error) {
    console.error("Error in suggest-doctors API:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Failed to suggest doctors",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
