import os
import tempfile
import io
import pathlib
from typing import Optional

import torch
import torchaudio as ta
from chatterbox.tts_turbo import ChatterboxTurboTTS
import boto3
from botocore.exceptions import ClientError, NoCredentialsError

from fastapi import FastAPI, HTTPException, Security, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, Field

# 📁 Конфигурация S3/R2 — настройте здесь
R2_BUCKET_NAME = os.environ.get("R2_BUCKET_NAME", "voices")
R2_ENDPOINT_URL = os.environ.get("R2_ENDPOINT_URL", "http://localhost:9000")
R2_ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY_ID", "readwrite-user")
R2_SECRET_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "readwrite-secret")
R2_REGION = os.environ.get("AWS_REGION", "us-east-1")

# 🔑 API ключ для защиты (аналог CHATTERBOX_API_KEY)
CHATTERBOX_API_KEY = os.environ.get("CHATTERBOX_API_KEY", "secret-key")  # 🛑 ЗАМЕНИТЕ НА СВОЙ В ПРОДАКШЕ

# ----------------------------

# HTTP test
# curl -X POST "http://localhost:8000/generate" \
#   -H "Content-Type: application/json" \
#   -H "x-api-key: my-super-secret-key" \
#   -d '{
#     "prompt": "Hello is a test!",
#     "voice_key": "system/<voice-id>"
#   }' \
#   --output output.wav


class ChatterboxR2Local:
    def __init__(self, device: Optional[str] = None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        print(f"🔍 Используется устройство: {self.device}")

        # Загрузка модели
        self.model = ChatterboxTurboTTS.from_pretrained(device=self.device)

        # S3-клиент
        self.s3_client = boto3.client(
            's3',
            endpoint_url=R2_ENDPOINT_URL,
            aws_access_key_id=R2_ACCESS_KEY,
            aws_secret_access_key=R2_SECRET_KEY,
            region_name=R2_REGION,
        )
        print(f"📡 Подключено к S3/R2: {R2_BUCKET_NAME} @ {R2_ENDPOINT_URL}")

    def generate(
        self,
        prompt: str,
        voice_key: str,
        temperature: float = 0.8,
        top_p: float = 0.95,
        top_k: int = 1000,
        repetition_penalty: float = 1.2,
        norm_loudness: bool = True,
    ) -> bytes:
        """Загружает голос из S3 и генерирует TTS."""
        voice_buffer = io.BytesIO()

        try:
            self.s3_client.download_fileobj(
                Bucket=R2_BUCKET_NAME,
                Key=voice_key,
                Fileobj=voice_buffer
            )
        except (ClientError, NoCredentialsError) as e:
            raise FileNotFoundError(f"Голосовой промпт не найден в S3 по ключу '{voice_key}': {e}")

        voice_buffer.seek(0)
        if voice_buffer.getbuffer().nbytes == 0:
            raise ValueError(f"Файл '{voice_key}' пустой в S3")

        # Сохраняем во временный файл (так как модель требует путь к файлу)
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp:
            tmp.write(voice_buffer.read())
            tmp_path = tmp.name

        try:
            wav = self.model.generate(
                prompt,
                audio_prompt_path=tmp_path,
                temperature=temperature,
                top_p=top_p,
                top_k=top_k,
                repetition_penalty=repetition_penalty,
                norm_loudness=norm_loudness,
            )
        finally:
            os.unlink(tmp_path)

        # Сохраняем в буфер
        audio_buffer = io.BytesIO()
        ta.save(audio_buffer, wav, self.model.sr, format="wav")
        audio_buffer.seek(0)
        return audio_buffer.read()


# 🚀 FastAPI приложение
app = FastAPI(
    title="Chatterbox TTS (Local S3)",
    description="Локальный TTS с S3/R2-хранилищем и CUDA-ускорением",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔒 API ключ
api_key_scheme = APIKeyHeader(
    name="x-api-key",
    scheme_name="ApiKeyAuth",
    auto_error=False,
)

def verify_api_key(x_api_key: str | None = Security(api_key_scheme)):
    if not CHATTERBOX_API_KEY or x_api_key != CHATTERBOX_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return x_api_key


# 📥 Запрос от клиента
class TTSRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=5000)
    voice_key: str = Field(..., min_length=1, max_length=300)
    temperature: float = Field(default=0.8, ge=0.0, le=2.0)
    top_p: float = Field(default=0.95, ge=0.0, le=1.0)
    top_k: int = Field(default=1000, ge=1, le=10000)
    repetition_penalty: float = Field(default=1.2, ge=1.0, le=2.0)
    norm_loudness: bool = Field(default=True)


# 🧠 Инициализация (один раз при старте)
tts_engine = ChatterboxR2Local()


# 📡 Endpoint генерации
@app.post("/generate", responses={200: {"content": {"audio/wav": {}}}})
def generate_speech(request: TTSRequest):
    try:
        audio_bytes = tts_engine.generate(
            prompt=request.prompt,
            voice_key=request.voice_key,
            temperature=request.temperature,
            top_p=request.top_p,
            top_k=request.top_k,
            repetition_penalty=request.repetition_penalty,
            norm_loudness=request.norm_loudness,
        )
        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/wav",
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка генерации: {e}")


# 🧪 Локальный тест через CLI (аналог `@app.local_entrypoint`)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
