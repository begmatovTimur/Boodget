from rest_framework import generics, status, permissions
from rest_framework.response import Response

from .models import User
from .serializers import UserWriteSerializer, ProfileSerializer, ChangePasswordSerializer


class RegisterUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserWriteSerializer

    def create(self, request, *args, **kwargs):
        queryset = User.objects.filter(username=request.data['username'])
        print(queryset)
        if not queryset.exists():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
        else:
            return Response({'message': 'USER_EXISTS'}, status = status.HTTP_400_BAD_REQUEST)

        tokens = UserWriteSerializer.get_tokens(user)
        print(tokens)

        return Response({
            'user': UserWriteSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)