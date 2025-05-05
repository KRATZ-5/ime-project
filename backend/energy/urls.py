from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConsumptionRecordViewSet

router = DefaultRouter()
router.register(r'consumption', ConsumptionRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
