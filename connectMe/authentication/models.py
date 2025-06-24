from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

class MyUserManager(BaseUserManager):
    def create_user(self,email,username,password):
        if not email:
            raise ValueError("User must have an email!")
        user=self.model(
            email=self.normalize_email(),
            username=username
        )
        user.set_password(password)
        user.save(using=self.__db)
        return user
    
    def create_superuser(self,email,username,password):
        user=self.create_user(self,email,username,password)
        user.is_admin=True
        user.is_superuser=True
        user.save(using=self.__db)
        return user

class Interest(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    
class User(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=20)
    about = models.CharField(max_length=50, default="", blank=True)
    gender = models.CharField(max_length=10, default="", blank=True)
    dob = models.DateField(null=True, blank=True)
    image=models.ImageField(upload_to='profile_images/', blank=True, null=True)
    banner=models.ImageField(upload_to='profile_images/', blank=True, null=True)
    interest = models.ManyToManyField(Interest, blank=True)
    is_active = models.BooleanField(default=True) 
    is_admin = models.BooleanField(default=False)
    
    objects=MyUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    
    def __str__(self):
        return self.username


