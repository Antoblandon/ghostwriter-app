import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

export async function POST(req) {
  try {
    const { image, mode } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const etiquetas = {
      ligar: ["Vibe", "Directa", "Interés"],
      salvar: ["Rompehielo", "Humor", "Reset"],
      inteligente: ["Deep", "Crack", "Estrategia"]
    };

    const prompts = {
      ligar: "Seducción carismática y relajada colombiana. Tono juguetón, seguro pero respetuoso. Evita sonar arrogante o grosero. NO analices.",
      salvar: "Revivir charla con cero intensidad. Usa humor o comentarios casuales. NO analices.",
      inteligente: "Cerebro nivel crack pero con lenguaje de calle. Inteligencia sin esfuerzo. NO des explicaciones."
    };

    const systemPrompt = `
      INSTRUCCIÓN: Eres Ghostwriter AI. Das respuestas que tienen "chispa" colombiana, pero sonando como un caballero moderno, no como un grosero.
      
      REGLAS DE ORO (MODO LIGAR):
      1. JUGUETÓN, NO AGRESIVO: Puedes ser un poquito "retador" pero siempre con buena onda. 
      2. MENOS ES MÁS: Frases cortas, pero con sentido.
      3. VOCABULARIO EQUILIBRADO: Usa "parche", "de una", "me trama", "contame pues". 
      4. PROHIBIDO: No digas cosas negativas como "mucho visaje" o "dime algo que no sepa" a menos que la otra persona sea pesada.
      5. EJEMPLOS BUENOS: "Me trama el vibe", "Hágale, cuadremos pues", "Tan perdida, ¿qué cuenta pues?", "Esa es la actitud".
      
      ESTILO SELECCIONADO: ${prompts[mode]}

      RESPONDE ESTRICTAMENTE EN ESTE FORMATO JSON:
      {
        "opciones": [
          {"tipo": "${etiquetas[mode][0]}", "texto": "frase 1"},
          {"tipo": "${etiquetas[mode][1]}", "texto": "frase 2"},
          {"tipo": "${etiquetas[mode][2]}", "texto": "frase 3"}
        ]
      }
    `;

    const base64Data = image.split(",")[1];
    const imageParts = [{
      inlineData: { data: base64Data, mimeType: "image/png" }
    }];

    const result = await model.generateContent([systemPrompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Respuesta de IA inválida");

    return NextResponse.json(JSON.parse(jsonMatch[0]));

  } catch (error) {
    console.error("ERROR API:", error.message);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}