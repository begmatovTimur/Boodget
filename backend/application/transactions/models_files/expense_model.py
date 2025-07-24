from django.db import models

from .account_model import Account
from .expense_category_model import ExpenseCategory


class Expense(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    note = models.TextField(blank=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.note

    class Meta:
        db_table = 'expenses'

