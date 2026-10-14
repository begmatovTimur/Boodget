from decimal import Decimal

from rest_framework import serializers

from .. models import Income, IncomeSource


class IncomeSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomeSource
        fields = '__all__'


class IncomeSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal("0.01"))
    created_at = serializers.DateField(format="%Y-%m-%d", read_only=True)
    source = serializers.PrimaryKeyRelatedField(queryset=IncomeSource.objects.filter(is_active=True))

    class Meta:
        model = Income
        exclude = ['account']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['source'] = IncomeSourceSerializer(instance.source).data if instance.source else None
        return rep


class IncomeTransactionsSerializer(serializers.ModelSerializer):
    class Meta:
        fields = 'id, '
