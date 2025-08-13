from rest_framework.routers import DefaultRouter
from .views import *




router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'reports', ReportViewSet)
router.register(r'documents',DocumentVS)
router.register(r'documentsHistory',DocumentHistoryVS)
router.register(r'approvalSteps',ApprovalStepVS)
router.register(r'notifications',NotificationVS)
router.register(r'users', UserVS, basename='user')
router.register(r'score-transactions', ScoreTransactionVS, basename='scoretransaction')
router.register(r'product', ProductVS, basename="product")


urlpatterns = router.urls
