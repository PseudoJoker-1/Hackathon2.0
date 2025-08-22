from rest_framework.routers import DefaultRouter
from .views import *




router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'reports', ReportViewSet)
router.register(r'users', UserVS, basename='user')
router.register(r'product', ProductVS, basename="product")
router.register(r'wallet',WalletView)
router.register(r'facility',FacilityViewSet)
router.register(r'organizations', OrganizationView)


urlpatterns = router.urls
