import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();

  const systemContent = JSON.stringify(AIDoctorAgents);
  //console.log("System role content:", systemContent);

  try {
    const completion = await openai.chat.completions.create({
      model: "alibaba/tongyi-deepresearch-30b-a3b:free",
      messages: [
        { role: "system", content: systemContent },
        {
          role: "user",
          content: `User Notes/Symptoms: ${notes}. From the above doctor list, Give the list of most suitable doctors based on the Notes/Symptoms and return ONLY the full doctor objects exactly as they appear in the list (unchanged) in pure JSON format. Do not add any extra fields or text.`,
        },
      ],
    });
    const rawResp = completion.choices[0].message;
    // @ts-expect-error - content might be null but we handle it
    const Resp = rawResp.content
      .trim()
      .replace("```json", "")
      .replace("```", "");
    const JSONResp = JSON.parse(Resp);
    return NextResponse.json(JSONResp);
  } catch (e) {
    return NextResponse.json(e);
  }
}
