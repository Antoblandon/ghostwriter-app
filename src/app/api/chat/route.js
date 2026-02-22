import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

export async function POST(req) {
  try {
    const { image, mode } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    // Etiquetas para el JSON
    const etiquetas = {
      ligar: ["Suave", "Directa", "Coqueta"],
      salvar: ["Ruptura de Hielo", "Humor", "Re-conexión"],
      inteligente: ["Análisis Pro", "Dato Crack", "Perspectiva"]
    };

    const prompts = {
      ligar: "Experto en carisma y coqueteo colombiano. Genera 3 mensajes cortos con flow de parche. NO analices.",
      salvar: "Rescate de chat con ingenio colombiano. Genera 3 mensajes creativos para reabrir la charla. NO analices.",
      inteligente: "Mente brillante pero relajada. Genera 3 respuestas usando analogías de alto nivel (estrategia, psicología) con lenguaje casual colombiano. NO des explicaciones."
    };

    const systemPrompt = `
      INSTRUCCIÓN: Eres Ghostwriter AI, experto en comunicación de Medellín/Colombia. Tu misión es escribir mensajes listos para copiar y pegar.
      
      REGLAS DE ORO (CRUCIAL):
      1. PROHIBIDO usar palabras mexicanas como "chido", "wey", "padre", "no manches", "platicar".
      2. Usa lenguaje COLOMBIANO NATURAL: "parche", "plan", "bacano", "de una", "qué nota", "parce", "veámonos", "cuadremos".
      3. No seas forzado ni exagerado (evita el 'parce' en cada frase, busca que suene real).
      4. Solo entrega frases listas para enviar. NO analices el contexto.
      
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