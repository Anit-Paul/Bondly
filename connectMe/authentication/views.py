from django.shortcuts import render

def login(request):
    return render(request,'login.html')

def signup(request):
    return render(request,'signup.html')

def forgetPassword(request):
    return render(request,'forgetPassword.html')
