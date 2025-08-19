from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from rest_framework.response    import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, redirect
from .models import Rooms, Report
from .forms import ReportForm
from rest_framework import viewsets
from .serializers import RoomSerializer, ReportSerializer
from django.http import JsonResponse
import uuid
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.utils.timesince import timesince
from datetime import datetime

from App.models import Facility, Rooms


# Create your views here.
def index(request):
    return render(request,'static/main.html')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_reports(request):
    user = request.user
    reports = Report.objects.filter(user=user).order_by('-id')
    serializer = ReportSerializer(reports, many=True)
    return Response(serializer.data)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet = Wallet.objects.filter(user=request.user).first()  # либо get()
        user_points = wallet.points if wallet else 0

        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'role' : request.user.role,
            'points' : user_points,
            'is_Admin' : request.user.is_admin,
        })

class UserVS(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(['POST'])
def send_verification_code(request):
    """
    Принимает JSON {"email": "user@example.com"},
    шлёт на почту код.
    """
    ser = SendCodeSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    ser.save()
    return Response({"detail": "Код отправлен"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def verify_and_register(request):
    """
    Принимает JSON
    {
      "email": "...",
      "code": "123456",
      "username": "...",
      "password": "..."
    }
    — проверяет код и создаёт учётку.
    """
    ser = VerifyCodeSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    user = ser.save()
    return Response({"id": user.id, "username": user.username}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def create_lobby(request):
    name = request.data.get("name")
    rooms_raw = request.data.get("rooms")

    if not name or not rooms_raw:
        return Response({"error": "Name and rooms are required"}, status=status.HTTP_400_BAD_REQUEST)

    # создаём лобби
    facility = Facility.objects.create(name=name)

    # создаём комнаты
    rooms = [r.strip() for r in rooms_raw.split(",") if r.strip()]
    for room_name in rooms:
        Rooms.objects.create(name=room_name, facility=facility)

    return Response({"message": "Lobby created successfully"}, status=status.HTTP_201_CREATED)

class RoomViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Rooms.objects.all()
    serializer_class = RoomSerializer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class ProductVS(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
# Не рабочий Leaderboard. Берет points из user.
# class LeaderboardView(APIView):
#     def get(self, request):
#         users = User.objects.order_by('-points')[:10]
#         data = [
#             {
#                 "id": user.id,
#                 "name": user.FIO or user.username,
#                 "points": user.points
#             }
#             for user in users
#         ]
#         return Response(data)
    
class LeaderboardView(APIView):
    def get(self, request):
        users = User.objects.all()

        data = []
        for user in users:
            wallet = Wallet.objects.filter(user=user).first()
            points = wallet.points if wallet else 0
            data.append({
                "id": user.id,
                "name": getattr(user, "FIO", None) or user.username,
                "points": points
            })
        
        data_sorted = sorted(data, key = lambda x: x['points'], reverse=True)[:5]

        return Response(data_sorted)


class FacilityView(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    permission_classes = [IsAuthenticated]

class WalletView(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]

# Работает, но исправленная версия ниже.!!! на 193 строке 
'''
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def redeem_product(request, product_id):
#     product = Product.objects.get(id=product_id)
#     user = request.user
#     wallet = Wallet.objects.filter(user=user).first()
#     user_points = wallet.points if wallet else 0

#     if user_points < product.price:
#         return JsonResponse({'error':'Not enough points'}, status = 400)
    
#     wallet.points -= product.price
#     wallet.save()
    
#     code = str(uuid.uuid4())[:8]

#     Redeem.objects.create(user=user, product=product, code = code)

#     return JsonResponse({'success': True, 'remaining_points': wallet.points, 'code': code })
'''

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def redeem_product(request, product_id):
    user = request.user
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)

    wallet = Wallet.objects.filter(user=user).first()
    if not wallet:
        return JsonResponse({'error': 'Wallet not found'}, status=400)

    if wallet.points < product.price:
        return JsonResponse({'error': 'Not enough points'}, status=400)

    wallet.points -= product.price
    wallet.save()

    code = str(uuid.uuid4())[:8]
    Redeem.objects.create(user=user, product=product, code=code)

    return JsonResponse({'success': True, 'remaining_points': wallet.points, 'code': code})


class RecentActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        activities = []

        # Reports
        for r in Report.objects.filter(user=user).order_by('-id')[:5]:
            activities.append({
                'type': 'report',
                'title': r.description[:30],
                'points': 50,  
                'status': r.status,
                'date': timesince(r.created_at or r.pk and datetime.now()) + " ago"
            })

        # Redeems
        for redeem in Redeem.objects.filter(user=user).order_by('-id')[:5]:
            activities.append({
                'type': 'purchase',
                'title': f"Redeemed {redeem.product.label}",
                'points': -redeem.product.price,
                'status': 'redeemed',
                'date': timesince(redeem.redeem_date) + " ago"
            })



        # Сортируем по времени (новое сверху)
        activities.sort(key=lambda x: x['date'], reverse=False)

        return Response(activities[:10])