import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

export async function POST(req) {
  try {
    const { image, mode } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    // Definimos los nombres de las etiquetas según el modo
    const etiquetas = {
      ligar: ["Suave", "Directa", "Coqueta"],
      salvar: ["Ruptura de Hielo", "Humor", "Re-conexión"],
      inteligente: ["Análisis Pro", "Dato Crack", "Perspectiva"]
    };

    const prompts = {
      ligar: "Experto en seducción natural. Genera 3 mensajes cortos con flow. NO analices.",
      salvar: "Rescate de chat. Genera 3 mensajes creativos para reabrir la charla. NO analices.",
      inteligente: "Mente brillante. Genera 3 respuestas usando analogías de alto nivel (fractales, buffs, estrategia) pero en tono casual de chat. NO des explicaciones."
    };

    const systemPrompt = `
      INSTRUCCIÓN: Eres Ghostwriter AI. Tu misión es escribir mensajes exactos para enviar.
      REGLAS:
      1. NO analices el contexto ni des consejos.
      2. Solo entrega frases listas para copiar y pegar.
      3. Usa jerga de chat moderna (latina/española).
      
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