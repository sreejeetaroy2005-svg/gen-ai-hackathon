Offline/demo fallback:
If the Vertex AI or server endpoint is unavailable (or billing isn't enabled), the frontend uses a deterministic mock generator so the app still demos fully. Generated items are saved locally in the browser (LocalStorage) under "My Products".

ow your flow is:

Artisan submits story → gets saved in Firestore

Stories auto-load on every page refresh for all users.

Fully backed by Google Cloud Database (Firestore), free tier, no credit card.