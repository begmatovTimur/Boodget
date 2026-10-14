# transactions/signals.py
from django.db import transaction
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .models import Income, Expense
from .models import Account  # or wherever your Account model is

# Handle CREATE
@receiver(post_save, sender=Income)
def update_account_on_income_create(sender, instance, created, **kwargs):
    if created:
        with transaction.atomic():
            account = Account.objects.select_for_update().get(pk=instance.account_id)
            account.balance += instance.amount
            account.save(update_fields=["balance"])

@receiver(post_save, sender=Expense)
def update_account_on_expense_create(sender, instance, created, **kwargs):
    if created:
        with transaction.atomic():
            account = Account.objects.select_for_update().get(pk=instance.account_id)
            account.balance -= instance.amount
            account.save(update_fields=["balance"])

# Handle DELETE
@receiver(post_delete, sender=Income)
def revert_account_on_income_delete(sender, instance, **kwargs):
    with transaction.atomic():
        account = Account.objects.select_for_update().filter(pk=instance.account_id).first()
        if account:
            account.balance -= instance.amount
            account.save(update_fields=["balance"])

@receiver(post_delete, sender=Expense)
def revert_account_on_expense_delete(sender, instance, **kwargs):
    with transaction.atomic():
        account = Account.objects.select_for_update().filter(pk=instance.account_id).first()
        if account:
            account.balance += instance.amount
            account.save(update_fields=["balance"])

# Handle UPDATE
@receiver(pre_save, sender=Income)
def adjust_account_on_income_update(sender, instance, **kwargs):
    if instance.pk:
        old = Income.objects.get(pk=instance.pk)
        diff = instance.amount - old.amount
        if diff:
            with transaction.atomic():
                account = Account.objects.select_for_update().get(pk=instance.account_id)
                account.balance += diff
                account.save(update_fields=["balance"])

@receiver(pre_save, sender=Expense)
def adjust_account_on_expense_update(sender, instance, **kwargs):
    if instance.pk:
        old = Expense.objects.get(pk=instance.pk)
        diff = instance.amount - old.amount
        if diff:
            with transaction.atomic():
                account = Account.objects.select_for_update().get(pk=instance.account_id)
                account.balance -= diff
                account.save(update_fields=["balance"])
