"""Celery tasks for energy app."""
import csv
from celery import shared_task
from csvvalidator import CSVValidator, datetime_string, number_range_inclusive, enumeration
from .models import Region, ConsumptionRecord

@shared_task
def process_consumption_csv(path):
    """Разбирает CSV-файл энергопотребления и сохраняет записи в БД.

    • Проводит строгую валидацию через CSVValidator
    • При ошибке — прерывает загрузку и пишет в лог
    • При успехе — создаёт объекты ConsumptionRecord
    """
    headers = ('region_name', 'date', 'consumption_type', 'value')
    validator = CSVValidator(headers)
    validator.add_header_check('HDR', 'Некорректные колонки')
    validator.add_record_length_check('LEN', 'Неверное число полей')
    validator.add_value_check('date', datetime_string('%Y-%m-%d'), 'DATE', 'Ожидался YYYY-MM-DD')
    validator.add_value_check('value', number_range_inclusive(0, None, float), 'VAL', 'value>=0')
    validator.add_value_check('consumption_type', enumeration('residential', 'industrial'),
                              'TYPE', 'invalid type')

    with open(path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        problems = validator.validate(reader)
        if problems:
            raise ValueError(f'CSV validation errors: {problems}')

        # если нет ошибок — снова читаем файл с начала
        csvfile.seek(0)
        next(reader)  # пропускаем заголовок
        for region_name, date_str, ctype, value in reader:
            region, _ = Region.objects.get_or_create(name=region_name)
            ConsumptionRecord.objects.create(region=region,
                                             date=date_str,
                                             consumption_type=ctype,
                                             value=float(value))
