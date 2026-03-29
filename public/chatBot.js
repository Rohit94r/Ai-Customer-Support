(function () {
   var scriptTag = document.currentScript;
   var scriptSrc = scriptTag && scriptTag.src ? new URL(scriptTag.src) : null;
   var baseOrigin = scriptSrc ? scriptSrc.origin : window.location.origin;
   var apiUrl = scriptTag.getAttribute("data-api-url") || baseOrigin + "/api/chat";
   var configUrl =
      scriptTag.getAttribute("data-config-url") || baseOrigin + "/api/widget";
   var ownerId = scriptTag.getAttribute("data-owner-id");

   if (!ownerId) {
      console.log("Owner ID is required for the chat bot to function.");
      return;
   }

   var LANGUAGE_CONFIGS = {
      "en-IN": {
         label: "English",
         nativeLabel: "English",
         placeholder: "Type a message",
         send: "Send",
         listening: "Listening...",
         voiceUnavailable:
            "Voice input is not supported in this browser. Please type your message.",
         welcome: "Hi! How can I help you today?",
      },
      "hi-IN": {
         label: "Hindi",
         nativeLabel: "हिंदी",
         placeholder: "अपना संदेश लिखें",
         send: "भेजें",
         listening: "सुन रहा हूँ...",
         voiceUnavailable:
            "इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया अपना संदेश टाइप करें।",
         welcome: "नमस्ते! मैं आपकी किस तरह मदद कर सकता हूँ?",
      },
      "mr-IN": {
         label: "Marathi",
         nativeLabel: "मराठी",
         placeholder: "तुमचा संदेश टाइप करा",
         send: "पाठवा",
         listening: "ऐकत आहे...",
         voiceUnavailable:
            "या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही. कृपया तुमचा संदेश टाइप करा.",
         welcome: "नमस्कार! मी तुम्हाला कशी मदत करू शकतो?",
      },
      "gu-IN": {
         label: "Gujarati",
         nativeLabel: "ગુજરાતી",
         placeholder: "તમારો સંદેશ લખો",
         send: "મોકલો",
         listening: "સાંભળી રહ્યું છે...",
         voiceUnavailable:
            "આ બ્રાઉઝરમાં વોઇસ ઇનપુટ ઉપલબ્ધ નથી. કૃપા કરીને તમારો સંદેશ ટાઇપ કરો.",
         welcome: "નમસ્તે! હું તમારી કેવી રીતે મદદ કરી શકું?",
      },
   };
   var FALLBACK_LANGUAGES = ["en-IN", "hi-IN", "mr-IN", "gu-IN"];
   var state = {
      businessName: "Apna AI",
      supportedLanguages: FALLBACK_LANGUAGES.slice(),
      selectedLanguage: "en-IN",
      recognition: null,
      isListening: false,
      configLoaded: false,
   };

   function getLanguage(languageCode) {
      return (
         LANGUAGE_CONFIGS[languageCode] || LANGUAGE_CONFIGS[state.selectedLanguage] || LANGUAGE_CONFIGS["en-IN"]
      );
   }

   function escapeHtml(text) {
      return String(text)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#39;");
   }

   function formatMessage(text) {
      return escapeHtml(text).replace(/\n/g, "<br>");
   }

   var button = document.createElement("button");
   button.type = "button";
   button.setAttribute("aria-label", "Open chat");
   button.innerHTML = "💬";
   Object.assign(button.style, {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      width: "58px",
      height: "58px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #111827, #000000)",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "24px",
      cursor: "pointer",
      zIndex: "999999",
      boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
      border: "none",
   });
   document.body.appendChild(button);

   var box = document.createElement("div");
   Object.assign(box.style, {
      position: "fixed",
      bottom: "94px",
      right: "24px",
      width: "360px",
      maxWidth: "calc(100vw - 24px)",
      height: "520px",
      maxHeight: "calc(100vh - 120px)",
      backgroundColor: "#fff",
      borderRadius: "20px",
      boxShadow: "0 25px 70px rgba(0,0,0,0.28)",
      zIndex: "999998",
      display: "none",
      overflow: "hidden",
      flexDirection: "column",
      fontFamily: "Inter, system-ui, sans-serif",
      border: "1px solid rgba(229, 231, 235, 0.95)",
   });

   box.innerHTML =
      '<div style="background:linear-gradient(135deg, #111827, #000000); color:#fff; padding:14px 16px; display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">' +
      '  <div style="min-width:0;">' +
      '    <div id="chat-title" style="font-size:15px; font-weight:700; line-height:1.2;">Apna AI</div>' +
      '    <div id="chat-subtitle" style="font-size:12px; opacity:0.75; margin-top:4px;">Smart support in your language</div>' +
      "  </div>" +
      '  <button id="chat-close" type="button" style="cursor:pointer; font-size:20px; line-height:1; color:#fff; background:none; border:none; padding:0 0 0 8px;">×</button>' +
      "</div>" +
      '<div style="padding:12px 12px 8px; border-bottom:1px solid #e5e7eb; background:#fff;">' +
      '  <div style="display:flex; gap:8px; align-items:center;">' +
      '    <label for="chat-language" style="font-size:12px; color:#4b5563; white-space:nowrap;">Language</label>' +
      '    <select id="chat-language" style="flex:1; padding:9px 10px; border:1px solid #d1d5db; border-radius:10px; font-size:13px; outline:none; background:#fff;"></select>' +
      "  </div>" +
      "</div>" +
      '<div id="chat-messages" style="flex:1; padding:14px 12px; overflow-y:auto; background:#f9fafb; display:flex; flex-direction:column;"></div>' +
      '<div style="padding:12px; border-top:1px solid #e5e7eb; background:#fff;">' +
      '  <div style="display:flex; gap:8px; align-items:flex-end;">' +
      '    <textarea id="chat-input" rows="1" style="flex:1; min-height:44px; max-height:110px; padding:11px 12px; border:1px solid #d1d5db; border-radius:12px; font-size:13px; outline:none; resize:none; line-height:1.4;" placeholder="Type a message"></textarea>' +
      '    <button id="chat-mic" type="button" style="width:44px; height:44px; border:1px solid #d1d5db; background:#fff; color:#111827; border-radius:12px; font-size:18px; cursor:pointer;">🎙️</button>' +
      '    <button id="chat-send" type="button" style="padding:0 14px; height:44px; border:none; background:#000; color:#fff; border-radius:12px; font-size:13px; cursor:pointer; font-weight:600;">Send</button>' +
      "  </div>" +
      '  <div id="chat-status" style="min-height:18px; margin-top:8px; font-size:12px; color:#6b7280;"></div>' +
      "</div>";

   document.body.appendChild(box);

   var closeButton = box.querySelector("#chat-close");
   var messageArea = box.querySelector("#chat-messages");
   var languageSelect = box.querySelector("#chat-language");
   var titleElement = box.querySelector("#chat-title");
   var input = box.querySelector("#chat-input");
   var sendButton = box.querySelector("#chat-send");
   var micButton = box.querySelector("#chat-mic");
   var statusElement = box.querySelector("#chat-status");

   function setStatus(text, isError) {
      statusElement.textContent = text || "";
      statusElement.style.color = isError ? "#dc2626" : "#6b7280";
   }

   function updateInputHeight() {
      input.style.height = "44px";
      input.style.height = Math.min(input.scrollHeight, 110) + "px";
   }

   function addMessage(text, from) {
      var bubble = document.createElement("div");
      bubble.innerHTML = formatMessage(text);
      Object.assign(bubble.style, {
         maxWidth: "82%",
         padding: "10px 12px",
         borderRadius: "16px",
         marginBottom: "8px",
         fontSize: "13px",
         lineHeight: "1.5",
         alignSelf: from === "user" ? "flex-end" : "flex-start",
         background: from === "user" ? "#111827" : "#e5e7eb",
         color: from === "user" ? "#fff" : "#111827",
         borderTopRightRadius: from === "user" ? "6px" : "16px",
         borderTopLeftRadius: from === "user" ? "16px" : "6px",
         whiteSpace: "normal",
         wordBreak: "break-word",
      });
      messageArea.appendChild(bubble);
      messageArea.scrollTop = messageArea.scrollHeight;
      return bubble;
   }

   function showTypingIndicator() {
      var bubble = document.createElement("div");
      bubble.id = "typing-indicator";
      bubble.innerHTML =
         '<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#999; margin:0 2px; animation:typing 1.4s infinite;"></span>' +
         '<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#999; margin:0 2px; animation:typing 1.4s infinite 0.2s;"></span>' +
         '<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#999; margin:0 2px; animation:typing 1.4s infinite 0.4s;"></span>';

      if (!document.querySelector("style[data-typing]")) {
         var style = document.createElement("style");
         style.setAttribute("data-typing", "true");
         style.innerHTML =
            "@keyframes typing {0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-8px); }}";
         document.head.appendChild(style);
      }

      Object.assign(bubble.style, {
         padding: "8px 12px",
         borderRadius: "14px",
         marginBottom: "8px",
         background: "#e5e7eb",
         alignSelf: "flex-start",
         display: "flex",
         alignItems: "center",
         height: "24px",
      });
      messageArea.appendChild(bubble);
      messageArea.scrollTop = messageArea.scrollHeight;
   }

   function removeTypingIndicator() {
      var typing = box.querySelector("#typing-indicator");
      if (typing) typing.remove();
   }

   function renderLanguageOptions() {
      languageSelect.innerHTML = "";

      state.supportedLanguages.forEach(function (languageCode) {
         var language = getLanguage(languageCode);
         var option = document.createElement("option");
         option.value = languageCode;
         option.textContent = language.label + " (" + language.nativeLabel + ")";
         languageSelect.appendChild(option);
      });

      if (state.supportedLanguages.indexOf(state.selectedLanguage) === -1) {
         state.selectedLanguage = state.supportedLanguages[0] || "en-IN";
      }

      languageSelect.value = state.selectedLanguage;
   }

   function updateLanguageUI() {
      var language = getLanguage(state.selectedLanguage);
      input.placeholder = language.placeholder;
      sendButton.textContent = language.send;
      micButton.title = "Voice input - " + language.label;

      if (!messageArea.children.length) {
         addMessage(language.welcome, "bot");
      }
   }

   function setListeningState(isListening) {
      state.isListening = isListening;
      micButton.style.background = isListening ? "#111827" : "#fff";
      micButton.style.color = isListening ? "#fff" : "#111827";
      micButton.style.borderColor = isListening ? "#111827" : "#d1d5db";
      setStatus(isListening ? getLanguage(state.selectedLanguage).listening : "", false);
   }

   function buildRecognition() {
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
         return null;
      }

      var recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = state.selectedLanguage;

      recognition.onstart = function () {
         setListeningState(true);
      };

      recognition.onresult = function (event) {
         var transcript = "";

         for (var i = event.resultIndex; i < event.results.length; i += 1) {
            transcript += event.results[i][0].transcript;
         }

         input.value = transcript.trim();
         updateInputHeight();
      };

      recognition.onerror = function () {
         setListeningState(false);
         setStatus(getLanguage(state.selectedLanguage).voiceUnavailable, true);
      };

      recognition.onend = function () {
         setListeningState(false);
      };

      return recognition;
   }

   function startVoiceInput() {
      if (!state.recognition) {
         state.recognition = buildRecognition();
      }

      if (!state.recognition) {
         setStatus(getLanguage(state.selectedLanguage).voiceUnavailable, true);
         return;
      }

      state.recognition.lang = state.selectedLanguage;

      if (state.isListening) {
         state.recognition.stop();
         return;
      }

      try {
         state.recognition.start();
      } catch {
         setStatus(getLanguage(state.selectedLanguage).voiceUnavailable, true);
      }
   }

   async function sendMessage() {
      var text = input.value.trim();

      if (!text) return;

      addMessage(text, "user");
      input.value = "";
      updateInputHeight();
      setStatus("", false);
      showTypingIndicator();

      try {
         var response = await fetch(apiUrl, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               message: text,
               ownerId: ownerId,
               language: state.selectedLanguage,
            }),
         });

         var data = await response.json();
         removeTypingIndicator();

         if (!response.ok) {
            addMessage(data.message || data.error || "Failed to get response", "bot");
            return;
         }

         addMessage(data.text || data.message || "No response", "bot");
      } catch {
         removeTypingIndicator();
         addMessage("Could not connect to server. Please try again.", "bot");
      }
   }

   async function loadWidgetConfig() {
      try {
         var response = await fetch(configUrl + "?ownerId=" + encodeURIComponent(ownerId));
         if (!response.ok) {
            throw new Error("Failed to load widget settings");
         }

         var data = await response.json();
         state.businessName = data.businessName || "Apna AI";
         state.supportedLanguages =
            Array.isArray(data.supportedLanguages) && data.supportedLanguages.length
               ? data.supportedLanguages.filter(function (languageCode) {
                    return !!LANGUAGE_CONFIGS[languageCode];
                 })
               : FALLBACK_LANGUAGES.slice();

         var storedLanguage = null;
         try {
            storedLanguage = window.localStorage.getItem("apna-ai-language-" + ownerId);
         } catch {
            storedLanguage = null;
         }

         state.selectedLanguage =
            (storedLanguage && state.supportedLanguages.indexOf(storedLanguage) !== -1 && storedLanguage) ||
            (data.defaultLanguage &&
               state.supportedLanguages.indexOf(data.defaultLanguage) !== -1 &&
               data.defaultLanguage) ||
            state.supportedLanguages[0] ||
            "en-IN";

         titleElement.textContent = state.businessName;
         renderLanguageOptions();
         updateLanguageUI();
         state.configLoaded = true;
      } catch {
         titleElement.textContent = state.businessName;
         renderLanguageOptions();
         updateLanguageUI();
      }
   }

   button.onclick = function () {
      box.style.display = box.style.display === "none" ? "flex" : "none";
      if (box.style.display === "flex" && !state.configLoaded) {
         loadWidgetConfig();
      }
   };

   closeButton.onclick = function () {
      box.style.display = "none";
      if (state.recognition && state.isListening) {
         state.recognition.stop();
      }
   };

   sendButton.onclick = sendMessage;
   micButton.onclick = startVoiceInput;

   languageSelect.onchange = function (event) {
      state.selectedLanguage = event.target.value;
      try {
         window.localStorage.setItem("apna-ai-language-" + ownerId, state.selectedLanguage);
      } catch {}
      if (state.recognition && state.isListening) {
         state.recognition.stop();
      }
      setStatus("", false);
      updateLanguageUI();
   };

   input.addEventListener("input", updateInputHeight);
   input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
         event.preventDefault();
         sendMessage();
      }
   });

   updateInputHeight();
   renderLanguageOptions();
   updateLanguageUI();
})();
