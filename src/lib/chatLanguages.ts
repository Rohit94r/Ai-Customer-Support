export const CHAT_LANGUAGES = [
  {
    code: "en-IN",
    shortCode: "en",
    label: "English",
    nativeLabel: "English",
    speechRecognitionCode: "en-IN",
    welcomeMessage: "Hi! How can I help you today?",
    inputPlaceholder: "Type a message",
    sendLabel: "Send",
    listeningLabel: "Listening...",
    microphoneUnavailable:
      "Voice input is not supported in this browser. Please type your message.",
    fallbackMessage: "Please contact our customer support for further assistance.",
  },
  {
    code: "hi-IN",
    shortCode: "hi",
    label: "Hindi",
    nativeLabel: "हिंदी",
    speechRecognitionCode: "hi-IN",
    welcomeMessage: "नमस्ते! मैं आपकी किस तरह मदद कर सकता हूँ?",
    inputPlaceholder: "अपना संदेश लिखें",
    sendLabel: "भेजें",
    listeningLabel: "सुन रहा हूँ...",
    microphoneUnavailable:
      "इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया अपना संदेश टाइप करें।",
    fallbackMessage: "कृपया अधिक सहायता के लिए हमारी ग्राहक सहायता टीम से संपर्क करें।",
  },
  {
    code: "mr-IN",
    shortCode: "mr",
    label: "Marathi",
    nativeLabel: "मराठी",
    speechRecognitionCode: "mr-IN",
    welcomeMessage: "नमस्कार! मी तुम्हाला कशी मदत करू शकतो?",
    inputPlaceholder: "तुमचा संदेश टाइप करा",
    sendLabel: "पाठवा",
    listeningLabel: "ऐकत आहे...",
    microphoneUnavailable:
      "या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही. कृपया तुमचा संदेश टाइप करा.",
    fallbackMessage:
      "कृपया पुढील मदतीसाठी आमच्या ग्राहक सहाय्य टीमशी संपर्क साधा.",
  },
  {
    code: "gu-IN",
    shortCode: "gu",
    label: "Gujarati",
    nativeLabel: "ગુજરાતી",
    speechRecognitionCode: "gu-IN",
    welcomeMessage: "નમસ્તે! હું તમારી કેવી રીતે મદદ કરી શકું?",
    inputPlaceholder: "તમારો સંદેશ લખો",
    sendLabel: "મોકલો",
    listeningLabel: "સાંભળી રહ્યું છે...",
    microphoneUnavailable:
      "આ બ્રાઉઝરમાં વોઇસ ઇનપુટ ઉપલબ્ધ નથી. કૃપા કરીને તમારો સંદેશ ટાઇપ કરો.",
    fallbackMessage:
      "વધુ સહાય માટે કૃપા કરીને અમારી ગ્રાહક સહાય ટીમનો સંપર્ક કરો.",
  },
] as const;

export type ChatLanguageCode = (typeof CHAT_LANGUAGES)[number]["code"];

export const DEFAULT_CHAT_LANGUAGE: ChatLanguageCode = "en-IN";

export function isSupportedLanguage(code: string): code is ChatLanguageCode {
  return CHAT_LANGUAGES.some((language) => language.code === code);
}

export function getLanguageConfig(code?: string) {
  return (
    CHAT_LANGUAGES.find((language) => language.code === code) ??
    CHAT_LANGUAGES.find((language) => language.code === DEFAULT_CHAT_LANGUAGE)!
  );
}
