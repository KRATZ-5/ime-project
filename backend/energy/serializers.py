from rest_framework_gis.serializers import GeoFeatureModelSerializer
from models import Region, ConsumptionRecord

class ConsumptionRecordSerializer(GeoFeatureModelSerializer):
    region = serializers.StringRelatedField()  # имя региона
    class Meta:
        model = ConsumptionRecord
        geo_field = 'geom'
        fields = ('id', 'region', 'date', 'consumption_type', 'value')

class RegionSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Region
        geo_field = 'boundary'
        fields = ('id', 'name')
