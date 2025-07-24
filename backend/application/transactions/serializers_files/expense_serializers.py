from rest_framework import serializers

from ..models import Expense, ExpenseCategory


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    created_at = serializers.DateField(format="%Y-%m-%d")
    category = ExpenseCategorySerializer(read_only=True)

    class Meta:
        model = Expense
        fields = '__all__'
