# код urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from energy import views as energy_views
from users import views as user_views



# schema_view = get_schema_view(
#    openapi.Info(title="Energy API", default_version='v1', description="Документация API"),
#    public=True,
#    permission_classes=(permissions.AllowAny,),
# )



router = routers.DefaultRouter()
router.register(r'consumption', energy_views.ConsumptionRecordViewSet, basename='consumption')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
    path('api/token/', user_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', user_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/docs/', energy_views.schema_view, name='api-docs'),
]


# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/energy/', include('energy.urls')),
#     path('api/users/', include('users.urls')),
#     path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
# ]
