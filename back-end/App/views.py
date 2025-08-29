# from django.shortcuts import render
# from rest_framework.viewsets import ModelViewSet
# from .models import *
# from .serializers import *
# from rest_framework.permissions import IsAuthenticated
# from django_filters.rest_framework import DjangoFilterBackend
# from rest_framework import filters, status
# from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework.response    import Response
# from rest_framework.views import APIView
# from django.shortcuts import get_object_or_404, redirect
# from .models import Rooms, Report
# from .forms import ReportForm
# from rest_framework import viewsets
# from .serializers import RoomSerializer, ReportSerializer
# from django.http import JsonResponse
# import uuid
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.decorators import api_view, permission_classes, action, api_view
# from django.utils.timesince import timesince
# from datetime import datetime
# from django.db.models import Prefetch
# from django.db import transaction
# from rest_framework import generics, permissions
# from .models import Facility, FacilityMembership

# from App.models import Facility, Rooms



# from django.shortcuts import render, get_object_or_404, redirect
# from django.http import JsonResponse
# from django.utils.timesince import timesince
# from datetime import datetime
# from django.db.models import Prefetch
# from django.db import transaction

# from rest_framework import viewsets, status, generics, permissions
# from rest_framework.viewsets import ModelViewSet
# from rest_framework.views import APIView
# from rest_framework.decorators import api_view, permission_classes, action
# from rest_framework.response import Response
# from rest_framework_simplejwt.views import TokenObtainPairView

# from .models import User, Wallet, Report, Product, Redeem, Facility, Rooms, FacilityMembership, Organization
# from .serializers import (
#     UserSerializer, RoomSerializer, ReportSerializer, ProductSerializer,
#     WalletSerializer, RedeemSerializer, FacilitySimpleSerializer,
#     FacilityListSerializer, FacilityCreateSerializer, OrganizationSerializer,
#     MyTokenObtainPairSerializer
# )

from datetime import datetime
import uuid

from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.utils.timesince import timesince
from django.db import transaction
from django.db.models import Prefetch

from rest_framework import viewsets, status, generics, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import (
    User, Wallet, Report, Product, Redeem, Facility, Rooms,
    FacilityMembership, Organization
)
from .serializers import (
    SendCodeSerializer, VerifyCodeSerializer, UserSerializer, RoomSerializer, ReportSerializer, ProductSerializer,
    WalletSerializer, RedeemSerializer, FacilitySimpleSerializer,
    FacilityListSerializer, FacilityCreateSerializer, OrganizationSerializer,
    MyTokenObtainPairSerializer
)
from .forms import ReportForm

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

class MyFacilitiesView(generics.ListAPIView):
    serializer_class = FacilitySimpleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Facility.objects.filter(memberships__user=user)



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

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_lobby(request):
    title = request.data.get("title") or request.data.get("name")
    rooms_raw = request.data.get("rooms")
    organization_id = request.data.get("organization_id")  

    if not title:
        return Response({"error": "title is required"}, status=status.HTTP_400_BAD_REQUEST)
    rooms_list: list[str] = []
    if isinstance(rooms_raw, list):
        rooms_list = [str(r).strip() for r in rooms_raw if str(r).strip()]
    elif isinstance(rooms_raw, str):
        rooms_list = [r.strip() for r in rooms_raw.split(",") if r.strip()]
    rooms_list = list(dict.fromkeys(rooms_list))

    with transaction.atomic():
        ser = FacilityCreateSerializer(
            data={"name": title, "organization_id": organization_id},
            context={"request": request},
        )
        ser.is_valid(raise_exception=True)
        facility: Facility = ser.save()

        if rooms_list:
            Rooms.objects.bulk_create(
                [Rooms(name=room_name, facility=facility) for room_name in rooms_list]
            )

    return Response(
        {
            "message": "Lobby created",
            "facility": {
                "id": str(facility.id),
                "title": facility.name,
                "is_organization": facility.organization_id is not None,
            },
            "rooms_created": len(rooms_list),
        },
        status=status.HTTP_201_CREATED,
    )
class RoomViewSet(viewsets.ModelViewSet):
    # добавлена сортировка при выборе фасилити будет отображать не все комнаты, а только те что связаны с фасилити
    permission_classes = [IsAuthenticated]
    queryset = Rooms.objects.all()
    serializer_class = RoomSerializer
    def get_queryset(self):
        user = self.request.user
        facility_id = self.request.query_params.get("facility_id")
        if facility_id:
            return Rooms.objects.filter(facility_id=facility_id)
        # return super().get_queryset()
        return Rooms.objects.none()

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    # def get_serializer_context(self):
    #     context = super().get_serializer_context()
    #     context['request'] = self.request
    #     return context

    def get_queryset(self):
        facility_id = self.request.query_params.get("facility_id")
        user = self.request.user
        query_set = Report.objects.all()
        if facility_id:
            query_set = query_set.filter(facility_id=facility_id)
        # return super().get_queryset()
        return query_set.order_by('-id')

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

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class FacilityViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Facility.objects.all()

    def get_queryset(self):
        qs = super().get_queryset().select_related("organization")
        if self.action in ("list", "mine"):
            prefetch_my = Prefetch(
                "memberships",
                queryset=FacilityMembership.objects.filter(user=self.request.user).only("role", "joined_at"),
                to_attr="my_membership",
            )
            qs = qs.prefetch_related(prefetch_my)
        return qs

    def get_serializer_class(self):
        if self.action in ("create",):
            return FacilityCreateSerializer
        return FacilityListSerializer

    @action(detail=False, methods=["get"])
    def mine(self, request):
        qs = self.get_queryset().filter(memberships__user=request.user).distinct()
        return Response(self.get_serializer(qs, many=True).data)
    
class OrganizationView(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    


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