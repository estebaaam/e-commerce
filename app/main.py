from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import userRouter
from app.routers import productRouter
from app.routers import categoryRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(userRouter.router)
app.include_router(productRouter.router)
app.include_router(categoryRouter.router)

@app.get("/")
async def root():
    pass
