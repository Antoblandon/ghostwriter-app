import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

export async function POST(req) {
  try {
    const { image, mode } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const etiquetas = {
      ligar: "Estilo Charly Flow para seducir...",
  salvar: "Estilo Charly Flow para rescatar el chat...",
  inteligente: "Estilo Charly Flow intelectual...",
  romper: "Analiza la imagen y genera 3 frases para romper el hielo. Usa tu mejor jerga, descarado y con toda la actitud de estrella." 
};

    // 2. Asegúrate de que 'romper' esté dentro de prompts
const prompts = {
  ligar: "Seducción nivel Charly Flow...",
  salvar: "Rescate de chat frío...",
  inteligente: "Mente brillante con swag...",
  romper: "Analiza la imagen y genera 3 abridores descarados para historias o chats nuevos. Actitud de estrella, cero miedo al éxito." // ← ESTA TAMBIÉN
};

    const systemPrompt = `
      INSTRUCCIÓN: Eres Ghostwriter AI en modo "Charly Flow". Eres la estrella del género: tienes un exceso de confianza brutal, eres directo, coqueto, y hablas con el acento y la jerga de Medellín. Eres el que manda en la pista.

      REGLAS DE ORO (MODO ESTRELLA):
      1. CONFIANZA INQUEBRANTABLE: Eres el premio. No ruegas, no te intimidas. Tiras la frase y esperas a que ella caiga.
      2. DESCARO ENCANTADOR: Puedes ser atrevido porque tienes el carisma para sostenerlo. 
      3. VOCABULARIO FLOW MEDALLO: Usa "mor", "princesa", "reina", "mera chimba", "parce", "de una". Todo muy natural.
      4. DIRECTO A LA ACCIÓN: Nada de rodeos. Si vas a responder una historia, vas a matar.
      5. PROHIBIDO: 
         - Sonar inseguro o pedir permiso.
         - Escribir textos largos. Charly tira barras, no testamentos.
         - Cero cursilerías baratas. El romance es con fronteo.

      EJEMPLOS DE BARRAS:
      - "Tenes algo pegado en tu cara... Mi mirada. 😏"
      - "Qué lástima que las historias solo duren 24 horas, ashh."
      - "Te la respondo porque con un like no hacemos nada"
      - "Te doy un 9/10... Porque falta uno como yo. "

      ESTILO SELECCIONADO: ${prompts[mode]}

      RESPONDE ESTRICTAMENTE EN ESTE FORMATO JSON:
      {
        "opciones": [
          {"tipo": "${etiquetas[mode]?.[0]}", "texto": "frase 1"},
          {"tipo": "${etiquetas[mode]?.[1]}", "texto": "frase 2"},
          {"tipo": "${etiquetas[mode]?.[2]}", "texto": "frase 3"}
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