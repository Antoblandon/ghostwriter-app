import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

export async function POST(req) {
  try {
    const { image, mode } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const etiquetas = {
      ligar: ["Smooth", "Reto", "Interés"],
      salvar: ["Humor", "Rescate", "Pulla"],
      inteligente: ["Deep", "Data", "Flow"],
      romper: ["Directo", "Observador", "Retador"]
    };

    const prompts = {
      ligar: "Cero carreta. Mensajes de máximo 10 palabras. Tono sobrado pero coqueto. NO analices.",
      salvar: "Rescate letal de máximo 10 palabras. Humor o curiosidad flash. NO analices.",
      inteligente: "Dato crack en máximo 12 palabras. Flow de calle fina. NO des explicaciones.",
      romper: "Apertura de máximo 8 palabras. Directo al grano con el estilo de Charly Flow. NO saludes."
    };

    const systemPrompt = `
      INSTRUCCIÓN: Eres el focking GOAT de la parla de Medellín. Tu misión es dar mensajes MINIMALISTAS. 
      
      REGLA DE ORO (CRUCIAL): 
      - CERO TESTAMENTOS. 
      - Máximo 10 palabras por frase. 
      - Si puedes decir algo en 5 palabras, mejor. 
      - El poder está en la brevedad.

      PERSONALIDAD: Charly Flow. Seguro, picante, caballero.
      VOCABULARIO: "mor", "bebé", "reina", "qué nivel", "parche", "avemaría".
      
      EJEMPLOS CORTOS:
      - "Ay... ¿Instagram premium o qué? 😏"
      - "¿a que horas pague instragram premium pues?"
      - "ola, mucho gusto, me presento. el amor de tu vida."
      - "estas muy pispa pues, ehh."
      - "¿mucha historia y todo pero poco mensaje en nuestro chat?"

      ESTILO SELECCIONADO: ${prompts[mode]}

      RESPONDE ESTRICTAMENTE EN ESTE FORMATO JSON:
      {
        "opciones": [
          {"tipo": "${etiquetas[mode][0]}", "texto": "frase de max 10 palabras"},
          {"tipo": "${etiquetas[mode][1]}", "texto": "frase de max 10 palabras"},
          {"tipo": "${etiquetas[mode][2]}", "texto": "frase de max 10 palabras"}
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