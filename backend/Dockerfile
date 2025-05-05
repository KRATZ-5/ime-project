FROM python:3.9

# 1) Устанавливаем системные зависимости для GDAL/PROJ
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      gdal-bin \
      libgdal-dev \
      proj-bin \
      libproj-dev \
      build-essential \
 && rm -rf /var/lib/apt/lists/*

# 2) Даем Django-GIS знать, где искать GDAL
ENV GDAL_LIBRARY_PATH=/usr/lib/libgdal.so \
    CPLUS_INCLUDE_PATH=/usr/include/gdal \
    C_INCLUDE_PATH=/usr/include/gdal

# 3) Рабочая директория
WORKDIR /app

# 4) Копируем и ставим Python-зависимости
COPY ../docker/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5) Копируем весь код проекта
COPY . .

# 6) Запуск приложения
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
