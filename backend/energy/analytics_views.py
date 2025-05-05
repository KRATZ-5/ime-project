from django.db.models import Sum
from datetime import date
from django.http import JsonResponse
from django.http import JsonResponse
from django.db.models import Sum
from .models import ConsumptionRecord
from django.views.decorators.cache import cache_page

def timeseries(request):
    qs = ConsumptionRecord.objects.annotate(
        day=TruncDay('date')
    ).values('day').annotate(
        total=Sum('value')
    )

@cache_page(60 * 15)  # Кеш на 15 минут
def total_consumption(request):
    region_id = request.GET.get('region')
    date_from = request.GET.get('from')
    date_to = request.GET.get('to')
    qs = ConsumptionRecord.objects.all()
    if region_id:
        qs = qs.filter(region_id=region_id)
    if date_from and date_to:
        qs = qs.filter(date__range=[date_from, date_to])
    total = qs.aggregate(total=Sum('value'))['total'] or 0
    return JsonResponse({"total_consumption": total})
