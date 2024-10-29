from sqlalchemy.orm import Session

from app.models import productModel
from app.schemas import productSchema

def get_product(db: Session, id: int):
    return db.query(productModel.Product).filter(productModel.Product.id == id).first()


def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(productModel.Product).offset(skip).limit(limit).all()


def create_product(db: Session, product: productSchema.ProductCreate):
    db_product = productModel.Product(nombre=product.nombre, descripcion=product.descripcion, precio=product.precio, imagen= product.imagen, existencias=product.existencias,ultima_actualizacion=product.ultima_actualizacion,id_categoria=product.id_categoria)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, id: int, updated_product: productSchema.ProductCreate):
    db_product = db.query(productModel.Product).filter(productModel.Product.id == id).first()
    if not db_product:
        return None
    db_product.nombre = updated_product.nombre
    db_product.descripcion = updated_product.descripcion
    db_product.precio = updated_product.precio
    db_product.imagen = updated_product.imagen
    db_product.existencias = updated_product.existencias
    db_product.ultima_actualizacion = updated_product.ultima_actualizacion
    db_product.id_categoria = updated_product.id_categoria
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, id: int):
    db_product = db.query(productModel.Product).filter(productModel.Product.id == id).first()
    if not db_product:
        return None
    db.delete(db_product)
    db.commit()
    return db_product