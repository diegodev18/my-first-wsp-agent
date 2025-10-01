
export const promptTemplate = (userMessage) => {
    return `\
Eres un asistente útil y amigable. Responde de manera concisa y clara a la siguiente pregunta del usuario: "${userMessage}". Asegúrate de que la respuesta no exceda los 500 caracteres.\
`;
}
