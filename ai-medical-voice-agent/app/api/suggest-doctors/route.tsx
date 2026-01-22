import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();

  if (!notes || typeof notes !== "string" || !notes.trim()) {
    return NextResponse.json(
      { error: "Notes are required to suggest doctors" },
      { status: 400 }
    );
  }

  const systemContent = JSON.stringify(AIDoctorAgents);

  try {
    // Using google/gemini-2.0-flash-exp:free - a reliable free model on OpenRouter
    // If this doesn't work, check OpenRouter privacy settings at https://openrouter.ai/settings/privacy
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        { role: "system", content: systemContent },
        {
          role: "user",
          content: `User Notes/Symptoms: ${notes}. From the above doctor list, Give the list of most suitable doctors based on the Notes/Symptoms and return ONLY the full doctor objects exactly as they appear in the list (unchanged) in pure JSON format. Do not add any extra fields or text.`,
        },
      ],
    });

    const rawContent = completion.choices[0]?.message?.content?.trim();

    if (!rawContent) {
      return NextResponse.json(
        { error: "Received empty response from model" },
        { status: 502 }
      );
    }

    const cleanedContent = rawContent.replace(/```json|```/g, "");

    let parsed;
    try {
      parsed = JSON.parse(cleanedContent);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown parse error";
      return NextResponse.json(
        { error: "Unable to parse model response", details: message },
        { status: 502 }
      );
    }

    if (!Array.isArray(parsed)) {
      return NextResponse.json(
        { error: "Model did not return a doctor list" },
        { status: 502 }
      );
    }

    return NextResponse.json({ doctors: parsed });
  } catch (e) {
    console.error("/api/suggest-doctors error", e);
    const status =
      typeof (e as any)?.status === "number" ? (e as any).status : 500;
    const message =
      (e as any)?.message ||
      (e as any)?.error ||
      (e as any)?.response?.data?.error ||
      "Unexpected error";
    const details =
      (e as any)?.response?.data?.details || (e as any)?.stack || undefined;

    return NextResponse.json({ error: message, details }, { status });
  }
}
