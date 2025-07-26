"""
URL configuration for Hackathon project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from App import views
from App import appurls
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,

)
from App.views import LeaderboardView
from App.views import redeem_product
from App.views import RecentActivityView
from App.views import my_reports



urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.index,name='index'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/send-code/',     views.send_verification_code,   name='send_code'),
    path('api/verify-register/', views.verify_and_register,   name='verify_register'),
    path('api/me/', views.CurrentUserView.as_view()),
    path('api/leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('api/redeem/<int:product_id>/', redeem_product, name='redeem-product'),
    path('api/recent-activity/', RecentActivityView.as_view(), name='recent-activity'),
    path('api/my-reports/', my_reports, name='my-reports'),
    path('api/',include('App.appurls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
