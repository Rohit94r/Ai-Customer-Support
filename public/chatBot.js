(function () {
   const scriptTag = document.currentScript;
   const scriptSrc = scriptTag && scriptTag.src ? new URL(scriptTag.src) : null;
   const apiUrl = scriptTag.getAttribute('data-api-url') || (scriptSrc ? `${scriptSrc.origin}/api/chat` : '/api/chat');
   const ownerId = scriptTag.getAttribute('data-owner-id');

   if (!ownerId) {
      console.log('Owner ID is required for the chat bot to function.');
      return;
   }
   const button = document.createElement("div")
   button.innerHTML = "💬"
   Object.assign(button.style, {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      backgroundColor: "#000",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "24px",
      cursor: "pointer",
      zIndex: "999999",
      boxShadow: "0 15px 40px rgba(0,0,0,0.35)"

   })
   document.body.appendChild(button);

   const box = document.createElement("div");
   Object.assign(box.style, {
      position: "fixed",
      bottom: "90px",
      right: "24px",
      width: "320px",
      height: "420px",
      backgroundColor: "#fff",
      borderRadius: "14px",
      boxShadow: "0 25px 60px rgba(0,0,0,0.28)",
      zIndex: "999998",
      display: "none",
      overflow: "hidden",
      flexDirection: "column",
      fontFamily: "Inter, system-ui, sans-serif"
   })

   box.innerHTML = `<div style="background:#000; color:#fff; padding:12px 14px; font-size:14px; display:flex; justify-content:space-between; align-items:center; height:40px; width:100%; box-sizing: border-box;">
  <span>Apna AI</span>
  <span id="chat-close" style="cursor:pointer; font-size:20px; font-weight:bold; line-height:1; padding:4px 8px; min-width:24px; text-align:center; user-select:none;">✕</span>
  </div>
  <div id="chat-messages" style="flex:1; padding:12px; overflow-y:auto; background:#f9fafb; display:flex; flex-direction:column;"></div>
  <div style="display:flex; border-top:1px solid #e5e7eb; padding:8px;">
  <input id="chat-input" type="text" style="flex:1; padding:8px 10px; border:1px solid #d1d5db; border-radius:8px; font-size:13px; outline:none;" placeholder="Type a message"/>
  <button id="chat-send" style="padding:8px 12px; border:none; background:#000; color:#fff; border-radius:8px; font-size:13px; cursor:pointer;">Send</button>
  </div>`

   document.body.appendChild(box);
   button.onclick=()=>{
      box.style.display=box.style.display==="none"?"flex":"none"

   }
   document.querySelector("#chat-close").onclick=()=>{
      box.style.display="none"
   }
   const messageArea = document.querySelector("#chat-messages");

   function addMessage(text,from){
      const bubble=document.createElement("div");
      bubble.innerHTML=text
      Object.assign(bubble.style,{
         maxWidth:"78%",
         padding:"8px 12px",
         borderRadius:"14px",
         marginBottom:"8px",
         fontSize:"13px",
         lineHeight:"1.4",
         alignSelf:from==="user"?"flex-end":"flex-start",
         background:from==="user"?"#000":"#e5e7eb",
         color:from==="user"?"#fff":"#111",
         borderTopRightRadius:from==="user"?"4px":"14px",
         borderTopLeftRadius:from==="user"?"14px":"4px",
      })
      messageArea.appendChild(bubble);
      messageArea.scrollTop=messageArea.scrollHeight;
      return bubble;
   }

   function showTypingIndicator(){
      const bubble=document.createElement("div");
      bubble.id="typing-indicator";
      bubble.innerHTML=`<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#999; margin:0 2px; animation:typing 1.4s infinite;"></span><span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#999; margin:0 2px; animation:typing 1.4s infinite 0.2s;"></span><span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#999; margin:0 2px; animation:typing 1.4s infinite 0.4s;"></span>`
      
      // Add animation keyframes if not already present
      if(!document.querySelector('style[data-typing]')){
         const style=document.createElement('style');
         style.setAttribute('data-typing','true');
         style.innerHTML=`
            @keyframes typing {
               0%, 60%, 100% { transform: translateY(0); }
               30% { transform: translateY(-8px); }
            }
         `;
         document.head.appendChild(style);
      }
      
      Object.assign(bubble.style,{
         padding:"8px 12px",
         borderRadius:"14px",
         marginBottom:"8px",
         background:"#e5e7eb",
         alignSelf:"flex-start",
         display:"flex",
         alignItems:"center",
         height:"24px"
      })
      messageArea.appendChild(bubble);
      messageArea.scrollTop=messageArea.scrollHeight;
   }

   function removeTypingIndicator(){
      const typing=document.querySelector('#typing-indicator');
      if(typing) typing.remove();
   }

   document.querySelector("#chat-send").onclick=async()=>{ 
      const input = document.querySelector("#chat-input");
      const text=input.value.trim();
      
      if(!text) return;
      
      addMessage(text,"user");
      input.value="";
      
      showTypingIndicator();
      
      try {
         const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               message: text,
               ownerId: ownerId
            })
         });
         
         const data = await response.json();
         removeTypingIndicator();
         
         if (!response.ok) {
            const errorMsg = data.message || data.error || "Failed to get response";
            addMessage(errorMsg, "bot");
            return;
         }
         
         addMessage(data.text || data.message || "No response", "bot");
      } catch (error) {
         removeTypingIndicator();
         console.error("Error sending message:", error);
         addMessage("Error: " + (error.message || "Could not connect to server"), "bot");
      }
   }
   
   // Allow sending message with Enter key
   document.querySelector("#chat-input").onkeypress=(e)=>{
      if(e.key==="Enter"){
         document.querySelector("#chat-send").click();
      }
   }


})()
