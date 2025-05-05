from csvvalidator import CSVValidator, datetime_string, number_range_inclusive, enumeration
import csv
from .models import ConsumptionRecord, Region

def validate_and_save_csv(path):
    field_names = ('region_name','date','type','value')
    validator = CSVValidator(field_names)
    validator.add_header_check('HDR','Неверный заголовок колонок')
    validator.add_record_length_check('LEN','Некорректное число столбцов')
    # Примеры правил валидации:
    validator.add_value_check('date', datetime_string('%Y-%m-%d'), 'DATE', 'Дата должна быть в формате ГГГГ-ММ-ДД')
    validator.add_value_check('value', number_range_inclusive(0, None, float), 'VAL', 'Значение должно быть неотрицательным числом')
    validator.add_value_check('type', enumeration('residential','industrial'), 'TYPE', 'Недопустимый тип потребления')
    # Проверка каждой записи (например, существуют ли регионы):
    def check_region_exists(rec):
        if not Region.objects.filter(name=rec['region_name']).exists():
            raise ValueError(f"Регион {rec['region_name']} не найден")
    validator.add_record_check(check_region_exists, 'REGION', 'Неизвестный регион')
    # Чтение и проверка
    with open(path, newline='') as f:
        data = csv.reader(f)
        problems = validator.validate(data)
        if problems:
            # Логируем или сохраняем информацию об ошибках
            for p in problems:
                print(f"Ошибка CSV: {p}")
            raise Exception("CSV validation failed")
        else:
            f.seek(0)
            next(data)  # пропустить заголовок
            for row in data:
                region_name, date_str, type_str, value_str = row
                region = Region.objects.get(name=region_name)
                ConsumptionRecord.objects.create(
                    region=region, date=date_str, consumption_type=type_str, value=float(value_str)
                )
