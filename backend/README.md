# IOMP Server

This is the backend for the IOMP MERN application. It provides REST endpoints that the frontend in `client/` expects.

Main routes (mounted under `/api/v1`):

- `POST /auth/register` - register new user (returns token + user)
- `POST /auth/login` - login (returns token + user)
- `POST /recommend/crop_suitability` - crop recommendation (expects N,P,K,temperature,humidity,ph,rainfall)
- `GET /forecast/price_distribution?crop=CropName` - returns price distribution and forecast
- `POST /analysis/profitability` - profitability analysis (user_crop, land_size, investment)
- `POST /diagnose/image_upload` - multipart upload for crop diagnosis (image + optional question)

Environment variables: see `.env.example`.

Run locally:

1. Copy `.env.example` to `.env` and set values.
2. npm install
3. npm run dev
