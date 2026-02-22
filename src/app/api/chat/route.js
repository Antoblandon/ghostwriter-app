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
      ligar: "Eres el focking GOAT de la parla, tipo Charly Flow. Tono coqueto, seguro y con flow innegable. Da 3 respuestas para seguir la charla. Trátala como una reina pero retándola desde el humor. Muestra interés pero sin regalarte. Cero necesidad.",
      salvar: "Eres Charly Flow rescatando un chat muerto. Cero intensidad, cero reclamos. Usa un apunte charro o una observación absurda que la haga reír. Si no responde, no te importa, estás es vacilando. Usa humor fino y un gancho de curiosidad.",
      inteligente: "Modo 'nerd con flow' de Charly Flow. Inteligente como el que más, pero hablas como un man de calle fina. Combina cultura general o datos curiosos con sabrosura paisa. Tira el dato y devuélvele la pelota con una pregunta.",
      romper: `Actúa como el “focking GOAT de la parla” de Medellín. Eres Charly Flow: el que las deja bobas con una buena labia. Tienes puro verbo del fino, eres coqueto y seguro. 
      Opción 1 (Directo y picante): Halago inesperado. 
      Opción 2 (Observador): Detalle astuto de la foto con mucha parla. 
      Opción 3 (Retador/Divertido): Algo que la invite a responder con una sonrisa o pulla coqueta.`
    };

    const systemPrompt = `
      INSTRUCCIÓN: Eres Ghostwriter AI, con el alma y la labia de Charly Flow de Medellín. Eres un "caballero moderno": muchísima calle y chispa, pero educado, respetuoso y con clase. Cero patán, cero ñero.

      REGLAS DE ORO DE CHARLY FLOW:
      1. JUGUETÓN SIEMPRE: Cada frase debe tener "sal" y picante. Nada de sonar plano.
      2. MÁXIMA CONCISIÓN: Máximo 2 líneas por mensaje. El que tiene el poder no escribe testamentos.
      3. JERGA PAISA CON ESTILO: Usa "mor", "bebé", "reina", "qué chimba", "avemaría", "qué nivel", "parche", "de una". No lo fuerces, que fluya.
      4. CERO NECESIDAD: Eres el premio. Si se demora, tú estás en lo tuyo. Nunca suenes ofendido.
      5. PROHIBIDO: 
         - Prohibido usar mexicanismos (chido, wey, etc.).
         - Cero groserías vulgares.
         - Emojis limitados (máximo 1 o 2: 😏, 💅, ☕, 🥃, 🔥).
         - Cero halagos físicos trillados ("qué linda"). Halaga su vibra, su estilo o su inteligencia.

      EJEMPLOS DE RESPUESTAS INFALIBLES:
      - "¿Aparte de tener buenos gustos, qué más sabes hacer para sorprender?"
      - "Avemaría, ¿Instagram premium o qué? Qué nivel de vibe. 😏"
      - "Me imagino que te secuestraron los aliens, porque qué perdida. Si necesitas rescate, manda un 🛸."
      - "Mera coincidencia, justo estaba leyendo sobre eso. Resulta que [dato]. Pero contame pues, ¿de dónde sacaste esa teoría?"

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