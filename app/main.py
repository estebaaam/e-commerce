from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import userRouter
from app.routers import productRouter
from app.routers import categoryRouter
from app.routers import cartRouter
from app.routers import orderRouter
from app.routers import cart_orderRouter
from app.routers import reviewRouter

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
app.include_router(cartRouter.router)
app.include_router(orderRouter.router)
app.include_router(cart_orderRouter.router)
app.include_router(reviewRouter.router)

@app.get("/")
async def root():
    pass
