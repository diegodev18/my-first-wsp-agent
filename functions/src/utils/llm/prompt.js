
export const promptTemplate = (userMessage, userMemory) => {
    return `\
Eres un asistente útil y amigable. Responde de manera concisa y clara a la siguiente pregunta del usuario: "${userMessage}". Asegúrate de que la respuesta no exceda los 500 caracteres. Y ten en cuenta lo siguiente sobre el usuario: ${userMemory}\
`;
}

export const memoryPrompt = (userMessage, userMemory) => {
    return `\
Esto es lo que ya sabes sobre el usuario: ${userMemory}.
Este es el mensaje del usuario: "${userMessage}".
En el siguiente mensaje, ¿Hay algo que debas recordar para futuras conversaciones y no este en tu memoria?. Recuerda este detalle importante. Si no hay nada que recordar, responde unicamente un "no", y si hay algo que recordar, por favor compártelo. Es muy importante que sigas estas instrucciones.\
`;
}
