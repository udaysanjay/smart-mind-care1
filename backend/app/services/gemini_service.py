import os
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.model_name = 'gemini-2.5-flash'
        self.client = None
        self.available = False
        self.init_error = None
        self.api_key = None
        self._initialize()

    def _initialize(self):
        # If the client is already successfully configured, skip initialization
        if self.client is not None:
            return
            
        self.api_key = os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY
        
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                self.available = True
                self.init_error = None
                logger.info("Gemini API Client initialized successfully.")
            except Exception as exc:
                self.init_error = str(exc)
                self.available = False
                logger.error(f"Failed to initialize Gemini API Client: {exc}")
        else:
            self.init_error = 'Gemini API key is not configured.'
            logger.error("GeminiService Initialization Failed: GEMINI_API_KEY is missing.")
        
    def _get_system_instruction(self, role: str) -> str:
        if role == "patient":
            return (
                "You are a compassionate, empathetic AI assistant for the MindCare platform. "
                "Your primary focus is stress management, anxiety relief, emotional wellbeing, "
                "sleep improvement, and mindfulness. "
                "IMPORTANT: You must always include the following disclaimer when appropriate, and clearly state: "
                "'I am an AI assistant and not a licensed psychologist.' "
                "If the user expresses thoughts of self-harm or severe distress, you MUST strongly advise them "
                "to contact a mental health professional or emergency services immediately."
            )
        elif role == "psychologist":
            return (
                "You are an AI clinical assistant for a licensed psychologist on the MindCare platform. "
                "You provide session preparation assistance, evidence-based mental health resources, "
                "therapy techniques, clinical note suggestions, and productivity support. "
                "IMPORTANT: You do not generate diagnoses and you do not replace professional clinical judgment. "
                "Keep your responses concise, professional, and tailored for a mental health practitioner."
            )
        else:
            return "You are a helpful AI assistant."

    def generate_response(self, user_message: str, user_role: str, chat_history: list) -> str:
        self._initialize()

        if not self.api_key:
            logger.error("Attempted to generate response but GEMINI_API_KEY is missing.")
            return "Error: Gemini API key is not configured on the server."

        if not self.available or self.client is None:
            logger.error(f"Attempted to generate response but client unavailable: {self.init_error}")
            return f"Error: Gemini client unavailable. {self.init_error}"
            
        try:
            from google.genai import types

            formatted_history = []
            for msg in chat_history:
                role = 'model' if msg.role == 'assistant' else 'user'
                formatted_history.append(
                    types.Content(
                        role=role,
                        parts=[types.Part.from_text(text=str(msg.message))]
                    )
                )
                
            config = types.GenerateContentConfig(system_instruction=self._get_system_instruction(user_role))
            
            try:
                chat = self.client.chats.create(
                    model=self.model_name,
                    config=config,  # type: ignore
                    history=formatted_history  # type: ignore
                )
                response = chat.send_message(user_message)
            except Exception as api_e:
                if "503" in str(api_e) or "UNAVAILABLE" in str(api_e) or "429" in str(api_e):
                    logger.warning("Gemini API overloaded. Falling back to gemini-1.5-flash...")
                    chat = self.client.chats.create(
                        model='gemini-1.5-flash',
                        config=config,  # type: ignore
                        history=formatted_history  # type: ignore
                    )
                    response = chat.send_message(user_message)
                else:
                    raise api_e
            
            response_text = getattr(response, "text", None)
            if response_text is None:
                response_text = str(response)
                
            return response_text
            
        except Exception as e:
            logger.error(f"Gemini API request failed: {e}")
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                return "I am currently receiving too many requests or the daily API quota has been reached. Please wait a little while and try again."
            return f"I'm sorry, I'm having trouble processing your request right now. Error: {error_str}"
            

# Module-level instance for use by endpoints
try:
    gemini_service = GeminiService()
except Exception as e:
    logger.error(f"Failed to instantiate GeminiService globally: {e}")
    gemini_service = None
