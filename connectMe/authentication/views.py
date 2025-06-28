from django.shortcuts import render
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate,login as django_login,logout as django_logout
from django.contrib.auth.models import update_last_login
from .mail import Mail



def accountSettings(request):
    return render(request,'index.html')

def login(request):
    return render(request,'login.html')

def signup(request):
    return render(request,'signup.html')

def forgetPassword(request):
    return render(request,'forgetPassword.html')

class signupAPI(APIView):
    def post(self,request):
        serializer=UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Data saved successfully"},status=status.HTTP_201_CREATED)
        else:
            return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        
    def get(self,request):
        users=User.objects.all()
        serializer=UserSerializer(users,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def patch(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"message": "Email is required to identify user."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Data updated successfully!"}, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class loginAPI(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({"message": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)
        if user:
            if user.is_active:
                django_login(request, user)
                update_last_login(None, user)  
                return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Account is inactive. Please verify or contact support."}, status=status.HTTP_403_FORBIDDEN)

        return Response({"message": "Login failed! Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class logoutAPI(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            django_logout(request)
            return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "User not logged in."}, status=status.HTTP_400_BAD_REQUEST)
        
class otpAPI(APIView):
    def post(self, request):
        email = request.data.get('email')
        check=request.data.get('check')
        if check:
            user = User.objects.get(email=email)
            return Response({"message": "Another user is already using this email"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            st, otp = Mail().send_email(email)
            if not st:
                return Response({"message": "Please enter a valid email!"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "Verification successful", "otp": otp}, status=status.HTTP_200_OK)

    