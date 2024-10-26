from sqlalchemy.orm import Session

from app.models import productModel
from app.schemas import productSchema

def get_product(db: Session, id: str):
    return db.query(productModel.Product).filter(productModel.Product.id == id).first()


def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(productModel.Product).offset(skip).limit(limit).all()


def create_product(db: Session, product: productSchema.ProductCreate):
    db_product = productModel.Product(nombre=product.nombre, descripcion=product.descripcion, precio=product.precio, imagen= product.imagen, existencias=product.existencias,ultima_actualizacion=product.ultima_actualizacion,id_categoria=product.id_categoria)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product