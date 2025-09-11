Offline/demo fallback:
If the Vertex AI or server endpoint is unavailable (or billing isn't enabled), the frontend uses a deterministic mock generator so the app still demos fully. Generated items are saved locally in the browser (LocalStorage) under "My Products".
