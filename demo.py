import requests
import json

response = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",

  headers={
    "Authorization": "Bearer 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",
    "Content-Type": "application/json",
    "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
  },
    data=json.dumps({
    "model": "deepseek/deepseek-chat-v3-0324:free",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
    
  })

)


print(response.status_code)
print(response.headers)
print(response.text)