"""Модели данных энергопотребления.

Region         — полигон границ субъекта РФ
ConsumptionRecord — точка/агрегат потребления с привязкой к региону и дате
"""
from django.contrib.gis.db import models

class Region(models.Model):
    """Субъект Российской Федерации"""
    name = models.CharField(max_length=100)
    boundary = models.PolygonField(srid=4326)  # Геометрия границ

    def __str__(self):
        return self.name

class ConsumptionRecord(models.Model):
    """Запись расхода электроэнергии (точка или агрегат)."""
    CONSUMPTION_TYPES = [
        ('industrial', 'Промышленное'),
        ('residential', 'Бытовое'),
    ]
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    date = models.DateField()
    consumption_type = models.CharField(max_length=12, choices=CONSUMPTION_TYPES)
    value = models.FloatField()
    geom = models.PointField(srid=4326, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['consumption_type']),
        ]

    def __str__(self):
        return f'{self.region} {self.date} {self.value}'
