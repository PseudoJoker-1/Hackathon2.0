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
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'vacation_days_left': request.user.vacation_days_left,
            'role' : request.user.role,
            'points' : request.user.points,
            'is_Admin' : request.user.is_admin,
        })

class DocumentVS(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status','doc_type']
    search_fields = ['author__username']
    ordering_fields = ['create_date']
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class DocumentHistoryVS(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['document__author', 'status']
    search_fields = ['document__author__username']
    ordering_fields  = ['create_date', 'vacation_start_date']
    queryset = DocumentHistory.objects.all()
    serializer_class = DocumentHistorySer

class ApprovalStepVS(ModelViewSet):
    queryset = ApprovalStep.objects.all()
    serializer_class = ApprovalStepSer
    def get_queryset(self):
        return ApprovalStep.objects.filter(document__author=self.request.user)
    def perform_create(self, serializer):
        serializer.save(approver=self.request.user)

class NotificationVS(ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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

class ScoreTransactionVS(ModelViewSet):
    queryset = ScoreTransaction.objects.all()
    serializer_class = ScoreTransactionSerializer

    def get_queryset(self):
        user = self.request.user
        return ScoreTransaction.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProductVS(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    


class LeaderboardView(APIView):
    def get(self, request):
        users = User.objects.order_by('-points')[:10]
        data = [
            {
                "id": user.id,
                "name": user.FIO or user.username,
                "points": user.points
            }
            for user in users
        ]
        return Response(data)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def redeem_product(request, product_id):
    product = Product.objects.get(id=product_id)
    user = request.user

    if user.points < product.price:
        return JsonResponse({'error':'Not enough points'}, status = 400)
    
    user.points -= product.price
    user.save()
    
    code = str(uuid.uuid4())[:8]

    Redeem.objects.create(user=user, product=product, code = code)

    return JsonResponse({'success': True, 'remaining_points': user.points, 'code': code })


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