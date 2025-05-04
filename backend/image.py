from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
import os
import shutil
from uuid import uuid4
from typing import Optional
from pathlib import Path
from PIL import Image as PILImage
from io import BytesIO

from database import get_db
from auth import get_current_user
import schemas

# Create router
router = APIRouter()

# Configure upload directory
UPLOAD_DIR = Path("uploads/images")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Allowed image extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif"}

# Maximum file size (5MB)
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def validate_image(file: UploadFile) -> bool:
    """Validate image file type and size"""
    # Check file extension
    file_ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""
    if file_ext not in ALLOWED_EXTENSIONS:
        return False
    
    return True


@router.post("/images/upload", response_model=schemas.ImageUpload)
async def upload_image(
    file: UploadFile = File(...),
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload an image file"""
    # Validate file size (FastAPI handles this automatically with File size limit)
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )
    
    # Validate image type
    if not validate_image(file):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Allowed formats: jpg, jpeg, png, gif"
        )
    
    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"{uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save the file
    try:
        # Read file content
        contents = await file.read()
        
        # Validate file size after reading
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds the limit of {MAX_FILE_SIZE // (1024 * 1024)}MB"
            )
        
        # Optionally resize/optimize the image
        img = PILImage.open(BytesIO(contents))
        
        # Save the image
        img.save(file_path)
        
        # Generate URL
        image_url = f"/uploads/images/{unique_filename}"
        
        return {"url": image_url}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )