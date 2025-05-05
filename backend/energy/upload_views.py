from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from django.core.files.storage import FileSystemStorage
from .tasks import process_consumption_csv

class ConsumptionUploadView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [permissions.IsAdminUser]  # только админы
    def post(self, request, format=None):
        file_obj = request.FILES['file']
        # Сохранить временно файл
        fs = FileSystemStorage(location='/tmp')
        filename = fs.save(file_obj.name, file_obj)
        # Запустить фоновую задачу обработки CSV
        task = process_consumption_csv.delay(filename)
        return Response({"status": "accepted", "task_id": task.id})
