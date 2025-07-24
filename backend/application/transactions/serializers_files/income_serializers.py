from rest_framework import serializers

from .. models import Income, IncomeSource


class IncomeSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomeSource
        fields = '__all__'


class IncomeSerializer(serializers.ModelSerializer):
    created_at = serializers.DateField(format="%Y-%m-%d")
    source = IncomeSourceSerializer(read_only=True)

    class Meta:
        model = Income
        fields = '__all__'
