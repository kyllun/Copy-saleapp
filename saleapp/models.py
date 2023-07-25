from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from saleapp import db, app
from datetime import datetime
from flask_login import UserMixin
from enum import Enum as UserEnum

class BaseModel(db.Model):
    __abstract__ = True
    id = Column(Integer, primary_key=True, autoincrement=True)

class UserRole(UserEnum):
    ADMIN = 1
    USER = 2

class User(BaseModel, UserMixin):
    name = Column(String(50), nullable=False)
    username = Column(String(50), nullable=False, unique=True)
    password = Column(String(50), nullable=False)
    avatar = Column(String(100))
    email = Column(String(50))
    active = Column(Boolean, default=True)
    joined_date = Column(DateTime, default=datetime.now())
    user_role = Column(Enum(UserRole), default=UserRole.USER)
    receipts = relationship('Receipt', backref='user', lazy=True)
                                        #cho phép truy cập các Receipt tương ứng với một User
    comments = relationship('Comment', backref='user', lazy=True)
    def __str__(self):
        return self.name

class Category(BaseModel):
    __tablename__ = 'category'


    name = Column(String(20), nullable=False)
    products = relationship('Product', backref='category', lazy=True)

    def __str__(self):
        return self.name

class Product(BaseModel):
    __tablename__ = 'product'

    name = Column(String(50), nullable=False)
    description = Column(String(255))
    price = Column(Float, default=0)
    image = Column(String(100))
    active = Column(Boolean, default=True)
    created_date = Column(DateTime, default=datetime.now())
    category_id = Column(Integer, ForeignKey(Category.id), nullable=False)
    receipt_details = relationship('ReceiptDetail', backref='product', lazy=True)
    comments = relationship('Comment', backref='product', lazy=True)
                                        # 1 đối tượng product được đính kèm vào comments
    def __str__(self):
        return self.name

class Receipt(BaseModel): #bảng hoá đơn
    created_date = Column(DateTime, default=datetime.now())
    user_id = Column(Integer, ForeignKey(User.id), nullable=False)
    #Khi đối tượng Receipt được tạo ra, user_id của nó sẽ được tự động gán bằng giá trị id của đối tượng current_user.
    details = relationship('ReceiptDetail', backref='receipt', lazy=True)

class ReceiptDetail(db.Model): #bảng chi tiết hoá đơn
    receipt_id = Column(Integer, ForeignKey(Receipt.id), nullable=False, primary_key=True)
    product_id = Column(Integer, ForeignKey(Product.id), nullable=False, primary_key=True)
    quantity = Column(Integer, default=0)
    unit_price = Column(Float, default=0) #đơn giá

class Comment(BaseModel):
    content = Column(String(255), nullable=False)
    product_id = Column(Integer, ForeignKey(Product.id), nullable=False)
    user_id = Column(Integer, ForeignKey(User.id), nullable=False)
    created_date =Column(DateTime, default=datetime.now())

    def __str__(self):
        return self.content

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        # c1 = Category(name='Điện thoại')
        # c2 = Category(name='Máy tính bảng')
        # c3 = Category(name='Đồng hồ thông minh')
        # db.session.add(c1)
        # db.session.add(c2)
        # db.session.add(c3)
        # db.session.commit()

        # products = [{
        #       "id": 1,
        #       "name": "iPhone 7 Plus",
        #       "description": "Apple, 32GB, RAM: 3GB, iOS13",
        #       "price": 17000000,
        #       "image": "images/p1.png",
        #       "category_id": 1
        #     }, {
        #       "id": 2,
        #       "name": "iPad Pro 2020",
        #       "description": "Apple, 128GB, RAM: 6GB",
        #       "price": 37000000,
        #       "image": "images/p2.png",
        #       "category_id": 2
        #     }, {
        #       "id": 3,
        #       "name": "Galaxy Note 10 Plus",
        #       "description": "Samsung, 64GB, RAML: 6GB",
        #       "price": 24000000,
        #       "image": "images/p3.png",
        #       "category_id": 1
        #     }]
        #
        # for p in products:
        #     pro = Product(name=p['name'], price=p['price'], image=p['image'],
        #                   description=p['description'], category_id=p['category_id'])
        #     db.session.add(pro)
        #
        # db.session.commit()

