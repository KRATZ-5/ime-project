from rest_framework import viewsets, filters, permissions
from .models import ConsumptionRecord
from .serializers import ConsumptionRecordSerializer
from django_filters.rest_framework import DjangoFilterBackend

class ConsumptionRecordViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ConsumptionRecord.objects.select_related('region').all()
    serializer_class = ConsumptionRecordSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['region__id', 'consumption_type', 'date']
    ordering_fields = ['date', 'value']
    # кастомный фильтр по георадиусу
    def get_queryset(self):
        qs = super().get_queryset()
        lat = self.request.query_params.get('lat')
        lon = self.request.query_params.get('lon')
        radius = self.request.query_params.get('radius')  # в километрах
        if lat and lon and radius:
            from django.contrib.gis.geos import Point
            from django.contrib.gis.db.models import Distance
            center = Point(float(lon), float(lat), srid=4326)
            qs = qs.filter(geom__distance_lte=(center, float(radius) * 1000))
        return qs
