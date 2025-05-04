from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

import models, schemas
from auth import get_password_hash
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# User operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Post operations
def get_posts(db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None):
    logger.info(f"Executing get_posts: skip={skip}, limit={limit}, search={search}")
    query = db.query(models.Post)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Post.title.ilike(search_term),
                models.Post.content.ilike(search_term)
            )
        )
    
    posts = query.order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()
    logger.info(f"Retrieved {len(posts)} posts")
    for post in posts:
        if not post.author:
            logger.warning(f"Post {post.id} has no author")
    return posts

def get_post(db: Session, post_id: int):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post and not post.author:
        logger.warning(f"Post {post_id} has no author")
    return post

def create_post(db: Session, post: schemas.PostCreate, user_id: int):
    db_post = models.Post(**post.dict(), author_id=user_id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    if not db_post.author:
        logger.warning(f"Post {db_post.id} has no author")
    return db_post

def update_post(db: Session, post_id: int, post: schemas.PostUpdate):
    db_post = get_post(db, post_id=post_id)
    
    update_data = post.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_post, key, value)
    
    db.commit()
    db.refresh(db_post)
    if not db_post.author:
        logger.warning(f"Post {post_id} has no author")
    return db_post

def delete_post(db: Session, post_id: int):
    db_post = get_post(db, post_id=post_id)
    db.delete(db_post)
    db.commit()
    return db_post