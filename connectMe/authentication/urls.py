from django.contrib import admin
from django.urls import path,include
from .views import *
urlpatterns = [
    path('',login,name='login'),
    path('signup/',signup,name='signup'),
    path('accountsetup/',accountSettings,name='accountSettings'),
    path('otpAPI/',otpAPI.as_view(),name='otpAPI'),
    path('signupAPI/',signupAPI.as_view(),name='signupAPI'),
    path('loginAPI/',loginAPI.as_view(),name='loginAPI'),
    path('forgetPassword/',forgetPassword,name='forgetPassword'),
    
]
