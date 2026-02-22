import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

export async function POST(req) {
  try {
    const { image, mode } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const etiquetas = {
      ligar: ["BARRA 🔥", "FRONTEO 😈", "ESTRELLA ⭐"],
      salvar: ["DESCARO ⚡", "DIRECTO 🎯", "GANCHO 🎣"],
      inteligente: ["SWAG 🧠", "CRACK 💎", "LOTE 🏔️"]
    };

    const prompts = {
      ligar: "Seducción nivel Charly Flow. Exceso de confianza, actitud de estrella, directo y picante. Hablas con propiedad, sabes que eres el premio. Usa términos como 'princesa' o 'mor' naturalitos. NO analices, suelta la barra con flow.",
      salvar: "Aperturas descaradas y directas. Cero miedo al éxito. Entra respondiendo historias con actitud de que no pierdes el tiempo o tirando datos/piropos inesperados con total seguridad. NO analices, ve al grano.",
      inteligente: "Flow de compositor callejero pero mente brillante. Inteligencia con 'swag'. Tiras un dato que la deje loca, pero con el tono del que está sobrado de lote. Inteligencia atractiva y callejera. NO des explicaciones de profesor."
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
      - "Tenes algo pegado en tu cara pegado... Mi mirada. 😏"
      - "Qué lástima que las historias solo duren 24 horas, ashh."
      - "Te la respondo porque con un like no hacemos nada"
      - "Te doy un 9/10... Porque falta uno como yo. "

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