from django.contrib import admin

from .models_files.account_model import Account
from .models_files.expense_category_model import ExpenseCategory
from .models_files.expense_model import Expense
from .models_files.income_model import Income
from .models_files.income_source_model import IncomeSource

admin.site.register(Account)
admin.site.register(Expense)
admin.site.register(ExpenseCategory)
admin.site.register(Income)
admin.site.register(IncomeSource)

