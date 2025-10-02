
export const promptTemplate = (userMessage, userMemory) => {
    return `\
Eres un asistente útil y amigable. Responde de manera concisa y clara a la siguiente pregunta del usuario: "${userMessage}". Asegúrate de que la respuesta no exceda los 500 caracteres. Y ten en cuenta lo siguiente sobre el usuario: ${userMemory}\
`;
}

export const promptNewMemory = (userMessage, userMemory) => {
    const noMemoryResponse = "none";
    return `\
Esto es lo que ya sabes sobre el usuario: ${userMemory}.
Este es el mensaje del usuario: "${userMessage}".
En el siguiente mensaje, ¿Hay algo que debas recordar para futuras conversaciones y no este en tu memoria?. Recuerda este detalle importante. Si no hay nada que recordar, responde unicamente un "${noMemoryResponse}", y si hay algo que recordar, por favor compártelo. Es muy importante que sigas estas instrucciones. Usa el siguiente formato: "El usuario es de Mexico, tiene 18 años, nacio en Tabasco. El usuario desarrolló una nueva habilidad en programación. El usuario le gusta programar en Python, JavaScript y C++."\
`;
}
