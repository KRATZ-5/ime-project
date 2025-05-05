from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import LoginViewSet, RegisterViewSet

router = DefaultRouter()
router.register(r'register', RegisterViewSet, basename='register')

urlpatterns = [
    path('login/', LoginViewSet.as_view({'post': 'create'}), name='login'),
] + router.urls