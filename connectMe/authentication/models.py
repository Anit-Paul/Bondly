from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

class MyUserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("User must have an email!")
        user = self.model(
            email=self.normalize_email(email),
            username=username
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        user = self.create_user(email, username, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class Interest(models.Model):
    name = models.CharField(max_length=50, unique=True)
    def __str__(self):
        return self.name

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=20)
    about = models.CharField(max_length=50, default="", blank=True)
    gender = models.CharField(max_length=10, default="", blank=True, null=True)
    dob = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='profile_images/photos', blank=True, null=True)
    banner = models.ImageField(upload_to='profile_images/banners', blank=True, null=True)
    interest = models.ManyToManyField(Interest, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username
