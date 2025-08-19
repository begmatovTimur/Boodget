from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Role, User
from transactions.models_files.account_model import Account


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'



class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    class Meta:
        model = User
        fields = '__all__'


class UserWriteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'password', 'role']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)
        Account.objects.create(user=user)
        return user

    @staticmethod
    def get_tokens(user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }





class ProfileSerializer(serializers.ModelSerializer):
    balance = serializers.DecimalField(source='account.balance', max_digits=20, decimal_places=2, read_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'created_at', 'balance']
        read_only_fields = ['created_at', 'balance']

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate(self, data):
        user = self.context['request'].user

        # Check current password
        if not user.check_password(data['current_password']):
            raise serializers.ValidationError({"current_password": "Wrong password"})

        # Check new passwords match
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({"new_password": "Passwords do not match"})

        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])  # hashes automatically
        user.save()
        return user
