from rest_framework import generics, status
from rest_framework.response import Response

from .models import User
from .serializers import UserWriteSerializer


class RegisterUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserWriteSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        tokens = UserWriteSerializer.get_tokens(user)
        print(tokens)

        return Response({
            'user': UserWriteSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)