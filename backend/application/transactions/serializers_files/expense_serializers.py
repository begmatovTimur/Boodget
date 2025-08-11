from rest_framework import serializers

from ..models import Expense, ExpenseCategory


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    created_at = serializers.DateField(format="%Y-%m-%d", read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=ExpenseCategory.objects.all())
    category_details = ExpenseCategorySerializer(source='category', read_only=True)
    account = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Expense
        fields = [
            'id', 'amount', 'note', 'created_at', 'updated_at',
            'category', 'category_details', 'account', 'is_active'
        ]
