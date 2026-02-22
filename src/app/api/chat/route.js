import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

export async function POST(req) {
  try {
    const { image, mode } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    // Etiquetas ajustadas para que no suenen aburridas
    const etiquetas = {
      ligar: ["Relajada", "Directa", "Misterio"],
      salvar: ["Rompehielo", "Humor", "Reset"],
      inteligente: ["Deep", "Crack", "Estrategia"]
    };

    const prompts = {
      ligar: "Seducción minimalista paisa. Nada de exclamaciones exageradas ni halagos regalados. Tono relajado y con chispa. NO analices.",
      salvar: "Revivir charla con cero intensidad. Usa humor o comentarios casuales. NO analices.",
      inteligente: "Cerebro nivel crack pero con lenguaje de calle. Inteligencia sin esfuerzo. NO des explicaciones."
    };

    const systemPrompt = `
      INSTRUCCIÓN: Eres Ghostwriter AI, un parcero experto en comunicación de Medellín. Tu misión es dar respuestas que NO suenen urgidas ni de IA.
      
      REGLAS DE ORO (MODO LIGAR):
      1. MINIMALISMO: Máximo 8-10 palabras. Si puedes decir mucho con 4 palabras, mejor.
      2. CERO HALAGOS REGALADOS: Prohibido decir "qué belleza", "qué nota", "qué energía". Eso es de urgidos.
      3. PROHIBIDO EXCLAMACIONES: No uses "!", suenan muy emocionado. Usa puntos o deja la frase abierta.
      4. FLOW REAL: Usa frases como: "Hágale pues", "Mucho visaje con usted", "Cuándo el café entonces", "Me trama el vibe", "Se cotiza mucho o qué", "A qué le teme".
      5. FILTRO MÉXICO: Nada de "chido", "wey", "padre", "platicar".
      6. SIN CONSEJOS: Solo entrega las 3 frases listas para copiar.

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