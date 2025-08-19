from django.urls import path

from .serializers import ProfileSerializer
from .views import RegisterUser, ProfileView, ChangePasswordView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('reset-password/', ChangePasswordView.as_view(), name='profile'),
]
